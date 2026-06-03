import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let clerkId = searchParams.get('clerkId');

  if (!clerkId) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    clerkId = user?.id || null;
  }

  if (!clerkId) {
    return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
  }

  try {
    const lender = await prisma.lender.findUnique({
      where: { authUserId: clerkId }
    });
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
    email = user.email!;

    // Check if lender exists by email first (in case it was manually created before login)
    let lender = await prisma.lender.findUnique({ where: { email } });

    if (lender) {
      // Update existing record
      lender = await prisma.lender.update({
        where: { email },
        data: {
          authUserId: clerkId, // Update authUserId in case it was null
          firstName,
          lastName,
          companyName,
          nmls,
          phone,
        }
      });
    } else {
      // Create new record
      lender = await prisma.lender.create({
        data: {
          authUserId: clerkId,
          email,
          firstName,
          lastName,
          companyName,
          nmls,
          phone,
        }
      });
    }

    return NextResponse.json({ success: true, lender });
  } catch (error) {
    console.error("Profile saving error:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
