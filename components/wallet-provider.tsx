'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { WalletDialog } from '@/components/wallet-dialog';
import { WalletFab } from '@/components/wallet-fab';
import type { WalletGroupId } from '@/lib/wallets';

interface WalletContextValue {
  openWallet: (walletId?: WalletGroupId, programId?: string) => void;
  closeWallet: () => void;
}

const WalletContext = createContext<WalletContextValue>({
  openWallet: () => {},
  closeWallet: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [walletId, setWalletId] = useState<WalletGroupId>('flagship');
  const [programId, setProgramId] = useState<string | undefined>(undefined);

  const openWallet = useCallback((wallet?: WalletGroupId, program?: string) => {
    setWalletId(wallet ?? 'flagship');
    setProgramId(program);
    setOpen(true);
  }, []);

  const closeWallet = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ openWallet, closeWallet }), [openWallet, closeWallet]);

  return (
    <WalletContext.Provider value={value}>
      {children}
      <WalletFab />
      <WalletDialog
        open={open}
        onOpenChange={setOpen}
        initialWalletId={walletId}
        initialProgramId={programId}
      />
    </WalletContext.Provider>
  );
}