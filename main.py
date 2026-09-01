from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = BASE_DIR / "public"
DATA_FILE = BASE_DIR / "data.json"

app = FastAPI(title="Paisa Vasool", version="1.0.0")


def load_data() -> dict[str, Any]:
    if not DATA_FILE.exists():
        initial = {"teams": [], "users": []}
        DATA_FILE.write_text(json.dumps(initial, indent=2), encoding="utf-8")
        return initial

    try:
        text = DATA_FILE.read_text(encoding="utf-8").strip()
        if not text:
            initial = {"teams": [], "users": []}
            DATA_FILE.write_text(json.dumps(initial, indent=2), encoding="utf-8")
            return initial
        return json.loads(text)
    except json.JSONDecodeError:
        fallback = {"teams": [], "users": []}
        DATA_FILE.write_text(json.dumps(fallback, indent=2), encoding="utf-8")
        return fallback


def save_data(data: dict[str, Any]) -> None:
    DATA_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")


def normalize_team(team: dict[str, Any]) -> dict[str, Any]:
    clean_team = dict(team)
    clean_team.pop("photos", None)
    return clean_team


def get_logged_user(request: Request) -> str:
    user_name = (request.headers.get("x-logged-in-user") or "").strip()
    if not user_name:
        raise HTTPException(status_code=401, detail="Authentication required.")
    return user_name


@app.get("/api/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok", "app": "Paisa Vasool"}


@app.post("/api/login")
async def login(payload: dict[str, str]):
    login_name = (payload.get("login") or "").strip()
    password = (payload.get("password") or "").strip()

    if not login_name or not password:
        raise HTTPException(status_code=400, detail="Login and password are required.")

    data = load_data()
    user = next(
        (
            item
            for item in data.get("users", [])
            if item.get("login") == login_name and item.get("password") == password
        ),
        None,
    )

    if user is None:
        raise HTTPException(status_code=401, detail="No account found with that login and password.")

    return {"success": True, "message": f"Welcome back, {login_name}!"}


@app.post("/api/signup")
async def signup(payload: dict[str, str]):
    login_name = (payload.get("username") or payload.get("login") or "").strip()
    password = (payload.get("password") or "").strip()
    confirm_password = (payload.get("confirmPassword") or "").strip()
    mobile_number = (payload.get("mobileNumber") or payload.get("mobile") or "").strip()
    team_name = (payload.get("teamName") or "").strip()

    if not login_name or not password or not mobile_number or not team_name:
        raise HTTPException(status_code=400, detail="Username, password, mobile number, and team name are required.")

    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    data = load_data()
    if any(user.get("login") == login_name for user in data.get("users", [])):
        raise HTTPException(status_code=409, detail="This username already exists.")

    new_user = {
        "login": login_name,
        "password": password,
        "mobileNumber": mobile_number,
        "teamName": team_name,
    }
    data["users"].append(new_user)

    new_team = {
        "id": str(len(data["teams"]) + 1),
        "name": team_name,
        "headName": login_name,
        "members": [login_name],
        "collections": [],
        "createdAt": datetime.utcnow().isoformat(),
    }
    data["teams"].append(new_team)

    save_data(data)
    return {"success": True, "message": f"Account created for {login_name}. Please login."}


@app.get("/api/teams")
async def get_teams(request: Request) -> dict[str, list[dict[str, Any]]]:
    get_logged_user(request)
    teams = load_data().get("teams", [])
    return {"teams": [normalize_team(team) for team in teams]}


@app.post("/api/teams")
async def create_team(request: Request, payload: dict[str, Any]):
    get_logged_user(request)
    name = (payload.get("name") or "").strip()
    head_name = (payload.get("headName") or "").strip()
    members = payload.get("members") or []

    if not name or not head_name:
        raise HTTPException(status_code=400, detail="Team name and team head are required.")

    data = load_data()
    new_team = {
        "id": str(len(data["teams"]) + 1),
        "name": name,
        "headName": head_name,
        "members": [str(item).strip() for item in members if str(item).strip()],
        "collections": [],
        "createdAt": datetime.utcnow().isoformat(),
    }
    data["teams"].append(new_team)
    save_data(data)
    return {"team": new_team}


@app.post("/api/teams/{team_id}/members")
async def add_member(request: Request, team_id: str, payload: dict[str, str]):
    get_logged_user(request)
    member_name = (payload.get("memberName") or "").strip()
    if not member_name:
        raise HTTPException(status_code=400, detail="Member name is required.")

    data = load_data()
    team = next((item for item in data["teams"] if item["id"] == team_id), None)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found.")

    team["members"].append(member_name)
    save_data(data)
    return {"team": team}


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

    data = load_data()
    team = next((item for item in data["teams"] if item["id"] == team_id), None)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found.")

    collection_record = {
        "id": str(len(team["collections"]) + 1),
        "eventName": event_name,
        "memberName": member_name,
        "amount": numeric_amount,
        "date": datetime.utcnow().isoformat(),
    }
    team["collections"].append(collection_record)
    save_data(data)
    return {"record": collection_record, "team": team}


@app.get("/")
async def index() -> FileResponse:
    return FileResponse(PUBLIC_DIR / "index.html")


app.mount("/", StaticFiles(directory=str(PUBLIC_DIR), html=False), name="static")
