export type JudgeLanguage = 'javascript' | 'python' | 'java';

export const LANGUAGE_ID_MAP: Record<JudgeLanguage, number> = {
  javascript: 63,
  python: 71,
  java: 62,
};

export function isJudgeLanguage(value: unknown): value is JudgeLanguage {
  return (
    typeof value === 'string' && value in LANGUAGE_ID_MAP
  );
}

export type RunOutcome = 'accepted' | 'wrong-answer' | 'error';

export function normalise(value: string | null | undefined) {
  return (value ?? '').replace(/\r\n/g, '\n').trim();
}

export type CaseResult = {
  index: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  stderr: string;
  status: { id: number; description: string };
  outcome: RunOutcome;
  timeSec: number | null;
  memoryKb: number | null;
  token: string | null;
  createdAt: string | null;
  finishedAt: string | null;
};

export type ProblemTestCase = { input: string; output: string };

type CodeBoxResponse = {
  token: string | null;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: { id: number; description: string };
  time: string | null;
  memory: number | null;
  created_at: string | null;
  finished_at: string | null;
};

export function parseTestCases(raw: unknown): ProblemTestCase[] {
  return Array.isArray(raw) ? (raw as ProblemTestCase[]) : [];
}

export function getCodeBoxBaseUrl() {
  const configured = process.env.CODEBOX_URL?.replace(/\/+$/, '');
  if (configured) return configured;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('CODEBOX_URL is not configured on the server.');
  }
  return 'http://localhost:3000';
}

export async function executeOnCodeBox(params: {
  languageId: number;
  sourceCode: string;
  stdin: string;
  expectedOutput: string;
}) {
  const token = process.env.CODEBOX_API_TOKEN;

  if (!token) throw new Error('CODEBOX_API_TOKEN is not configured on the server.');

  const baseUrl = getCodeBoxBaseUrl();

  let upstream: Response;
  try {
    upstream = await fetch(`${baseUrl}/submissions?wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token,
      },
      body: JSON.stringify({
        language_id: params.languageId,
        source_code: params.sourceCode,
        stdin: params.stdin,
        expected_output: params.expectedOutput,
        cpu_time_limit: 5,
        memory_limit: 256000,
      }),
    });
  } catch (err) {
    console.error('[judge] CodeBox unreachable:', err);
    throw new Error('Could not reach the execution service.');
  }

  const text = await upstream.text();
  if (!upstream.ok) {
    // Raw body stays server-side; clients get a stable, non-leaking message.
    console.error(`[judge] CodeBox ${upstream.status}: ${text.slice(0, 500)}`);
    throw new Error(stableUpstreamMessage(upstream.status));
  }

  return JSON.parse(text) as CodeBoxResponse;
}

function stableUpstreamMessage(status: number) {
  if (status === 401 || status === 403) return 'Execution service authentication failed.';
  if (status === 422) return 'Execution service rejected the submission.';
  if (status === 429) return 'Execution service is busy, try again.';
  if (status >= 500) return 'Execution service is unavailable.';
  return 'Execution service request failed.';
}

export function toCaseResult(
  index: number,
  testCase: ProblemTestCase,
  data: CodeBoxResponse,
): CaseResult {
  const actualOutput = normalise(data.stdout);
  const expectedOutput = normalise(testCase.output);
  const passed = actualOutput === expectedOutput;
  const outcome: RunOutcome =
    data.status.id === 3 || data.status.id === 4
      ? passed
        ? 'accepted'
        : 'wrong-answer'
      : 'error';

  // Judge0-compatible servers report compile errors in `compile_output`
  // (not `stderr`). Without merging, syntax errors surface as empty output
  // ("got ∅") with no clue. Merge all diagnostic streams so the client
  // always has something to show on `error`.
  const diagnostics = [data.stderr, data.compile_output, data.message]
    .map((part) => normalise(part))
    .filter(Boolean)
    .join('\n');

  return {
    index,
    input: testCase.input,
    expectedOutput,
    actualOutput,
    stderr: diagnostics,
    status: data.status,
    outcome,
    timeSec: data.time ? Number(data.time) : null,
    memoryKb: data.memory ?? null,
    token: data.token ?? null,
    createdAt: data.created_at ?? null,
    finishedAt: data.finished_at ?? null,
  };
}

export async function runAllTestCases(params: {
  language: JudgeLanguage;
  sourceCode: string;
  testCases: ProblemTestCase[];
}) {
  const languageId = LANGUAGE_ID_MAP[params.language];

  return Promise.all(
    params.testCases.map(async (testCase, index) => {
      try {
        const data = await executeOnCodeBox({
          languageId,
          sourceCode: params.sourceCode,
          stdin: testCase.input,
          expectedOutput: testCase.output,
        });

        return toCaseResult(index, testCase, data);
      } catch (err) {
        return {
          index,
          input: testCase.input,
          expectedOutput: normalise(testCase.output),
          actualOutput: '',
          stderr: err instanceof Error ? err.message : String(err),
          status: { id: -1, description: 'Error' },
          outcome: 'error' as const,
          timeSec: null,
          memoryKb: null,
          token: null,
          createdAt: null,
          finishedAt: null,
        };
      }
    }),
  );
}

export function overallStatus(results: CaseResult[]) {
  if (results.every((r) => r.outcome === 'accepted')) return 'accepted' as const;
  if (results.some((r) => r.outcome === 'error')) return 'error' as const;
  return 'wrong-answer' as const;
}

export function outcomeStatusLabel(outcome: RunOutcome | 'accepted' | 'wrong-answer' | 'error') {
  if (outcome === 'accepted') return 'Accepted';
  if (outcome === 'wrong-answer') return 'Wrong Answer';
  return 'Error';
}
