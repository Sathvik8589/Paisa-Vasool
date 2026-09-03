# Paisa Vasool

## Supabase setup

1. Open the Supabase project dashboard and go to **SQL Editor**.
2. Open [supabase_schema.sql](supabase_schema.sql), copy its entire contents, and run it in Supabase. This migration adds `team_heads`, adds `password_hash`, and removes the old plaintext `password` column.
3. Copy `.env.example` to `.env`.
4. Put the Supabase URL and keys in `.env`. Keep the service-role key server-side and never commit `.env`.
5. Install the Python dependencies:

```powershell
python -m pip install -r requirements.txt
```

6. Start the application:

```powershell
uvicorn main:app --reload
```

The local app is available at `http://127.0.0.1:8000/`.

The backend now stores users, teams, team heads, team members, and money collections in Supabase. Passwords are stored as salted hashes and are never stored as readable text. The old local SQLite file is not used by the application.
# Paisa-Vasool
Paisa Vasool – A web-based team management application for tracking member contributions, expenses, loans, interest, balances, and event photos with multilingual support.
