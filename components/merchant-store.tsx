'use client';

import { useState } from 'react';
import { Check, Copy, ExternalLink, Store, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { merchants } from '@/lib/data';
import { cn } from '@/lib/utils';

function CopyableAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex max-w-full items-center gap-2 rounded-md border border-border bg-muted px-2.5 py-1.5 font-mono text-xs text-foreground transition hover:border-bitcoin/40"
      aria-label={`Copy ${address}`}
    >
      <span className="truncate">{address}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-bitcoin" />
      ) : (
        <Copy className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      )}
    </button>
  );
}

export function MerchantStore() {
  const categories = ['All', ...Array.from(new Set(merchants.map((m) => m.category)))];

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Store className="h-5 w-5 text-bitcoin" />
            Community store directory
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Local businesses that take Bitcoin. Entries are added by hand, so if a shop here has moved on, tell us and
            we will fix or remove it.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <span
            key={category}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium',
              category === 'All'
                ? 'border-bitcoin bg-bitcoin/15 text-bitcoin'
                : 'border-border text-muted-foreground'
            )}
          >
            {category}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {merchants.map((merchant) => (
          <article
            key={merchant.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-bitcoin/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold">{merchant.name}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{merchant.area}</p>
              </div>
              {merchant.example ? (
                <Badge
                  variant="secondary"
                  className="shrink-0 border border-dashed border-border bg-transparent text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  Example
                </Badge>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="border border-bitcoin/20 bg-bitcoin/5 text-bitcoin">
                {merchant.category}
              </Badge>
              <Badge variant="secondary" className="border border-border bg-transparent text-muted-foreground">
                <Zap className="mr-1 h-3 w-3 text-bitcoin" />
                {merchant.payment}
              </Badge>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">{merchant.note}</p>

            <div className="mt-auto space-y-2 pt-1">
              {merchant.lightning ? <CopyableAddress address={merchant.lightning} /> : null}
              {merchant.website ? (
                <a
                  href={merchant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-bitcoin hover:underline"
                >
                  Visit website
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 rounded-lg border border-dashed border-border bg-card/40 p-4 text-sm text-muted-foreground">
        Run a business that takes sats? Add it to <span className="font-mono text-xs">lib/data.ts</span> under{' '}
        <span className="font-mono text-xs">merchants</span> — name, area, category, and a Lightning address or
        website.
      </p>
    </div>
  );
}
