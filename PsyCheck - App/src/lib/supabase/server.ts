import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function getServerSupabase() {
  const store = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => store.get(name)?.value,
        set: (name, value, options) => store.set({ name, value, ...options }),
        remove: (name, options) => store.set({ name, value: '', ...options }),
      },
    }
  )
}
