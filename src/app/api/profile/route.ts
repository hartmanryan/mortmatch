import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let clerkId = searchParams.get('clerkId');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!clerkId) {
    clerkId = user?.id || null;
  }

  if (!clerkId) {
    return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
  }

  try {
    let lender = await prisma.lender.findUnique({
      where: { authUserId: clerkId }
    });

    // Fallback: search by email from active session and sync authUserId
    if (!lender && user?.email) {
      const normalizedEmail = user.email.toLowerCase();
      lender = await prisma.lender.findUnique({
        where: { email: normalizedEmail }
      });

      if (lender) {
        lender = await prisma.lender.update({
          where: { email: normalizedEmail },
          data: { 
            authUserId: clerkId,
            ...(normalizedEmail === 'propknocks@gmail.com' ? { isAdmin: true } : {})
          }
        });
      }
    }

    return NextResponse.json({ lender });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { clerkId, email, firstName, lastName, companyName, nmls, phone } = body;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Enforce auth values from server session
    clerkId = user.id;
    email = user.email!.toLowerCase();

    // Check if lender exists by email first (in case it was manually created before login)
    let lender = await prisma.lender.findUnique({ where: { email } });

    if (lender) {
      // Update existing record
      const isSuperAdminEmail = email.toLowerCase() === 'propknocks@gmail.com';
      lender = await prisma.lender.update({
        where: { email },
        data: {
          authUserId: clerkId, // Update authUserId in case it was null
          firstName,
          lastName,
          companyName,
          nmls,
          phone,
          ...(isSuperAdminEmail ? { isAdmin: true } : {})
        }
      });
    } else {
      // Create new record
      const isSuperAdminEmail = email.toLowerCase() === 'propknocks@gmail.com';
      lender = await prisma.lender.create({
        data: {
          authUserId: clerkId,
          email,
          firstName,
          lastName,
          companyName,
          nmls,
          phone,
          isAdmin: isSuperAdminEmail
        }
      });
    }

    return NextResponse.json({ success: true, lender });
  } catch (error) {
    console.error("Profile saving error:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
