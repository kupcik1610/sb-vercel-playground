-- ============================================================================
-- Playground schema — paste this whole file into the Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New query -> Run).
--
-- It creates ONE table and locks it down with Row Level Security (RLS) so each
-- user can only see and touch their own rows. RLS is the single most important
-- (and most error-prone) thing to learn here — it's exactly what protects real
-- customer data in MESync.
-- ============================================================================

create table if not exists equipment (
  id              uuid primary key default gen_random_uuid(),

  -- Who owns this row. Defaults to the logged-in user. RLS keys off this.
  owner           uuid not null references auth.users (id) default auth.uid(),

  -- The "what" (mirrors MESync's Asset domain, simplified to one table).
  name            text not null,
  facility_name   text,                      -- where it lives (free text here)

  -- The "recurring due" inputs. NOTE: we store the FACTS (when it was last
  -- serviced + how often it needs servicing). We do NOT store "is it due" —
  -- that is computed from these facts at read time. This is MESync's core
  -- principle: status/documents are OUTPUTS of structured data, never stored
  -- flags that can drift out of sync.
  last_serviced_on date,                      -- null = never serviced yet
  interval_days   integer not null default 365,

  created_at      timestamptz not null default now()
);

-- Turn on RLS. Until policies are added, this DENIES everything by default.
alter table equipment enable row level security;

-- Each policy below restricts a different operation to rows the user owns.
-- `auth.uid()` is the id of the currently logged-in user (from their session).

create policy "select own equipment"
  on equipment for select
  using (auth.uid() = owner);

create policy "insert own equipment"
  on equipment for insert
  with check (auth.uid() = owner);

create policy "update own equipment"
  on equipment for update
  using (auth.uid() = owner)
  with check (auth.uid() = owner);

create policy "delete own equipment"
  on equipment for delete
  using (auth.uid() = owner);

-- ============================================================================
-- Want to try the "logic in the database" approach later? You could replace
-- the JS due-calculation in the app with a generated column or a view, e.g.:
--
--   create view equipment_with_status as
--   select *,
--          (last_serviced_on is null
--             or last_serviced_on + (interval_days || ' days')::interval <= now())
--          as is_due
--   from equipment;
--
-- That's closer to how MESync pushes business logic server-side. Left as an
-- exercise — the app currently computes due-ness in TypeScript so you can see
-- both sides.
-- ============================================================================
