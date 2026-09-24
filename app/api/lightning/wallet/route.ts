import { NextRequest, NextResponse } from 'next/server';
import { providerName, walletLedger, walletSummary } from '@/lib/lightning/provider';
import { getWalletGroup, walletAddress } from '@/lib/wallets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const walletId = request.nextUrl.searchParams.get('walletId') || 'flagship';
  const group = getWalletGroup(walletId);

  return NextResponse.json({
    provider: providerName(),
    wallet: {
      id: group.id,
      name: group.name,
      description: group.description,
      memo: group.memo,
      address: walletAddress(group.id),
    },
    summary: walletSummary(walletId),
    entries: walletLedger(walletId),
  });
}