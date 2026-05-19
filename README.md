# SaaS Foundation (Phase 1)

Production-style SaaS-ready starter with:
- Next.js 15 frontend (TypeScript, Tailwind, Zustand, Firebase phone OTP)
- FastAPI backend (async SQLAlchemy, JWT auth, modular APIs)
- SQLite local database (`data/app.db`)
- Docker Compose orchestration (frontend + backend)

## Local storage layout
- `data/app.db` (auto-created)
- `backend/logs/auth.log`
- `backend/logs/server.log`
- `backend/logs/error.log`
- `backend/logs/activity.log`
- `backend/storage/` for future files

## Features implemented
- Phone OTP login via Firebase (frontend OTP + backend token verification)
- JWT session generation and protected profile endpoint
- Auto-create local SQLite DB and tables on startup
- Local file-based logging for auth, server, error, and activity streams

## Quick start
1. Copy `.env.example` to `.env` and fill Firebase credentials.
2. Run backend + frontend:
   ```bash
   docker compose up --build
   ```
3. Open `http://localhost:3000`.
4. API health check: `http://localhost:8000/health`.

## Migration path to PostgreSQL later
The database layer uses SQLAlchemy + Alembic with a `DATABASE_URL` abstraction; switch URL and run migrations when moving to PostgreSQL.
