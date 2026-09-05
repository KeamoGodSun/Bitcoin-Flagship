import { NextRequest, NextResponse } from 'next/server';
import { lookupInvoice } from '@/lib/lightning/provider';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: { paymentHash?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const paymentHash = String(body.paymentHash || '').trim();
  if (!paymentHash) {
    return NextResponse.json({ error: 'paymentHash is required' }, { status: 400 });
  }

  const status = await lookupInvoice(paymentHash);
  return NextResponse.json({ payment: status });
}