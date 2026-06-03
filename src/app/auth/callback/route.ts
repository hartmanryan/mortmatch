import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

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
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      const user = data.user;
      if (user.email) {
        try {
          const normalizedEmail = user.email.toLowerCase();
          const isSuperAdminEmail = normalizedEmail === 'propknocks@gmail.com';
          const lender = await prisma.lender.findUnique({
            where: { email: normalizedEmail }
          });

          if (lender) {
            await prisma.lender.update({
              where: { email: normalizedEmail },
              data: {
                authUserId: user.id,
                ...(isSuperAdminEmail ? { isAdmin: true } : {})
              }
            });
          } else {
            // Auto-create record if they don't exist
            await prisma.lender.create({
              data: {
                authUserId: user.id,
                email: normalizedEmail,
                firstName: user.email.split('@')[0],
                lastName: 'Lender',
                isAdmin: isSuperAdminEmail,
                isActive: true
              }
            });
          }
        } catch (dbError) {
          console.error("Database sync error during callback:", dbError);
        }
      }

      return NextResponse.redirect(`${publicOrigin}${next}`);
    } else {
      console.error("Supabase code exchange error:", error);
    }
  }

  // If there is an error or no code, redirect the user to login page with error
  return NextResponse.redirect(`${publicOrigin}/login?error=Invalid+Magic+Link`);
}
