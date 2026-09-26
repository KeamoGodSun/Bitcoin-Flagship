import { NextRequest, NextResponse } from 'next/server';
import { createInvoice, providerName } from '@/lib/lightning/provider';
import { siteConfig } from '@/lib/config';
import { getWalletGroup, getWalletProgram, buildWalletMemo } from '@/lib/wallets';
import { recordPendingTip } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_SATS = 21_000_000 * 100_000_000;
const MEMO_MAX = 160;

export async function POST(request: NextRequest) {
  let body: { amountSats?: number; walletId?: string; programId?: string; memo?: string; postId?: string };
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

  const walletId = body.walletId || 'flagship';
  const group = getWalletGroup(walletId);
  const program = getWalletProgram(group, body.programId);
  if (!group.programs.length && body.programId) {
    return NextResponse.json({ error: 'Unknown wallet' }, { status: 400 });
  }
  if (body.programId && !program) {
    return NextResponse.json({ error: 'Unknown program for this wallet' }, { status: 400 });
  }

  const customMemo = typeof body.memo === 'string' ? body.memo.trim().slice(0, MEMO_MAX) : '';
  const postId = typeof body.postId === 'string' ? body.postId.trim().slice(0, 64) : '';
  const memo = (customMemo || buildWalletMemo(walletId, program?.id)).slice(0, MEMO_MAX);

  try {
    const invoice = await createInvoice({
      amountSats,
      memo,
      walletId,
      programId: program?.id,
      programName: program?.name,
    });

    if (postId) {
      recordPendingTip({
        paymentHash: invoice.paymentHash,
        invoiceId: invoice.id,
        postId,
        amountSats,
        memo,
      }).catch((err) => console.error('[invoice] tip record failed:', err));
    }

    return NextResponse.json({ invoice, provider: providerName(), walletId, memo });
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