'use client';

import { Zap, ArrowRight } from 'lucide-react';
import { useWallet } from '@/components/wallet-provider';
import { walletGroups } from '@/lib/wallets';

export function DonateSection() {
  const { openWallet } = useWallet();

  return (
    <section className="border-y border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Fund the <span className="text-gradient-bitcoin">mission</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Every meetup, mural, class, and screening runs on donations. Pick a wallet and your sats go straight to
            the community over the Lightning Network — no third parties, no middlemen.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {walletGroups.map((group) => (
            <div
              key={group.id}
              className="group flex flex-col rounded-xl border border-border bg-background p-6 transition-all hover:border-bitcoin/50 hover:shadow-lg hover:shadow-bitcoin/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-bitcoin/10 text-bitcoin transition-colors group-hover:bg-bitcoin group-hover:text-background">
                <group.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{group.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{group.description}</p>
              {group.programs.length > 0 && (
                <p className="mt-3 text-xs text-bitcoin">
                  {group.programs.map((p) => p.name).join(' · ')}
                </p>
              )}
              <button
                onClick={() => openWallet(group.id)}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-md border border-bitcoin/40 bg-bitcoin/10 px-4 py-2.5 text-sm font-semibold text-bitcoin transition-all hover:bg-bitcoin hover:text-background"
              >
                <Zap className="h-4 w-4" /> Donate
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Donations are received in the open — see every payment live on the ⚡ wallet button below-right on any page.
        </p>
      </div>
    </section>
  );
}