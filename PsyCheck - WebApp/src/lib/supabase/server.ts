import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseEnv } from './env';

/**
 * Server-side Supabase client bound to Next.js App Router cookies.
 *
 * – Keeps auth state in sync by reading/writing the response cookie jar.  
 * – Safe to call inside any server action, loader, or route handler.
 */
export function getServerSupabase() {
  // `cookies()` is synchronous in the App Router
  const cookieStore = cookies();

  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        /** Read a cookie value (undefined if absent) */
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        /** Write/update a cookie */
        set(name: string, value: string, options?: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        /** Remove a cookie */
        remove(name: string, options?: CookieOptions) {
          cookieStore.delete(name, options);
        },
      },
    }
  );
}
