from __future__ import annotations

import os
import hashlib
import hmac
import secrets
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from supabase import Client, create_client

BASE_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = BASE_DIR / "public" if (BASE_DIR / "public").exists() else BASE_DIR
load_dotenv(BASE_DIR / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
app = FastAPI(title="Paisa Vasool", version="1.0.0")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.sha256(f"{salt}:{password}".encode()).hexdigest()
    return f"sha256${salt}${digest}"


def verify_password(password: str, stored_hash: str) -> bool:
    if not stored_hash or not stored_hash.startswith("sha256$"):
        return False
    try:
        _, salt, expected_digest = stored_hash.split("$", 2)
        actual_digest = hashlib.sha256(f"{salt}:{password}".encode()).hexdigest()
        return hmac.compare_digest(actual_digest, expected_digest)
    except (ValueError, TypeError):
        return False


def get_logged_user(request: Request) -> str:
    user_name = (request.headers.get("x-logged-in-user") or "").strip()
    if not user_name:
        raise HTTPException(status_code=401, detail="Authentication required.")
    return user_name


def get_user(login_name: str) -> dict[str, Any] | None:
    result = supabase.table("users").select("*").eq("login", login_name).limit(1).execute()
    return result.data[0] if result.data else None


def serialize_team(team: dict[str, Any]) -> dict[str, Any]:
    members = supabase.table("team_members").select("member_name").eq("team_id", team["id"]).order("member_name").execute()
    collections = supabase.table("money_collections").select("id, event_name, member_name, amount, date").eq("team_id", team["id"]).order("date", desc=True).execute()
    heads = supabase.table("team_heads").select("head_login").eq("team_id", team["id"]).order("id").execute()
    return {
        "id": team["id"],
        "name": team["name"],
        "headName": team["head_name"],
        "heads": [item["head_login"] for item in heads.data],
        "members": [item["member_name"] for item in members.data],
        "collections": [
            {"id": item["id"], "eventName": item["event_name"], "memberName": item["member_name"], "amount": float(item["amount"]), "date": item["date"]}
            for item in collections.data
        ],
        "createdAt": team["created_at"],
    }


def fetch_teams(user_id: int) -> list[dict[str, Any]]:
    user = get_user_by_id(user_id)
    owned = supabase.table("teams").select("*").eq("user_id", user_id).execute().data
    head_rows = supabase.table("team_heads").select("team_id").eq("head_login", user["login"]).execute().data
    head_ids = [row["team_id"] for row in head_rows]
    headed = supabase.table("teams").select("*").in_("id", head_ids).execute().data if head_ids else []
    teams = {team["id"]: team for team in [*owned, *headed]}
    return [serialize_team(team) for team in sorted(teams.values(), key=lambda team: team["created_at"])]


def get_user_by_id(user_id: int) -> dict[str, Any]:
    result = supabase.table("users").select("*").eq("id", user_id).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="Authentication required.")
    return result.data[0]


def find_user_team(user_id: int, team_id: str) -> dict[str, Any]:
    user = get_user_by_id(user_id)
    result = supabase.table("teams").select("*").eq("id", team_id).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Team not found.")
    head = supabase.table("team_heads").select("id").eq("team_id", team_id).eq("head_login", user["login"]).limit(1).execute()
    if result.data[0]["user_id"] != user_id and not head.data:
        raise HTTPException(status_code=403, detail="You are not authorized for this team.")
    return result.data[0]


@app.get("/api/health")
async def healthcheck() -> dict[str, str]:
    try:
        for table in ("users", "teams", "team_heads", "team_members", "money_collections", "interest_records"):
            supabase.table(table).select("*").limit(0).execute()
        supabase.table("users").select("password_hash").limit(0).execute()
    except Exception as error:
        raise HTTPException(status_code=503, detail="Supabase schema is not ready. Run supabase_schema.sql in Supabase SQL Editor.") from error
    return {"status": "ok", "app": "Paisa Vasool", "database": "supabase"}


@app.post("/api/login")
async def login(payload: dict[str, str]):
    login_name = (payload.get("login") or "").strip()
    password = (payload.get("password") or "").strip()
    if not login_name or not password:
        raise HTTPException(status_code=400, detail="Login and password are required.")
    user = get_user(login_name)
    if not user or not verify_password(password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="No account found with that login and password.")
    return {"success": True, "message": f"Welcome back, {login_name}!"}


@app.post("/api/signup")
async def signup(payload: dict[str, Any]):
    login_name = (payload.get("username") or payload.get("login") or "").strip()
    email = (payload.get("email") or "").strip()
    password = (payload.get("password") or "").strip()
    confirm_password = (payload.get("confirmPassword") or "").strip()
    mobile_number = (payload.get("mobileNumber") or payload.get("mobile") or "").strip()
    team_name = (payload.get("teamName") or "").strip() or login_name
    if not login_name or not email or not password or not mobile_number:
        raise HTTPException(status_code=400, detail="Username, email, password, and mobile number are required.")
    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")
    if get_user(login_name):
        raise HTTPException(status_code=409, detail="This username already exists.")
    if supabase.table("users").select("id").eq("email", email).limit(1).execute().data:
        raise HTTPException(status_code=409, detail="This email already exists.")
    user = supabase.table("users").insert({"login": login_name, "email": email, "password_hash": hash_password(password), "mobile_number": mobile_number, "team_name": team_name, "created_at": now_iso()}).execute().data[0]
    team = supabase.table("teams").insert({"user_id": user["id"], "name": team_name, "head_name": login_name, "created_at": now_iso()}).execute().data[0]
    supabase.table("team_heads").insert({"team_id": team["id"], "head_login": login_name}).execute()
    supabase.table("team_members").insert({"team_id": team["id"], "member_name": login_name}).execute()
    return {"success": True, "message": f"Account created for {login_name}. Please login."}


@app.get("/api/teams")
async def get_teams(request: Request) -> dict[str, list[dict[str, Any]]]:
    user = get_user(get_logged_user(request))
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication required.")
    return {"teams": fetch_teams(user["id"])}


@app.post("/api/teams")
async def create_team(request: Request, payload: dict[str, Any]):
    user = get_user(get_logged_user(request))
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication required.")
    name = (payload.get("name") or "").strip()
    head_names = [str(item).strip() for item in payload.get("headNames", []) if str(item).strip()]
    if not head_names and payload.get("headName"):
        head_names = [str(payload["headName"]).strip()]
    if not name or len(head_names) != 3:
        raise HTTPException(status_code=400, detail="Team name and team head are required.")
    if len(set(head_names)) != 3:
        raise HTTPException(status_code=400, detail="The three team heads must be different.")
    if user["login"] not in head_names:
        raise HTTPException(status_code=400, detail="Your username must be one of the three team heads.")
    for head_name in head_names:
        if get_user(head_name) is None:
            raise HTTPException(status_code=400, detail=f"Team head '{head_name}' must create an account first.")
    team = supabase.table("teams").insert({"user_id": user["id"], "name": name, "head_name": head_names[0], "created_at": now_iso()}).execute().data[0]
    supabase.table("team_heads").insert([{"team_id": team["id"], "head_login": head} for head in head_names]).execute()
    for member in payload.get("members") or []:
        member_name = str(member).strip()
        if member_name:
            supabase.table("team_members").upsert({"team_id": team["id"], "member_name": member_name}, on_conflict="team_id,member_name").execute()
    return {"team": serialize_team(team)}


@app.post("/api/teams/{team_id}/members")
async def add_member(request: Request, team_id: str, payload: dict[str, str]):
    user = get_user(get_logged_user(request))
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication required.")
    member_name = (payload.get("memberName") or "").strip()
    if not member_name:
        raise HTTPException(status_code=400, detail="Member name is required.")
    team = find_user_team(user["id"], team_id)
    head = supabase.table("team_heads").select("id").eq("team_id", team_id).eq("head_login", user["login"]).limit(1).execute()
    if not head.data:
        raise HTTPException(status_code=403, detail="Only a team head can add members.")
    supabase.table("team_members").upsert({"team_id": team_id, "member_name": member_name}, on_conflict="team_id,member_name").execute()
    return {"team": serialize_team(team)}


@app.post("/api/teams/{team_id}/collections")
async def collect_money(request: Request, team_id: str, payload: dict[str, Any]):
    user = get_user(get_logged_user(request))
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication required.")
    event_name = (payload.get("eventName") or "").strip()
    member_name = (payload.get("memberName") or "").strip()
    if not event_name or not member_name or payload.get("amount") is None:
        raise HTTPException(status_code=400, detail="Event name, member name, and amount are required.")
    try:
        numeric_amount = float(payload["amount"])
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Amount must be a number.") from None
    if numeric_amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero.")
    team = find_user_team(user["id"], team_id)
    saved = supabase.table("money_collections").insert({"team_id": team_id, "event_name": event_name, "member_name": member_name, "amount": numeric_amount, "date": now_iso()}).execute().data[0]
    record = {"id": saved["id"], "eventName": saved["event_name"], "memberName": saved["member_name"], "amount": float(saved["amount"]), "date": saved["date"]}
    return {"record": record, "team": serialize_team(team)}


@app.get("/api/profile")
async def profile(request: Request) -> dict[str, Any]:
    user = get_user(get_logged_user(request))
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication required.")
    return {"profile": {"login": user["login"], "email": user["email"], "mobileNumber": user["mobile_number"], "teamName": user.get("team_name") or ""}}


@app.put("/api/profile")
async def update_profile(request: Request, payload: dict[str, str]) -> dict[str, Any]:
    user = get_user(get_logged_user(request))
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication required.")
    email = (payload.get("email") or "").strip()
    mobile_number = (payload.get("mobileNumber") or "").strip()
    team_name = (payload.get("teamName") or "").strip()
    if not email or not mobile_number or not team_name:
        raise HTTPException(status_code=400, detail="Email, mobile number, and team name are required.")
    existing = supabase.table("users").select("id").eq("email", email).neq("id", user["id"]).limit(1).execute()
    if existing.data:
        raise HTTPException(status_code=409, detail="This email already exists.")
    updated = supabase.table("users").update({"email": email, "mobile_number": mobile_number, "team_name": team_name}).eq("id", user["id"]).execute().data[0]
    return {"message": "Profile updated successfully.", "profile": {"login": updated["login"], "email": updated["email"], "mobileNumber": updated["mobile_number"], "teamName": updated.get("team_name") or ""}}


@app.put("/api/profile/password")
async def update_password(request: Request, payload: dict[str, str]) -> dict[str, str]:
    user = get_user(get_logged_user(request))
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication required.")
    current_password = payload.get("currentPassword") or ""
    new_password = payload.get("newPassword") or ""
    confirm_password = payload.get("confirmPassword") or ""
    if not verify_password(current_password, user.get("password_hash", "")):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")
    if len(new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters.")
    if new_password != confirm_password:
        raise HTTPException(status_code=400, detail="New passwords do not match.")
    supabase.table("users").update({"password_hash": hash_password(new_password)}).eq("id", user["id"]).execute()
    return {"message": "Password updated successfully."}


@app.get("/")
async def index() -> FileResponse:
    return FileResponse(PUBLIC_DIR / "index.html")


app.mount("/", StaticFiles(directory=str(PUBLIC_DIR), html=False), name="static")
