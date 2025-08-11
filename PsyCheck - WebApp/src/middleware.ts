import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { getSupabaseEnv } from './lib/supabase/env';

/**
 * Refreshes the Supabase session on every request.
 *
 * – Reads auth cookies from the incoming request.  
 * – Writes any refreshed cookies back to the response so the browser stays in sync.  
 * – Keeps server components / route handlers authenticated via `supabase.auth.getSession()`.
 */
export async function middleware(request: NextRequest) {
  // Create a single mutable response (you can still call .cookies.set / .delete on it later)
  const response = NextResponse.next();

  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        /** Read a cookie from the incoming request */
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        /** Write / update a cookie on *both* the request (for downstream Edge) and the response (for the browser) */
        set(name: string, value: string, options?: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        /** Remove a cookie cleanly */
        remove(name: string, options?: CookieOptions) {
          request.cookies.delete(name);
          response.cookies.delete(name, options);
        },
      },
    }
  );

  // Ensure we have a fresh session before rendering any server components
  await supabase.auth.getSession();

  return response;
}

/**
 * Run on every path except Next.js internals and the favicon.
 * Adjust the matcher as needed for your app.
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

