import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clerkId = searchParams.get('clerkId');

  if (!clerkId) {
    return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
  }

  try {
    const lender = await prisma.lender.findUnique({
      where: { clerkId }
    });
    return NextResponse.json({ lender });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clerkId, email, firstName, lastName, companyName, nmls, phone } = body;

    if (!clerkId || !email) {
      return NextResponse.json({ error: "Missing clerkId or email" }, { status: 400 });
    }

    // Check if lender exists by email first (in case it was manually created before Clerk login)
    let lender = await prisma.lender.findUnique({ where: { email } });

    if (lender) {
      // Update existing record
      lender = await prisma.lender.update({
        where: { email },
        data: {
          clerkId, // Update clerkId in case it was null
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
          clerkId,
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
