// ─── src/config/env.ts ───────────────────────────────────────────────────────
// Single source of truth for all environment variables.
// Validates at startup so the app fails fast if required vars are missing.
// ─────────────────────────────────────────────────────────────────────────────

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

function optional(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

export const env = {
  // Server
  PORT:          parseInt(optional("PORT", "3001"), 10),
  CORS_ORIGINS:  optional("CORS_ORIGINS", "http://localhost:8080,http://localhost:5173"),

  // Supabase
  SUPABASE_URL:              required("SUPABASE_URL"),
  SUPABASE_ANON_KEY:         required("SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_ROLE_KEY: optional("SUPABASE_SERVICE_ROLE_KEY"),

  // Feature secrets
  STAFF_SECRET:  optional("STAFF_SECRET"),
  MAPBOX_TOKEN:  optional("MAPBOX_TOKEN"),
} as const;

// Warn (don't throw) about optional but important vars
if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "⚠️  SUPABASE_SERVICE_ROLE_KEY is not set.\n" +
    "   Endpoints requiring admin access (verify-qr, reserve) will fail.\n"
  );
}
