import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl === 'undefined' || !supabaseUrl.startsWith('http')) {
    supabaseUrl = 'https://kcjyxspkbqhpdmwdtcej.supabase.co';
  }

  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseAnonKey || supabaseAnonKey === 'undefined' || supabaseAnonKey.length < 10) {
    supabaseAnonKey = 'sb_publishable_y9nqMGhO7wdoKzySFos7PQ_ZQHICEfr';
  }

  const supabase = createServerClient(
    supabaseUrl as string,
    supabaseAnonKey as string,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect /dashboard and /admin routes
  const isDashboardRoute = url.pathname.startsWith('/dashboard');
  const isAdminRoute = url.pathname.startsWith('/admin');

  if ((isDashboardRoute || isAdminRoute) && !user) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Protect dashboard, admin, and api routes that need protection
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};
