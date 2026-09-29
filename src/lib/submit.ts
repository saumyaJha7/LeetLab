import Constants from 'expo-constants';
import { supabase } from './supabase';

export type SubmitCaseResult = {
  index: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  stderr: string;
  status: { id: number; description: string };
  outcome: 'accepted' | 'wrong-answer' | 'error';
  timeSec: number | null;
  memoryKb: number | null;
};

export type SubmitVerdict = {
  status: string;
  solved: boolean;
  passed: number;
  total: number;
  results: SubmitCaseResult[];
};

/**
 * Where the Expo API routes live. In dev the app runs on a device while
 * `/api/*` is served by the Expo dev server, so a relative path won't do:
 * use an explicit override when set, else derive the dev server host.
 */
export function getApiBaseUrl() {
  const override = process.env.EXPO_PUBLIC_API_URL;
  if (override) return override.replace(/\/+$/, '');

  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) {
    throw new Error(
      'API URL unavailable. Set EXPO_PUBLIC_API_URL or run via the Expo dev server.',
    );
  }
  return `http://${hostUri}`;
}

export async function submitSolution(params: {
  problemId: string | number;
  language: string;
  sourceCode: string;
}): Promise<SubmitVerdict> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error('You need to sign in before submitting.');

  const res = await fetch(`${getApiBaseUrl()}/api/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(params),
  });

  const text = await res.text();
  let payload: SubmitVerdict & { message?: string };
  try {
    payload = JSON.parse(text) as SubmitVerdict;
  } catch {
    // expo-server error responses are plain text ("Unauthorized", …).
    // Surface short ones directly instead of a generic status message.
    const trimmed = text.trim();
    throw new Error(
      trimmed && trimmed.length < 200
        ? trimmed
        : `Submit failed (${res.status}).`,
    );
  }

  if (!res.ok) {
    throw new Error(payload.message ?? `Submit failed (${res.status}).`);
  }

  return payload;
}
