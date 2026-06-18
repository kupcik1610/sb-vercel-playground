// Browser-side Supabase client.
// Used inside Client Components ("use client"). Reads the public env vars that
// Next.js inlines into the browser bundle. This client carries the logged-in
// user's session via cookies, so RLS policies see `auth.uid()` correctly.
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
