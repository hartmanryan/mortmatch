import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const formData = await request.formData();
  const lenderId = formData.get('lenderId') as string;

  if (!lenderId) {
    return NextResponse.redirect(new URL('/admin?error=MissingLenderId', request.url), 303);
  }

  // 1. Verify the current user is an admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url), 303);
  } else {
    // Ensure they are actually an admin in the database
    const currentLender = await prisma.lender.findUnique({
      where: { email: user.email! }
    });

    if (!currentLender?.isAdmin) {
      return NextResponse.redirect(new URL('/dashboard?error=Unauthorized', request.url), 303);
    }
  }

  // 2. Set the impersonation cookie
  const cookieStore = await cookies();
  cookieStore.set('impersonate_lender_id', lenderId, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 2 // 2 hours
  });

  // 3. Redirect to the dashboard which will now read the cookie
  return NextResponse.redirect(new URL('/dashboard', request.url), 303);
}
