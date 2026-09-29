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
};

export type ProblemTestCase = { input: string; output: string };

type CodeBoxResponse = {
  stdout: string | null;
  stderr: string | null;
  status: { id: number; description: string };
  time: string | null;
  memory: number | null;
};

export function parseTestCases(raw: unknown): ProblemTestCase[] {
  return Array.isArray(raw) ? (raw as ProblemTestCase[]) : [];
}

export async function executeOnCodeBox(params: {
  languageId: number;
  sourceCode: string;
  stdin: string;
  expectedOutput: string;
}) {
  const token = process.env.CODEBOX_API_TOKEN;
  const baseUrl = (process.env.CODEBOX_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

  if (!token) throw new Error('CODEBOX_API_TOKEN is not configured on the server.');

  const upstream = await fetch(`${baseUrl}/submissions?wait=true`, {
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

  const text = await upstream.text();
  if (!upstream.ok) throw new Error(`CodeBox ${upstream.status}: ${text}`);

  return JSON.parse(text) as CodeBoxResponse;
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

  return {
    index,
    input: testCase.input,
    expectedOutput,
    actualOutput,
    stderr: normalise(data.stderr),
    status: data.status,
    outcome,
    timeSec: data.time ? Number(data.time) : null,
    memoryKb: data.memory ?? null,
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
