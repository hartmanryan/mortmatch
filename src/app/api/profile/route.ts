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
            ...(normalizedEmail === 'propknocks@gmail.com' || normalizedEmail === 'gosunline@gmail.com' ? { isAdmin: true } : {})
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
    let { clerkId, email, firstName, lastName, companyName, companyAddress, nmls, phone } = body;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Enforce auth values from server session by default
    clerkId = user.id;
    email = user.email!.toLowerCase();

    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const impersonatedLenderId = cookieStore.get("impersonate_lender_id")?.value;

    let targetEmail = email;
    let targetClerkId = clerkId;

    if (impersonatedLenderId) {
      const currentLender = await prisma.lender.findUnique({ where: { email } });
      if (currentLender?.isAdmin) {
        const impersonatedLender = await prisma.lender.findUnique({ where: { id: impersonatedLenderId } });
        if (impersonatedLender) {
          targetEmail = impersonatedLender.email;
          targetClerkId = impersonatedLender.authUserId || '';
        }
      }
    }

    // Check if lender exists by email first (in case it was manually created before login)
    let lender = await prisma.lender.findUnique({ where: { email: targetEmail } });

    if (lender) {
      // Update existing record
      const isSuperAdminEmail = targetEmail.toLowerCase() === 'propknocks@gmail.com' || targetEmail.toLowerCase() === 'gosunline@gmail.com';
      lender = await prisma.lender.update({
        where: { email: targetEmail },
        data: {
          authUserId: targetClerkId || null, // Update authUserId in case it was null
          firstName,
          lastName,
          companyName,
          companyAddress,
          nmls,
          phone,
          ...(isSuperAdminEmail ? { isAdmin: true } : {})
        }
      });
    } else {
      // Create new record
      const isSuperAdminEmail = targetEmail.toLowerCase() === 'propknocks@gmail.com' || targetEmail.toLowerCase() === 'gosunline@gmail.com';
      lender = await prisma.lender.create({
        data: {
          authUserId: targetClerkId || null,
          email: targetEmail,
          firstName,
          lastName,
          companyName,
          companyAddress,
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
