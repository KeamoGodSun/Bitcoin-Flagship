'use client';

import { useState } from 'react';
import { Check, Copy, Zap } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export function LightningAddress() {
  const [copied, setCopied] = useState(false);

  const address = siteConfig.lightningAddress;

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-bitcoin/30 bg-bitcoin/5 px-3 py-2">
      <Zap className="h-4 w-4 shrink-0 text-bitcoin" />
      <button
        onClick={copyAddress}
        className="truncate font-mono text-xs font-medium text-foreground transition-colors hover:text-bitcoin"
        title="Copy Lightning address"
      >
        {address}
      </button>
      <button
        onClick={copyAddress}
        aria-label="Copy Lightning address"
        className="ml-auto rounded p-1 text-muted-foreground transition-colors hover:text-bitcoin"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-bitcoin" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <a
        href={`lightning:${address}`}
        aria-label="Open in Lightning wallet"
        className="rounded p-1 text-muted-foreground transition-colors hover:text-bitcoin"
      >
        <Zap className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}