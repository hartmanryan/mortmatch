import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kcjyxspkbqhpdmwdtcej.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_y9nqMGhO7wdoKzySFos7PQ_ZQHICEfr';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
