import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let admin: SupabaseClient | null = null;
let auth: SupabaseClient | null = null;

const clientOpts = {
  auth: { autoRefreshToken: false, persistSession: false },
};

function getAuthClient() {
  if (auth === null) {
    auth = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL!,
      process.env.EXPO_PUBLIC_SUPABASE_KEY!,
      clientOpts,
    );
  }

  return auth;
}

export function getSupabaseAdmin() {
  if (admin === null) {
    admin = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      clientOpts,
    );
  }

  return admin;
}

export async function getUserFromRequest(request: Request) {
  // Scheme match is case-insensitive per RFC 7235; trim guards "Bearer  <token>".
  const token = request.headers
    .get('Authorization')
    ?.replace(/^Bearer\s+/i, '')
    .trim();

  if (!token) return null;

  const { data } = await getAuthClient().auth.getUser(token);

  return data.user ?? null;
}
