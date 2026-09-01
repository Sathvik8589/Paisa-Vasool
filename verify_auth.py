import tempfile
from pathlib import Path

from fastapi.testclient import TestClient

import main


def main():
    db = Path(tempfile.mkdtemp()) / 'paisa_vasool.db'
    main.DATABASE_PATH = db
    main.initialize_database()
    client = TestClient(main.app)

    signup = client.post(
        '/api/signup',
        json={
            'username': 'demoUser',
            'email': 'demo@example.com',
            'password': 'secret123',
            'confirmPassword': 'secret123',
            'mobileNumber': '9876543210',
            'teamName': 'Demo Team',
        },
    )

    login = client.post(
        '/api/login',
        json={'login': 'demoUser', 'password': 'secret123'},
    )

    print('SIGNUP', signup.status_code, signup.json())
    print('LOGIN', login.status_code, login.json())
    print('DB_EXISTS', db.exists())


if __name__ == '__main__':
    main()
