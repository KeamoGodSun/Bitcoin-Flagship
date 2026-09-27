'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, ExternalLink, Search, Store, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { merchants, sampleMerchants, type Merchant } from '@/lib/data';
import { siteConfig } from '@/lib/config';
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

function StoreGrid({ listing, sample = false }: { listing: Merchant[]; sample?: boolean }) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', sample ? 'mt-6' : 'mt-6')}>
      {listing.map((merchant) => (
        <article
          key={merchant.id}
          className={cn(
            'flex flex-col gap-3 rounded-xl border bg-card p-5 transition-colors',
            sample ? 'border-amber-500/40' : 'border-border hover:border-bitcoin/40',
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold">{merchant.name}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{merchant.area}</p>
            </div>
            {sample ? (
              <Badge
                variant="secondary"
                className="shrink-0 border-2 border-amber-500 bg-amber-500/20 text-[10px] uppercase tracking-wider text-amber-500"
              >
                Sample
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className={cn(
                  'shrink-0 text-[10px] uppercase tracking-wider',
                  merchant.standing === 'verified'
                    ? 'border-bitcoin/30 bg-bitcoin/10 text-bitcoin'
                    : 'border-dashed border-border bg-transparent text-muted-foreground',
                )}
              >
                {merchant.standing === 'verified' ? 'Verified' : 'Self-listed'}
              </Badge>
            )}
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
            {merchant.lightning ? (
              sample ? (
                <span className="inline-flex max-w-full items-center gap-2 rounded-md border border-dashed border-border bg-muted px-2.5 py-1.5">
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    {merchant.lightning}
                  </span>
                </span>
              ) : (
                <CopyableAddress address={merchant.lightning} />
              )
            ) : null}
            {merchant.website ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                Visit website
                <ExternalLink className="h-3 w-3" />
              </span>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

function StoreFooter() {
  return (
    <p className="mt-8 rounded-lg border border-dashed border-border bg-card/40 p-4 text-sm text-muted-foreground">
      Run a business that takes sats? Send us the name, what you sell, your area, and a Lightning address or website.
      We add it as <span className="font-medium text-foreground">self-listed</span> first, then flip it to{' '}
      <span className="font-medium text-foreground">verified</span> once someone has actually paid you and confirmed
      it. Entries live in <span className="font-mono text-xs">lib/data.ts</span> under{' '}
      <span className="font-mono text-xs">merchants</span>.
    </p>
  );
}

export function MerchantStore() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  /**
   * Layout review mode. Off unless the URL asks for it, so sample rows can
   * never reach a visitor through a normal link.
   */
  const [sampling, setSampling] = useState(false);

  useEffect(() => {
    setSampling(new URLSearchParams(window.location.search).get('sample') === '1');
  }, []);

  const listing = sampling ? sampleMerchants : merchants;

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(listing.map((m) => m.category))).sort()],
    [listing],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listing.filter((m) => {
      if (category !== 'All' && m.category !== category) return false;
      if (!q) return true;
      return [m.name, m.category, m.area, m.note].some((field) => field.toLowerCase().includes(q));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category, listing]);

  if (sampling) {
    return (
      <div>
        <div className="rounded-xl border-2 border-dashed border-amber-500/50 bg-amber-500/5 p-5">
          <h2 className="text-lg font-bold text-amber-500">Layout preview — sample data</h2>
          <p className="mt-2 max-w-2xl text-sm text-amber-100/80">
            Every business below is invented, to check the layout, spacing, truncation and filters. None of them
            exist. This view only appears at <span className="font-mono text-xs">?sample=1</span> and shares no data
            with the real directory.
          </p>
        </div>

        <StoreGrid listing={visible} sample />
        <StoreFooter />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Store className="h-5 w-5 text-bitcoin" />
            Community store directory
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Local businesses that take Bitcoin, listed by the people who run them. Every entry says whether we have
            checked it, so you can tell a confirmed shop from one that has simply claimed a spot.
          </p>
        </div>
      </div>

      {merchants.length > 0 ? (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, area or what they sell"
                className="pl-9"
                aria-label="Search merchants"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  category === c
                    ? 'border-bitcoin bg-bitcoin/15 text-bitcoin'
                    : 'border-border text-muted-foreground hover:border-bitcoin/40'
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="mt-8 rounded-lg border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
              Nothing matches &ldquo;{query}&rdquo;. Try a broader search.
            </p>
          ) : (
            <StoreGrid listing={visible} />
          )}
        </>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-card/40 p-8 text-center">
          <Store className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No businesses listed yet</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            This directory is empty on purpose. We would rather show you nothing than invent shops, so every entry
            here has to be a real business someone has actually confirmed. If yours takes sats, it should be on this
            list.
          </p>
          <a
            href={`mailto:wall@${siteConfig.url.replace(/^https?:\/\//, '').split('/')[0]}?subject=Add%20my%20business%20to%20the%20store%20directory`}
          >
            <Button className="mt-6 gap-1.5">
              <Zap className="h-4 w-4" /> Add my business
            </Button>
          </a>
        </div>
      )}

      <StoreFooter />
    </div>
  );
}
