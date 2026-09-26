'use client';

import { Zap } from 'lucide-react';
import { useWallet } from '@/components/wallet-provider';
import { Button } from '@/components/ui/button';
import type { WalletGroupId } from '@/lib/wallets';
import { cn } from '@/lib/utils';

interface DonateButtonProps {
  walletId?: WalletGroupId;
  label?: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export function DonateButton({
  walletId = 'flagship',
  label = 'Donate',
  className,
  size = 'sm',
  variant = 'default',
}: DonateButtonProps) {
  const { openWallet } = useWallet();

  return (
    <Button size={size} variant={variant} onClick={() => openWallet(walletId)} className={cn('gap-1.5', className)}>
      <Zap className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
