// ─── src/lib/supabase.ts ─────────────────────────────────────────────────────
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

/** Admin client — bypasses RLS. Server-side only, never sent to browser. */
export const adminClient: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

/**
 * Build a per-request Supabase client that forwards the caller's JWT so that
 * Supabase RLS policies apply correctly (auth.uid() === logged-in user).
 */
export function buildUserClient(authHeader: string): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
    auth:   { persistSession: false },
  });
}
