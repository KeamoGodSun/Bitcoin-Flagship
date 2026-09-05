'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TipDialog } from '@/components/tip-dialog';
import { cn } from '@/lib/utils';

interface TipButtonProps {
  memo?: string;
  amount?: number;
  label?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function TipButton({
  memo = 'Bitcoin Flagship tip',
  amount = 2100,
  label = 'Tip',
  className,
  variant = 'outline',
}: TipButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size="sm"
        onClick={() => setOpen(true)}
        className={cn('gap-1.5', className)}
      >
        <Zap className="h-3.5 w-3.5 text-bitcoin" />
        {label}
      </Button>
      <TipDialog open={open} onOpenChange={setOpen} memo={memo} defaultAmount={amount} />
    </>
  );
}