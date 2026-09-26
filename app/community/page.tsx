import { Sparkles } from 'lucide-react';
import { CommunityHub } from '@/components/community-hub';

export const metadata = {
  title: 'Community — Bitcoin Flagship',
  description:
    'The Bitcoin Flagship community wall, Bitcoin courses from beginner to advanced, and the local directory of businesses that accept Bitcoin.',
};

export default function CommunityPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-bitcoin/15 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-bitcoin/30 bg-bitcoin/10 px-4 py-1.5 text-xs font-semibold text-bitcoin">
              <Sparkles className="h-3.5 w-3.5" /> Bitcoin-only · Crowd-sourced
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              The <span className="text-gradient-bitcoin">Community</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Real stories from real Bitcoiners, courses that take you from your first sat to reading the protocol,
              and a directory of local businesses that take Bitcoin.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <CommunityHub />
      </section>
    </div>
  );
}
