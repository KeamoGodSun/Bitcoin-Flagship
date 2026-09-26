import { NextRequest, NextResponse } from 'next/server';
import { simulateInvoice, providerName } from '@/lib/lightning/provider';
import { markTipPaid } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (providerName() !== 'mock') {
    return NextResponse.json(
      { error: 'Simulation is only available in mock mode' },
      { status: 403 }
    );
  }

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

  const status = simulateInvoice(paymentHash);
  if (status?.paid) {
    markTipPaid(paymentHash).catch((err) => console.error('[simulate] tip update failed:', err));
  }
  return NextResponse.json({ payment: status });
}