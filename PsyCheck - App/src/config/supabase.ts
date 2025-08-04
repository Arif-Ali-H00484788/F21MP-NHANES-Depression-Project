import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from '../lib/supabase/env';

const { url: supabaseUrl, anonKey: supabaseAnonKey } = getSupabaseEnv();

// Singleton client for consistent access
let supabaseInstance: SupabaseClient | null = null;

const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

export const supabase = getSupabaseClient();
