import {
  isJudgeLanguage,
  outcomeStatusLabel,
  overallStatus,
  parseTestCases,
  runAllTestCases,
} from '../../lib/judge';
import { runTaskAsync } from '../../lib/run-task';
import { getSupabaseAdmin, getUserFromRequest } from '../../lib/supabase-admin';
import { StatusError } from 'expo-server';

// Judge, persist one submissions row per executed test case (best-effort),
// then return the verdict.
export async function POST(request: Request) {
  const user = await getUserFromRequest(request);

  if (!user) throw new StatusError(401, 'Unauthorized');

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    throw new StatusError(400, 'Could not read request body.');
  }
  let body: unknown;
  try {
    body = raw ? (JSON.parse(raw) as unknown) : null;
  } catch {
    throw new StatusError(400, 'Request body must be valid JSON.');
  }
  if (typeof body !== 'object' || body === null) {
    throw new StatusError(400, 'Request body must be a JSON object.');
  }

  const { problemId, language, sourceCode } = body as {
    problemId?: unknown;
    language?: unknown;
    sourceCode?: unknown;
  };

  const id = Number(problemId);
  if (!Number.isInteger(id)) {
    throw new StatusError(400, '`problemId` must be an integer.');
  }
  if (!sourceCode || typeof sourceCode !== 'string') {
    throw new StatusError(400, '`sourceCode` is required.');
  }
  if (!isJudgeLanguage(language)) {
    throw new StatusError(400, '`language` must be one of: javascript, python, java.');
  }

  const admin = getSupabaseAdmin();
  const { data: problem } = await admin
    .from('problems')
    .select('problem_id, test_cases')
    .eq('problem_id', id)
    .maybeSingle();

  if (!problem) throw new StatusError(404, 'Problem not found');

  const testCases = parseTestCases(problem.test_cases);
  if (!testCases.length) throw new StatusError(400, 'No test cases configured.');

  const results = await runTaskAsync(() =>
    runAllTestCases({ language, sourceCode, testCases }),
  );

  const status = overallStatus(results);

  // Persist one history row per submit. Best-effort: a DB failure must
  // not fail the verdict.
  const passedCount = results.filter((r) => r.outcome === 'accepted').length;
  const aggregateStatus =
    passedCount === results.length
      ? 'accepted'
      : passedCount === 0
        ? 'failed'
        : 'partial';
  const maxTime = results.reduce<number | null>(
    (max, r) => (r.timeSec != null ? Math.max(max ?? r.timeSec, r.timeSec) : max),
    null,
  );
  const maxMemory = results.reduce<number | null>(
    (max, r) =>
      r.memoryKb != null ? Math.max(max ?? r.memoryKb, r.memoryKb) : max,
    null,
  );

  try {
    const { error: insertError } = await admin.from('submissions').insert({
      user_id: user.id,
      problem_id: id,
      source_code: sourceCode,
      language,
      status: aggregateStatus,
      passed: passedCount,
      total: results.length,
      runtime: maxTime != null ? String(maxTime) : null,
      memory: maxMemory != null ? String(maxMemory) : null,
      results,
      finished_at: new Date().toISOString(),
    });
    if (insertError) {
      console.error('[submit] submissions insert failed:', insertError.message);
    }
  } catch (err) {
    console.error(
      '[submit] submissions insert failed:',
      err instanceof Error ? err.message : String(err),
    );
  }

  return Response.json({
    status: outcomeStatusLabel(status),
    solved: status === 'accepted',
    passed: results.filter((r) => r.outcome === 'accepted').length,
    total: results.length,
    results,
  });
}
