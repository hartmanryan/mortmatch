import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl === 'undefined' || !supabaseUrl.startsWith('http')) {
    supabaseUrl = 'https://kcjyxspkbqhpdmwdtcej.supabase.co';
  }

  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseAnonKey || supabaseAnonKey === 'undefined' || supabaseAnonKey.length < 10) {
    supabaseAnonKey = 'sb_publishable_y9nqMGhO7wdoKzySFos7PQ_ZQHICEfr';
  }

  return createServerClient(
    supabaseUrl as string,
    supabaseAnonKey as string,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
