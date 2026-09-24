'use client';

import { Zap } from 'lucide-react';
import { useWallet } from '@/components/wallet-provider';

export function WalletFab() {
  const { openWallet } = useWallet();

  return (
    <button
      onClick={() => openWallet()}
      aria-label="Open Bitcoin wallet"
      title="Bitcoin wallet"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bitcoin text-background shadow-lg shadow-bitcoin/40 ring-1 ring-bitcoin/30 transition-transform hover:scale-105 hover:bg-bitcoin-light focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Zap className="h-6 w-6" strokeWidth={2.5} />
    </button>
  );
}