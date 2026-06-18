# Supabase + Vercel Playground

A barebones **equipment service tracker** for learning the MESync stack
hands-on. See [`PROJECT.md`](PROJECT.md) for what it is and why each part
exists. This file is just the how-to-run.

Stack: **Next.js (App Router)** · **Supabase** (Postgres + Auth + RLS) ·
deployable on **Vercel** (free tier).

---

## 1. Create a free Supabase project

1. Go to [supabase.com](https://supabase.com) → sign in with GitHub → **New
   project**. The free tier needs no credit card.
2. Give it a name, set a database password (save it somewhere — you won't need
   it for this app, but Supabase wants one), pick a region near you, create.
3. Wait ~2 minutes for it to provision.

## 2. Create the table + security rules

1. In your project: **SQL Editor** → **New query**.
2. Open [`supabase-setup.sql`](supabase-setup.sql), copy the whole thing in, and
   click **Run**. This creates the `equipment` table and its Row Level Security
   policies.

## 3. Turn off email confirmation (so sign-up is instant)

1. **Authentication** → **Sign In / Providers** (or **Providers → Email**).
2. Turn **off** "Confirm email" and save. (This is only fine because it's a
   throwaway sandbox — a real app keeps it on.)

## 4. Grab your two keys

1. **Project Settings** → **API**.
2. Copy the **Project URL** and the **anon / public** key.
3. In this folder:
   ```bash
   cp .env.local.example .env.local
   ```
   Then paste your two values into `.env.local`.

   > The anon key is *meant* to be public — RLS is what protects your data, not
   > key secrecy. Never use the `service_role` key in this app.

## 5. Install and run

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. You'll be sent to `/login` — sign up with any
email + password, then add some equipment and watch the DUE/OK badges.

---

## Deploying to Vercel (optional — do this yourself when ready)

> Not done automatically. These are the steps for when you want to try it.

1. Push this folder to a GitHub repo.
2. At [vercel.com](https://vercel.com) → **Add New… → Project** → import that
   repo. Vercel auto-detects Next.js; no build config needed.
3. Before deploying, add the **same two env vars** from your `.env.local`
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel
   project's **Environment Variables**.
4. Deploy. You'll get a live URL on the free tier.
5. Back in Supabase → **Authentication → URL Configuration**, add your Vercel
   URL to the **Site URL** / **Redirect URLs** so auth works in production.

### Want to try Cloudflare Pages instead?

Same code, but Cloudflare runs Next.js through an adapter
(`@cloudflare/next-on-pages`) rather than natively — a good way to *feel*
firsthand the extra friction discussed for the real project. Vercel first is
the gentler path.

---

## Project layout

```
supabase-setup.sql          SQL to paste into Supabase (table + RLS)
.env.local.example          template for your two keys
src/
  middleware.ts             refreshes the auth session on every request
  lib/supabase/
    client.ts               browser Supabase client (Client Components)
    server.ts               server Supabase client (Server Components/Actions)
  app/
    actions.ts              ALL mutations (auth + equipment CRUD) — server-side
    page.tsx                the tracker (auth-gated); computes DUE/OK from data
    login/page.tsx          email + password form
    layout.tsx, globals.css shell + minimal styling
```
