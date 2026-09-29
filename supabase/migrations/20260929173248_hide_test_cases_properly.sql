-- Fix: the previous column-level REVOKE was a no-op because a table-level
-- SELECT grant implies all columns. Follow the standard pattern instead:
-- revoke everything, then re-grant all privileges minus test_cases.
-- Non-SELECT privileges are re-granted unchanged; only SELECT/INSERT/UPDATE
-- drop the test_cases column. code_snippets stays readable (editor needs it).

revoke all on table public.problems from anon, authenticated;

-- Read: every public column except test_cases.
grant select (
  problem_id,
  title,
  description,
  examples,
  tags,
  hints,
  constraints,
  languages,
  acceptance_rate,
  code_snippets,
  created_at,
  updated_at
) on table public.problems to anon, authenticated;

-- Writes: preserved as before, minus test_cases.
grant insert (
  problem_id,
  title,
  description,
  examples,
  tags,
  hints,
  constraints,
  languages,
  acceptance_rate,
  code_snippets,
  created_at,
  updated_at
) on table public.problems to anon, authenticated;

grant update (
  problem_id,
  title,
  description,
  examples,
  tags,
  hints,
  constraints,
  languages,
  acceptance_rate,
  code_snippets,
  created_at,
  updated_at
) on table public.problems to anon, authenticated;

grant delete, references, trigger, truncate
  on table public.problems to anon, authenticated;
