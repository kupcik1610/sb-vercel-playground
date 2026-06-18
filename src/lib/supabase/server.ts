// Server-side Supabase client.
// Used inside Server Components, Route Handlers, and Server Actions. It reads
// and writes the auth session through Next.js cookies, which is what keeps the
// user logged in across requests. This is where MESync's "business logic is
// server-side" principle lives: real mutations happen here, not in the browser.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Called from a Server Component? Setting cookies there throws — and
          // that's fine, the middleware refreshes the session instead.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // no-op: handled by middleware
          }
        },
      },
    },
  );
}
