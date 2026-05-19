# Run Instructions (Beginner Friendly)

## 1) Prerequisites
- Option A (easiest): Docker + Docker Compose
- Option B (local): Node 20+, Python 3.12+

## 2) Environment setup
From project root:
```bash
cp .env.example .env
```
Required key:
- `DATABASE_URL=sqlite+aiosqlite:///./data/app.db`

Also set Firebase values:
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

SQLite and logs persist in local folders:
- `data/app.db`
- `backend/logs/*.log`

## 5) Run without Docker
### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -e .
cd ..
uvicorn backend.app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 6) Troubleshooting
- OTP not sent: ensure Firebase phone auth and localhost domain are enabled.
- 401 from backend: verify `FIREBASE_WEB_API_KEY` belongs to the same Firebase project.
- DB issues: delete `data/app.db` and restart to auto-create fresh tables.
