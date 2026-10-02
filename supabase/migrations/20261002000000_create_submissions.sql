-- Submissions history: one row per submit attempt.
--
-- status is the aggregate verdict:
--   'accepted' — every test case passed,
--   'partial'  — some test cases passed,
--   'failed'   — none passed (wrong answer or execution error).
--
-- Per-case details (including each CodeBox token, so any single execution
-- can be re-fetched via GET /submissions/:token) live in `results` jsonb.
-- Inserts are done server-side with service_role (bypasses RLS);
-- clients can only read their own rows.
--
-- NOTE: a `submissions` table was previously created via Studio with a
-- per-test-case shape (submission_token PK, no passed/total/results).
-- It holds no rows, so it is replaced here with the one-row-per-submit
-- shape. The `language` enum (public.language_type) is reused as-is.

drop table if exists public.submissions;

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  problem_id bigint not null references public.problems (problem_id) on delete cascade,
  source_code text not null,
  language public.language_type not null,
  status text not null check (status in ('accepted', 'partial', 'failed')),
  passed integer not null default 0,
  total integer not null default 0,
  runtime text null,
  memory text null,
  results jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  finished_at timestamptz null
);

alter table public.submissions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'submissions'
      and policyname = 'Users can read own submissions'
  ) then
    create policy "Users can read own submissions"
      on public.submissions
      for select
      to authenticated
      using ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'submissions'
      and policyname = 'Users can insert own submissions'
  ) then
    create policy "Users can insert own submissions"
      on public.submissions
      for insert
      to authenticated
      with check ((select auth.uid()) = user_id);
  end if;
end;
$$;

create index if not exists submissions_user_id_idx
  on public.submissions (user_id);
create index if not exists submissions_problem_id_idx
  on public.submissions (problem_id);
create index if not exists submissions_user_problem_idx
  on public.submissions (user_id, problem_id);
