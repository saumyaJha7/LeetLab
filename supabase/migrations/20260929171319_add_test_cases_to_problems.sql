-- Baby step 1: judge support on the existing problems table.
-- Adds a hidden-from-client-later `test_cases` jsonb column ([{input, output}])
-- and backfills it for the two seeded problems.
--
-- stdin/stdout contract (must match future code_snippets):
--   Two Sum (problem_id=1): stdin = "<space-separated nums>\n<target>", stdout = "[i,j]"
--   Valid Parentheses (problem_id=2): stdin = raw string s, stdout = "true" | "false"

alter table public.problems
  add column if not exists test_cases jsonb not null default '[]'::jsonb;

-- Two Sum
update public.problems
set test_cases = $json$[
  {"input": "2 7 11 15\n9", "output": "[0,1]"},
  {"input": "3 2 4\n6", "output": "[1,2]"},
  {"input": "3 3\n6", "output": "[0,1]"},
  {"input": "-1 -2 -3 -4 -5\n-8", "output": "[2,4]"},
  {"input": "0 4 3 0\n0", "output": "[0,3]"}
]$json$::jsonb
where problem_id = 1;

-- Valid Parentheses
update public.problems
set test_cases = $json$[
  {"input": "()", "output": "true"},
  {"input": "()[]{}", "output": "true"},
  {"input": "(]", "output": "false"},
  {"input": "([)]", "output": "false"},
  {"input": "{[]}", "output": "true"},
  {"input": "((", "output": "false"}
]$json$::jsonb
where problem_id = 2;
