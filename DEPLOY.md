# Deploy DevHub (free portfolio demo)

Simpler than Orbit: **one Render Web Service** can run UI + API + SQLite.

> Free tier sleeps after idle. First open may take 30–90 seconds.

## 1. Push code

Repo: `https://github.com/moadh704/devhub`

## 2. Render → New Web Service

| Field | Value |
|--------|--------|
| **Repo** | `moadh704/devhub` |
| **Branch** | `main` |
| **Runtime** | Node |
| **Build Command** | `npm install --prefix client && npm run build --prefix client && npm install --prefix server && npm run db:generate --prefix server && npm run db:push --prefix server` |
| **Start Command** | `npm start --prefix server` |
| **Plan** | Free |

## 3. Environment variables

```env
NODE_ENV=production
JWT_SECRET=<long-random-string>
CLIENT_URL=https://YOUR-SERVICE.onrender.com
DATABASE_URL=file:./prod.db
SERVE_SPA=true
```

After first deploy, set `CLIENT_URL` to the exact service URL (no trailing slash).

## 4. Verify

- `https://YOUR-SERVICE.onrender.com` → app UI  
- `https://YOUR-SERVICE.onrender.com/api/health` → `{ "ok": true, "spa": true }`  
- Register / login / launch a project  

## 5. Portfolio

When live, set DevHub `demo` on `moadh704.github.io` to that URL.

## Notes

- SQLite file lives on the server disk. Free redeploys can reset data — fine for portfolio demos.  
- For durable data later: free Postgres (Neon) + update Prisma `provider` to `postgresql`.  
- Optional seed after deploy: `npm run seed --prefix server` via Render shell if available.
