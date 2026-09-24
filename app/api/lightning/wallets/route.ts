import { NextResponse } from 'next/server';
import { providerName, walletSummary } from '@/lib/lightning/provider';
import { walletGroups, walletAddress } from '@/lib/wallets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const wallets = walletGroups.map((group) => ({
    id: group.id,
    name: group.name,
    shortName: group.shortName,
    description: group.description,
    address: walletAddress(group.id),
    memo: group.memo,
    defaultAmount: group.defaultAmount,
    programs: group.programs.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      memo: p.memo,
      defaultAmount: p.defaultAmount ?? group.defaultAmount,
    })),
    summary: walletSummary(group.id),
  }));

  return NextResponse.json({ provider: providerName(), wallets });
}