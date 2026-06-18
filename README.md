# International Yoga Day 2026 — Registration Site

Landing page, registration form, and admin panel with Excel export. Built with
Next.js (App Router) + Postgres, ready to deploy on **Vercel + Neon**.

- **Landing page** (`/`) — event details + registration form (name, email, mobile)
- **Admin panel** (`/admin`) — password-protected list of registrations, live
  search, stats, and one-click **Excel (.xlsx) export**

## Run locally

```bash
pnpm install          # or npm install
pnpm dev              # http://localhost:3000
```

No database setup needed locally — it uses **PGlite** (an in-process Postgres,
persisted to `./.pglite-data`). The admin password defaults to `yoga2026`
(see `.env.example` to change it).

Admin panel: <http://localhost:3000/admin>

## Deploy to Vercel + Neon

1. Push this repo to GitHub and import it into Vercel.
2. In the Vercel project → **Storage** → create a **Neon** Postgres database.
   Vercel injects `DATABASE_URL` automatically.
3. Add env vars in Vercel → **Settings → Environment Variables**:
   - `ADMIN_PASSWORD` — your admin password
   - `ADMIN_SESSION_SECRET` — any long random string
4. Deploy. The `registrations` table is created automatically on first use.

That's it — same SQL runs against Neon in production and PGlite locally.

## Data model

`registrations` — `id`, `name`, `email` (unique), `mobile`, `created_at`.

## Stack

Next.js 15 · React 19 · Tailwind CSS v4 · Postgres (Neon / PGlite) · ExcelJS
