# Context for Claude — read this first

This file exists so a fresh Claude instance opened in this folder can pick up
where a previous conversation left off. It's a learning sandbox, not real work.

## Who you're working with

Patrik is **newer to production-level coding** and is using this throwaway
project to get hands-on with **Supabase** and **Vercel** — the two platforms a
separate real project ("MESync") runs on. He is *not* an expert in this stack
yet, so:

- **Explain the "why," not just the "how."** Teach as you go.
- **Default to the simplest option.** He explicitly wants to optimize for
  learnability/simplicity over cleverness, cost, or performance.
- Keep things **barebones**. Don't add frameworks, abstractions, or tooling
  unless he asks or it clearly teaches something.

## Hard rules for this folder

- **Do NOT deploy anything anywhere** (no Vercel, no GitHub push, no hosted
  Supabase actions) unless Patrik explicitly asks in this session.
- **Stay inside this folder.** Don't touch anything outside
  `~/sb-vercel-playground`. In particular there is a separate `~/mesync-app`
  repo that must not be modified from here.
- No real secrets in committed files. `.env.local` is git-ignored; only
  `.env.local.example` (placeholders) is tracked.

## What this project is

A **barebones equipment service tracker**: log in → add equipment with a
service interval → the app shows each item as **DUE** or **OK**. It's a tiny,
deliberate miniature of MESync, chosen so four core patterns transfer:

| The toy teaches | = MESync's real concept | Where |
|---|---|---|
| Supabase **Auth** (sign up/in/out, cookie sessions) | office vs. technician access | `src/app/actions.ts`, `src/middleware.ts` |
| **Row Level Security** (each user sees only their rows) | protecting customer data — the hard part | `supabase-setup.sql` |
| **Status computed from data, not stored** (DUE/OK from dates) | "documents are outputs of structured data" | `dueInfo()` in `src/app/page.tsx` |
| **Server-side logic** (all writes in Server Actions) | "client collects input, server owns the rules" | `src/app/actions.ts` |

The single `equipment` table stands in for MESync's real hierarchy of
`accounts → facilities → service_contexts → equipment`. One table is the
barebones part; the patterns are real.

Stack: Next.js (App Router) · Supabase (Postgres + Auth + RLS) · meant for
Vercel free tier. See `PROJECT.md` for the full rationale and `README.md` for
run/setup steps.

## Background: why Vercel + Supabase (came up in the original convo)

For a small team / someone learning, this stack was chosen for **lowest
friction**, not lowest cost:
- Most-documented, most-tutorialed stack; AI tools are sharpest on it.
- Batteries-included: Supabase gives DB + Auth + auto-API + file storage + RLS.
- Vercel makes Next.js, so it runs natively with zero adapter friction
  (Cloudflare Pages would be cheaper but adds a Next.js adapter — wrong
  trade-off while learning). Cost difference at this scale is negligible.

## Current state

- Files are scaffolded and committed to a **local** git repo (one commit). Not
  pushed anywhere.
- **Dependencies are NOT installed yet** — `npm install` hasn't been run.
- Not type-checked or run yet; first `npm run dev` is the real smoke test.
  Dependency versions in `package.json` were hand-pinned, so if install
  complains about a version, that's the likely cause — easy fix.
- No Supabase project created yet; no env vars set.

## Likely next steps Patrik may want help with

1. Getting it running: `npm install`, create a free Supabase project, run
   `supabase-setup.sql`, turn off email confirmation, fill `.env.local`,
   `npm run dev`. (Full walkthrough in `README.md`.)
2. Debugging whatever breaks on first run.
3. Learning git on this low-stakes repo (status / commit / undo).
4. Extending it — in rough difficulty order (also in `PROJECT.md`):
   add a `facilities` table + foreign key → add a service-history/audit table →
   move due-logic into a Postgres view → add roles + role-aware RLS → swap
   email/password auth for Google OAuth.

When in doubt, ask Patrik what he wants to learn next rather than building ahead.
