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

// Baby step: judge and return the verdict only. No submissions history yet.
export async function POST(request: Request) {
  const user = await getUserFromRequest(request);

  if (!user) throw new StatusError(401, 'Unauthorized');

  const { problemId, language, sourceCode } = await request.json();

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

  return Response.json({
    status: outcomeStatusLabel(status),
    solved: status === 'accepted',
    passed: results.filter((r) => r.outcome === 'accepted').length,
    total: results.length,
    results,
  });
}
