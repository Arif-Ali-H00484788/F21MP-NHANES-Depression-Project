
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

let supabase: SupabaseClient;

// Check if we are in a browser environment to avoid multiple instances
if (typeof window === 'undefined') {
  // Server-side
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Client-side, reuse existing instance if available
  // @ts-ignore
  if (!window.supabase) {
    // @ts-ignore
    window.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  // @ts-ignore
  supabase = window.supabase;
}


export { supabase };
