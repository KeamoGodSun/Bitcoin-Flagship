'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const NAME_KEY = 'bf_first_name';

export function EditorialHero() {
  const [name, setName] = useState('');

  useEffect(() => {
    const read = () => {
      try {
        setName(window.localStorage.getItem(NAME_KEY) || '');
      } catch {
        setName('');
      }
    };
    const onName = (event: Event) => setName((event as CustomEvent<string>).detail || '');
    read();
    window.addEventListener('bf:first-name', onName);
    window.addEventListener('storage', read);
    return () => {
      window.removeEventListener('bf:first-name', onName);
      window.removeEventListener('storage', read);
    };
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-background">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute -right-16 top-10 select-none font-display text-[18rem] leading-none text-bitcoin/[0.06] sm:right-4 sm:text-[24rem]">
        ₿
      </div>
      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:px-12">
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          <span className="h-px w-8 bg-bitcoin" />
          Grassroots Bitcoin • Johannesburg / Randfontein
        </p>
        <h1 className="mt-10 max-w-5xl text-[clamp(2.75rem,7vw,5.75rem)] leading-[0.98] tracking-[-0.03em]">
          <span className="block text-muted-foreground">hi {name || 'there'},</span>
          <span className="block">spend sats like cash in</span>
          <span className="block text-gradient-bitcoin">Joburg &amp; Randfontein.</span>
        </h1>
        <div className="mt-12 flex flex-col gap-8 border-t border-border/70 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Bitcoin Flagship is a community-driven movement putting Bitcoin to work in everyday life —
            through merchant vouchers, market days, workshops and public art.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full bg-bitcoin px-6 py-3 text-sm font-semibold text-background transition hover:bg-bitcoin-light"
            >
              Upcoming Events
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-bitcoin hover:text-bitcoin"
            >
              Our Mission
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
