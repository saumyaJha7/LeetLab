-- Note 1 hardening: hide hidden test cases from client roles.
-- The submit API reads test_cases with the service_role key (bypasses RLS);
-- apps using the publishable key can no longer select this column.
-- code_snippets stays readable: the editor needs starter code.

revoke select (test_cases) on public.problems from anon, authenticated;
