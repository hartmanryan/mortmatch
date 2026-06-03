import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  // Extract public origin dynamically from headers
  const host = request.headers.get('host') ?? requestUrl.host;
  const protocol = request.headers.get('x-forwarded-proto') ?? (request.url.startsWith('https') ? 'https' : 'http');
  const publicOrigin = `${protocol}://${host}`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${publicOrigin}${next}`);
    } else {
      console.error("Supabase code exchange error:", error);
    }
  }

  // If there is an error or no code, redirect the user to login page with error
  return NextResponse.redirect(`${publicOrigin}/login?error=Invalid+Magic+Link`);
}
