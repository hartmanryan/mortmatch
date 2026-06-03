import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl === 'undefined' || !supabaseUrl.startsWith('http')) {
    supabaseUrl = 'https://kcjyxspkbqhpdmwdtcej.supabase.co';
  }

  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseAnonKey || supabaseAnonKey === 'undefined' || supabaseAnonKey.length < 10) {
    supabaseAnonKey = 'sb_publishable_y9nqMGhO7wdoKzySFos7PQ_ZQHICEfr';
  }

  return createBrowserClient(supabaseUrl as string, supabaseAnonKey as string);
}
