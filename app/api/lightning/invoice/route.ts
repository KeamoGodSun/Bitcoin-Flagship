import { NextRequest, NextResponse } from 'next/server';
import { createInvoice, providerName } from '@/lib/lightning/provider';
import { siteConfig } from '@/lib/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_SATS = 21_000_000 * 100_000_000;

export async function POST(request: NextRequest) {
  let body: { amountSats?: number; memo?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const amountSats = Math.floor(Number(body.amountSats));
  if (!Number.isFinite(amountSats) || amountSats < 1 || amountSats > MAX_SATS) {
    return NextResponse.json(
      { error: 'Amount must be between 1 and 21,000,000,000,000 sats' },
      { status: 400 }
    );
  }

  const memo = (body.memo || 'Bitcoin Flagship tip').slice(0, 160);

  try {
    const invoice = await createInvoice({ amountSats, memo });
    return NextResponse.json({ invoice, provider: providerName() });
  } catch (err) {
    console.error('[invoice] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    provider: providerName(),
    lightningAddress: siteConfig.lightningAddress,
    supported: ['mock', 'lnd', 'btcpayserver'],
  });
}