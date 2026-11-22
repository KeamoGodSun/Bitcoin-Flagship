'use client';

import { ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { siteConfig } from '@/lib/config';

interface LnbitsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context: string;
}

export function LnbitsModal({ open, onOpenChange, context }: LnbitsModalProps) {
  const url = siteConfig.lnbitsPaymentUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-3xl p-5 sm:p-7">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Pay with LNbits</DialogTitle>
          <DialogDescription>
            Secure checkout for {context}. The payment page is embedded below.
          </DialogDescription>
        </DialogHeader>
        <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted sm:aspect-[16/9]">
          <iframe
            src={url}
            title="Bitcoin Flagship LNbits payment"
            className="h-full w-full"
            loading="lazy"
          />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 self-start text-sm font-semibold text-bitcoin underline-offset-4 hover:underline"
        >
          Open payment page in a new tab
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </DialogContent>
    </Dialog>
  );
}
