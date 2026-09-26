'use client';

import Link from 'next/link';
import { ArrowRight, Clapperboard, Film, Zap } from 'lucide-react';
import { useWallet } from '@/components/wallet-provider';

const HEADLINE = 'State Project Doccie';
const OVERSPRAY =
  '[font-family:Impact,Haettenschweiler,"Arial_Black","Franklin_Heavy",sans-serif] uppercase';

export function DoccieTeaser() {
  const { openWallet } = useWallet();

  return (
    <section id="doccie" className="relative overflow-hidden border-y border-border/60">
      <div className="absolute inset-0 -z-10 bg-zinc-950" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 opacity-60"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(60% 55% at 78% 12%, rgba(247,147,26,0.22), transparent 70%), radial-gradient(45% 40% at 8% 88%, rgba(247,147,26,0.14), transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative">
            <span className="inline-flex -rotate-2 items-center gap-2 rounded-md border border-dashed border-bitcoin/60 bg-bitcoin/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-bitcoin">
              <Clapperboard className="h-3.5 w-3.5" aria-hidden="true" />
              In production
            </span>

            <div className="relative mt-5">
              <span
                className={`pointer-events-none absolute -inset-x-2 top-1 select-none text-5xl font-black leading-[0.9] tracking-tight text-bitcoin/25 blur-md sm:text-7xl ${OVERSPRAY}`}
                aria-hidden="true"
              >
                {HEADLINE}
              </span>
              <h2
                className={`relative select-none text-5xl font-black leading-[0.9] tracking-tight text-transparent sm:text-7xl ${OVERSPRAY}`}
                style={{
                  backgroundImage: 'linear-gradient(120deg, #FFB347 0%, #F7931A 45%, #C77D12 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextStroke: '1px rgba(0,0,0,0.35)',
                  filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,0.55))',
                }}
              >
                {HEADLINE}
              </h2>
            </div>

            <p className="mt-4 -rotate-1 font-mono text-sm font-bold uppercase tracking-[0.3em] text-zinc-400">
              coming soon
            </p>

            <p className="mt-6 max-w-xl text-lg text-zinc-300">
              We&apos;re filming. The documentary is in production now and the link lands here the moment it is ready.
              Until then you can chip in toward the shoot — camera and sound gear, travel between cities, and
              post-production.
            </p>
            <p className="mt-3 max-w-xl text-sm text-zinc-500">
              Every contribution is tagged to this project in our wallet records, so the funding trail stays legible
              from day one.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => openWallet('documentary', 'documentary')}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-bitcoin px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-bitcoin/20 transition hover:bg-bitcoin-dark"
              >
                <Zap className="h-4 w-4" aria-hidden="true" />
                Fund the shoot
              </button>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-bitcoin/50 hover:text-bitcoin"
              >
                <Film className="h-4 w-4" aria-hidden="true" />
                See what we&apos;ve made so far
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rotate-2 rounded-xl border-2 border-dashed border-bitcoin/40 bg-zinc-900/70 p-8 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">No link yet</p>
              <p className="mt-4 font-mono text-2xl font-bold text-bitcoin sm:text-3xl">{'/// coming soon ///'}</p>
              <p className="mt-4 text-sm text-zinc-400">
                The trailer drops here. Donations are already open, tagged{' '}
                <span className="font-mono text-zinc-300">State Project Doccie — film</span>.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 border-t border-dashed border-zinc-800 pt-5 text-xs text-zinc-500">
                <Zap className="h-3.5 w-3.5 text-bitcoin" aria-hidden="true" />
                Lightning invoice or lightning address
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
