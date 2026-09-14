# AGENTS.md

GigBoard = two independent npm apps (no root workspace): `frontend/` (React + Vite + TS) and `backend/` (Express, PostgreSQL/Neon). Run the two dev servers separately.

## Commands
- Backend (`backend/`): `npm run dev` (nodemon, port 5000), `npm start`.
- Backend migrations: `npm run migrate` — runs `scripts/migrate.js`, which applies every `migrations/*.sql` not yet recorded in the `schema_migrations` table, in filename order. Add a new `.sql` file there for schema changes; never hand-apply SQL.
- Frontend (`frontend/`): `npm run dev` (Vite, port 5173), `npm run build` (this is the **only typecheck gate** — `tsc -b && vite build`).
- There are **no tests, no linter, no CI** anywhere. Do not invent a test/lint command; the only automated check is the frontend build.

## Backend
- ESM (`"type": "module"`) — relative imports MUST include the `.js` extension (e.g. `../models/Gig.js`).
- Requires `backend/.env` (gitignored; live creds already present, plus `.env.example` for reference). Server won't serve auth or DB work without `DATABASE_URL` (Neon), `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`. Never commit or modify these values with placeholders.
- `config/db.js` sets `ssl.rejectUnauthorized = false` (required by Neon) — keep that when touching the pool.
- Routing: `server.js` mounts routers at `/api/<x>`. Add routes in `routes/`, controllers in `controllers/`, queries in `models/`.
- Auth: JWT access token in JSON/localStorage, refresh token in httpOnly cookie (SHA-256-hashed in DB, rotated on each refresh). `login`/`signup` are rate-limited (10/15 min/IP) via `express-rate-limit`. Refresh tokens are pruned on boot + daily by `utils/tokenCleanup.js`.
- Gigs: `GET /api/gigs` is public; `POST /api/gigs` requires auth (`requireAuth`), provider = the authenticated user. Never make gigs/orders endpoints public without auth.

## Frontend
- **No router library.** Navigation is hand-rolled in `src/App.tsx`: a `view` state + URL hash, backed by `history.pushState({view, gig})`. Browser back/forward works via the `popstate` handler (which restores `selectedGig`). To add a page, extend the `View` type in `src/types.ts`, the allowed-hash sets in `App.tsx`, and the render switch.
- **Marketplace is only partially wired to the API.** Browse + create are live (`src/api/gigs.ts`). Orders, order detail, profile, gig ratings (`rating`/`reviews`), and the "128 active gigs" count are still static/mock (`src/data/gigs.ts`). `BrowsePage` falls back to mock seed data when the API returns empty or errors.
- All network calls must go through `src/api/axios.ts` (base URL = `VITE_API_URL`, default `http://localhost:5000/api`): it injects the Bearer token and single-flight-refreshes on 401. Posting gigs from the UI therefore needs the user to be signed in.
- Presentational gig fields (`pin`, `tag`, `rotation`) are derived by category in `src/api/gigs.ts`; never store them in the DB.

## Verification loop
- After backend changes: restart via `npm run dev` (nodemon) and smoke-test with PowerShell: `Invoke-RestMethod http://localhost:5000/api/gigs`.
- After frontend changes: `npm run build` (fails on type errors).
- Node one-liners crash on nested quotes in this PowerShell — write a temp `.mjs` file instead of inline `node -e` for anything with quotes.