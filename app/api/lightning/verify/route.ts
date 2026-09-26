import { NextRequest, NextResponse } from 'next/server';
import { lookupInvoice } from '@/lib/lightning/provider';
import { markTipPaid } from '@/lib/supabase-admin';

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
  if (status?.paid) {
    markTipPaid(paymentHash).catch((err) => console.error('[verify] tip update failed:', err));
  }
  return NextResponse.json({ payment: status });
}