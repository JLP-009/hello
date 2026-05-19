# Run Instructions (Beginner Friendly)

## 1) Prerequisites
- Docker + Docker Compose
- (Optional local dev) Node 20+, Python 3.12+, PostgreSQL 16+

## 2) Environment setup
At project root:
```bash
cp .env.example .env
```
Update all Firebase values:
- `NEXT_PUBLIC_FIREBASE_*`
- `FIREBASE_WEB_API_KEY`
- `FIREBASE_PROJECT_ID`

## 3) Firebase phone auth setup
1. Create Firebase project.
2. Enable **Authentication > Sign-in method > Phone**.
3. Add `localhost` in authorized domains.
4. Copy web config keys into `.env`.

## 4) Run with Docker (recommended)
```bash
docker compose up --build
```
Services:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Postgres: `localhost:5432`

## 5) Local dev (without Docker)
### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -e .
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 6) Troubleshooting
- OTP not sent: check Firebase phone auth enabled and domain whitelist.
- 401 from backend: verify `FIREBASE_WEB_API_KEY` matches frontend project.
- DB connection issue: confirm `DATABASE_URL` points to reachable Postgres.
