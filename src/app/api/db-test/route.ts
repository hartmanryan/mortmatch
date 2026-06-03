import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const dbUrl = process.env.DATABASE_URL || '';
  const obscuredUrl = dbUrl.replace(/:[^:@/]+@/, ':***@');
  
  const diagnostics: any = {
    envDatabaseUrl: obscuredUrl,
    envDatabaseUrlExists: !!dbUrl,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  try {
    // Attempt a count query on the Lender table
    const lenderCount = await prisma.lender.count();
    diagnostics.status = 'SUCCESS';
    diagnostics.lenderCount = lenderCount;
    diagnostics.message = 'Successfully connected and queried Lender table.';
  } catch (err: any) {
    diagnostics.status = 'FAILED';
    diagnostics.error = err.message || String(err);
    diagnostics.errorName = err.name || 'UnknownError';
    diagnostics.errorCode = err.code || null;
    diagnostics.meta = err.meta || null;
  }

  return NextResponse.json(diagnostics);
}
