from __future__ import annotations

import json
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = BASE_DIR / "public" if (BASE_DIR / "public").exists() else BASE_DIR
DATABASE_PATH = BASE_DIR / "paisa_vasool.db"
DATA_FILE = BASE_DIR / "data.json"

app = FastAPI(title="Paisa Vasool", version="1.0.0")


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                login TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                mobile_number TEXT NOT NULL,
                team_name TEXT,
                created_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS teams (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                head_name TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS team_members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                team_id TEXT NOT NULL,
                member_name TEXT NOT NULL,
                UNIQUE(team_id, member_name),
                FOREIGN KEY(team_id) REFERENCES teams(id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS money_collections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                team_id TEXT NOT NULL,
                event_name TEXT NOT NULL,
                member_name TEXT NOT NULL,
                amount REAL NOT NULL,
                date TEXT NOT NULL,
                FOREIGN KEY(team_id) REFERENCES teams(id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS interest_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                principal_amount REAL NOT NULL,
                interest_rate REAL NOT NULL,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL,
                interest_amount REAL NOT NULL,
                total_amount REAL NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
            """
        )
        connection.commit()


def load_data() -> dict[str, Any]:
    if DATA_FILE.exists():
        try:
            text = DATA_FILE.read_text(encoding="utf-8").strip()
            if text:
                return json.loads(text)
        except json.JSONDecodeError:
            pass

    fallback = {"teams": [], "users": []}
    DATA_FILE.write_text(json.dumps(fallback, indent=2), encoding="utf-8")
    return fallback


def save_data(data: dict[str, Any]) -> None:
    DATA_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")


def normalize_team(team: dict[str, Any]) -> dict[str, Any]:
    clean_team = dict(team)
    clean_team.pop("photos", None)
    return clean_team


def serialize_team(team_row: sqlite3.Row, members: list[str], collections: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "id": team_row["id"],
        "name": team_row["name"],
        "headName": team_row["head_name"],
        "members": members,
        "collections": collections,
        "createdAt": team_row["created_at"],
    }


def fetch_teams() -> list[dict[str, Any]]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT * FROM teams ORDER BY created_at ASC"
        ).fetchall()

        teams: list[dict[str, Any]] = []
        for row in rows:
            member_rows = connection.execute(
                "SELECT member_name FROM team_members WHERE team_id = ? ORDER BY member_name ASC",
                (row["id"],),
            ).fetchall()
            collection_rows = connection.execute(
                "SELECT id, event_name AS eventName, member_name AS memberName, amount, date FROM money_collections WHERE team_id = ? ORDER BY date DESC",
                (row["id"],),
            ).fetchall()

            teams.append(
                serialize_team(
                    row,
                    [member_row["member_name"] for member_row in member_rows],
                    [
                        {
                            "id": collection_row["id"],
                            "eventName": collection_row["eventName"],
                            "memberName": collection_row["memberName"],
                            "amount": float(collection_row["amount"]),
                            "date": collection_row["date"],
                        }
                        for collection_row in collection_rows
                    ],
                )
            )

    return teams


def get_logged_user(request: Request) -> str:
    user_name = (request.headers.get("x-logged-in-user") or "").strip()
    if not user_name:
        raise HTTPException(status_code=401, detail="Authentication required.")
    return user_name


initialize_database()


@app.get("/api/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok", "app": "Paisa Vasool"}


@app.post("/api/login")
async def login(payload: dict[str, str]):
    login_name = (payload.get("login") or "").strip()
    password = (payload.get("password") or "").strip()

    if not login_name or not password:
        raise HTTPException(status_code=400, detail="Login and password are required.")

    with get_connection() as connection:
        user = connection.execute(
            "SELECT login FROM users WHERE login = ? AND password = ?",
            (login_name, password),
        ).fetchone()

    if user is None:
        raise HTTPException(status_code=401, detail="No account found with that login and password.")

    return {"success": True, "message": f"Welcome back, {login_name}!"}


@app.post("/api/signup")
async def signup(payload: dict[str, Any]):
    login_name = (payload.get("username") or payload.get("login") or "").strip()
    email = (payload.get("email") or "").strip()
    password = (payload.get("password") or "").strip()
    confirm_password = (payload.get("confirmPassword") or "").strip()
    mobile_number = (payload.get("mobileNumber") or payload.get("mobile") or "").strip()
    team_name = (payload.get("teamName") or "").strip()

    if not login_name or not email or not password or not mobile_number:
        raise HTTPException(
            status_code=400,
            detail="Username, email, password, and mobile number are required.",
        )

    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    with get_connection() as connection:
        existing_user = connection.execute(
            "SELECT login FROM users WHERE login = ? OR email = ?",
            (login_name, email),
        ).fetchone()
        if existing_user is not None:
            if existing_user["login"] == login_name:
                raise HTTPException(status_code=409, detail="This username already exists.")
            raise HTTPException(status_code=409, detail="This email already exists.")

        team_name = team_name or login_name
        created_at = datetime.utcnow().isoformat()
        connection.execute(
            "INSERT INTO users (login, email, password, mobile_number, team_name, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (login_name, email, password, mobile_number, team_name, created_at),
        )
        user_id = connection.execute("SELECT id FROM users WHERE login = ?", (login_name,)).fetchone()["id"]

        team_id = str(len(fetch_teams()) + 1)
        connection.execute(
            "INSERT INTO teams (id, name, head_name, created_at) VALUES (?, ?, ?, ?)",
            (team_id, team_name, login_name, created_at),
        )
        connection.execute(
            "INSERT INTO team_members (team_id, member_name) VALUES (?, ?)",
            (team_id, login_name),
        )
        connection.commit()

    return {"success": True, "message": f"Account created for {login_name}. Please login."}


@app.get("/api/teams")
async def get_teams(request: Request) -> dict[str, list[dict[str, Any]]]:
    get_logged_user(request)
    return {"teams": [normalize_team(team) for team in fetch_teams()]}


@app.post("/api/teams")
async def create_team(request: Request, payload: dict[str, Any]):
    get_logged_user(request)
    name = (payload.get("name") or "").strip()
    head_name = (payload.get("headName") or "").strip()
    members = payload.get("members") or []

    if not name or not head_name:
        raise HTTPException(status_code=400, detail="Team name and team head are required.")

    with get_connection() as connection:
        team_id = str(len(fetch_teams()) + 1)
        created_at = datetime.utcnow().isoformat()
        connection.execute(
            "INSERT INTO teams (id, name, head_name, created_at) VALUES (?, ?, ?, ?)",
            (team_id, name, head_name, created_at),
        )
        for member in members:
            member_name = str(member).strip()
            if member_name:
                connection.execute(
                    "INSERT OR IGNORE INTO team_members (team_id, member_name) VALUES (?, ?)",
                    (team_id, member_name),
                )
        connection.commit()
        team = connection.execute(
            "SELECT * FROM teams WHERE id = ?",
            (team_id,),
        ).fetchone()

    return {"team": serialize_team(team, [member for member in members if str(member).strip()], [])}


@app.post("/api/teams/{team_id}/members")
async def add_member(request: Request, team_id: str, payload: dict[str, str]):
    get_logged_user(request)
    member_name = (payload.get("memberName") or "").strip()
    if not member_name:
        raise HTTPException(status_code=400, detail="Member name is required.")

    with get_connection() as connection:
        team = connection.execute("SELECT * FROM teams WHERE id = ?", (team_id,)).fetchone()
        if team is None:
            raise HTTPException(status_code=404, detail="Team not found.")

        connection.execute(
            "INSERT OR IGNORE INTO team_members (team_id, member_name) VALUES (?, ?)",
            (team_id, member_name),
        )
        connection.commit()

    return {"team": serialize_team(team, [member_name], [])}


@app.post("/api/teams/{team_id}/collections")
async def collect_money(request: Request, team_id: str, payload: dict[str, Any]):
    get_logged_user(request)
    event_name = (payload.get("eventName") or "").strip()
    member_name = (payload.get("memberName") or "").strip()
    amount = payload.get("amount")

    if not event_name or not member_name or amount is None:
        raise HTTPException(status_code=400, detail="Event name, member name, and amount are required.")

    try:
        numeric_amount = float(amount)
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Amount must be a number.") from None

    if numeric_amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero.")

    with get_connection() as connection:
        team = connection.execute("SELECT * FROM teams WHERE id = ?", (team_id,)).fetchone()
        if team is None:
            raise HTTPException(status_code=404, detail="Team not found.")

        collection_record = {
            "eventName": event_name,
            "memberName": member_name,
            "amount": numeric_amount,
            "date": datetime.utcnow().isoformat(),
        }
        connection.execute(
            "INSERT INTO money_collections (team_id, event_name, member_name, amount, date) VALUES (?, ?, ?, ?, ?)",
            (team_id, event_name, member_name, numeric_amount, collection_record["date"]),
        )
        connection.commit()

    return {"record": collection_record, "team": serialize_team(team, [], [collection_record])}


@app.get("/")
async def index() -> FileResponse:
    return FileResponse(PUBLIC_DIR / "index.html")


app.mount("/", StaticFiles(directory=str(PUBLIC_DIR), html=False), name="static")
