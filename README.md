# SaaS Foundation (Phase 1)

Production-style SaaS-ready starter with:
- Next.js 15 frontend (TypeScript, Tailwind, Zustand, Firebase phone OTP)
- FastAPI backend (async SQLAlchemy, JWT auth, modular APIs)
- PostgreSQL database
- Docker Compose orchestration

## Architecture
- `frontend/`: App Router UI, auth flows, protected dashboard shell.
- `backend/`: Versioned API (`/api/v1`), service layer, schemas, models, security.
- `docs/`: Optional future architecture docs.
- `docker-compose.yml`: Full stack local boot.

## Features implemented
- Phone OTP login via Firebase (frontend OTP + backend token verification).
- JWT session generation and protected profile endpoint.
- SaaS-ready foldering prepared for analytics/billing/admin/feature modules.
- Rate limiting middleware and CORS controls.

## Quick start
1. Copy `.env.example` into `.env` and fill Firebase credentials.
2. Run with Docker:
   ```bash
   docker compose up --build
   ```
3. Open `http://localhost:3000`.
4. API health check: `http://localhost:8000/health`.

## Future SaaS extension points
- Add organizations/teams tables.
- Add role-based access policies.
- Add billing module in `backend/app/services/billing`.
- Add websocket and events module.
