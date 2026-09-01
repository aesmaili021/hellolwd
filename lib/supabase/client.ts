import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function env(name: string, fallback?: string) {
  return process.env[name] || fallback || "";
}

export function getSupabase(): SupabaseClient | null {
  const url = env("NEXT_PUBLIC_SUPABASE_URL", process.env.SUPABASE_URL);
  const key = env(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.SUPABASE_ANON_KEY,
  );

  if (!url || !key || url.includes("your-project") || key.includes("your-anon")) {
    return null;
  }

  return createClient(url, key);
}
