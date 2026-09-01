from fastapi.testclient import TestClient

import main


def test_signup_and_login_flow_uses_database(tmp_path, monkeypatch):
    db_path = tmp_path / "paisa_vasool.db"
    monkeypatch.setattr(main, "DATABASE_PATH", db_path, raising=False)

    if hasattr(main, "initialize_database"):
        main.initialize_database()

    client = TestClient(main.app)

    signup_response = client.post(
        "/api/signup",
        json={
            "username": "demoUser",
            "email": "demo@example.com",
            "password": "secret123",
            "confirmPassword": "secret123",
            "mobileNumber": "9876543210",
            "teamName": "Demo Team",
        },
    )

    assert signup_response.status_code == 200, signup_response.text
    assert signup_response.json()["success"] is True
    assert db_path.exists(), "database file should be created for auth storage"

    login_response = client.post(
        "/api/login",
        json={"login": "demoUser", "password": "secret123"},
    )

    assert login_response.status_code == 200, login_response.text
    assert login_response.json()["message"].startswith("Welcome back")
