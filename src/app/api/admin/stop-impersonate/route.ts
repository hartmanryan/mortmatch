import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete('impersonate_lender_id');
  
  return NextResponse.redirect(new URL('/admin', request.url), 303);
}
