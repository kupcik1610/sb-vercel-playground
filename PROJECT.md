# What this is and why it exists

A **throwaway learning project** for getting hands-on with the two platforms the
real MESync project runs on: **Supabase** (database + auth + API) and **Vercel**
(hosting for the Next.js app). It is intentionally barebones. Break it, rewrite
it, delete it — nothing here matters.

It lives **outside** the `mesync-app` repo on purpose. That repo forbids any
Supabase/Vercel wiring, `.env` files, or migrations, so this sandbox keeps the
real project clean.

## The app, in one line

An **equipment service tracker**: log in, add a piece of equipment with a
service interval, and the app tells you whether each item is **DUE** or **OK**.

That's it. But it's chosen so that the four things you actually need to learn
for MESync are all in it — see the mapping below.

## Why this app, specifically (the MESync mapping)

MESync is a service-operations platform for a medical-equipment company. This
toy is a deliberately tiny slice of it, so the muscle memory transfers:

| This toy teaches | …which is exactly MESync's | Where to look |
|---|---|---|
| **Supabase Auth** (sign up / in / out, session via cookies) | Role-gated office vs. technician access | `src/app/actions.ts`, `src/middleware.ts` |
| **Row Level Security** — each user sees only their own rows | How real customer data is protected; the genuinely hard part | `supabase-setup.sql` |
| **Status computed from data, not stored** — DUE/OK is derived from dates | "Documents are outputs of structured data" — MESync's core principle | `dueInfo()` in `src/app/page.tsx` |
| **Server-side logic** — all writes happen in Server Actions | "Client collects input, server owns the rules" | `src/app/actions.ts` |

The single table here (`equipment`) is a stand-in for MESync's much richer
hierarchy of **accounts → facilities → service_contexts → equipment**. Keeping
it to one table is the "barebones" part; the *patterns* are the real ones.

## What I deliberately left out (and why)

- **No multi-table relations / joins.** MESync's real model is relational
  (accounts own facilities own equipment). One table is enough to learn auth +
  RLS + derived status first. Adding a `facilities` table with a foreign key is
  the natural **next exercise**.
- **No roles.** MESync gates office vs. technician views. Here everyone is just
  "a user." Adding a `role` and RLS that branches on it is another good exercise.
- **No magic-link / OAuth.** Plain email+password with email confirmation
  turned off — fewer moving parts for a sandbox. Swapping in Google OAuth (what
  MESync uses via Google Workspace) is a later exercise.
- **Due logic is in TypeScript, not the database.** On purpose, so you can see
  the app-side version first. `supabase-setup.sql` has a commented-out SQL view
  showing the "push it into the database" version, which is closer to how
  MESync does it.

## Ideas to extend it (in rough difficulty order)

1. Add a `facilities` table and make each equipment row reference a facility
   (foreign key) — learn relational queries and joins.
2. Add a `notes`/`service_log` table so each "Mark serviced" writes a history
   row — learn one-to-many + an audit trail (MESync audits every status change).
3. Move the DUE/OK calculation into a Postgres view or generated column.
4. Add a `role` column + a second RLS policy so an "admin" can see everyone's
   equipment.
5. Swap email/password auth for Google OAuth.

## How to actually run it

See `README.md` for the step-by-step (create a free Supabase project, run the
SQL, drop in two env vars, `npm install`, `npm run dev`). Deployment to Vercel
is documented there too but is **not** done automatically — that's your call to
make when you're ready.

## Status / housekeeping

- Created as a scaffold. **Dependencies are not installed yet** — run
  `npm install` first.
- No secrets are committed. `.env.local` is git-ignored; only
  `.env.local.example` (placeholders) is tracked.
- Nothing here is deployed anywhere.
