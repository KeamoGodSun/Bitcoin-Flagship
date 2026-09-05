import { Sparkles, Coins } from 'lucide-react';
import { communityPosts } from '@/lib/data';
import { PostCard } from '@/components/post-card';
import { TipButton } from '@/components/tip-button';
import { siteConfig } from '@/lib/config';

export const metadata = {
  title: 'Community — Bitcoin Flagship',
  description:
    'Bitcoin-only stories from the Bitcoin Flagship community. Read, like, and tip the people building the orange economy.',
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
              The <span className="text-gradient-bitcoin">Community Wall</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Real stories from real Bitcoiners — first stacks, first channels, first murals.
              Tip what you love. The best content wins the most sats.
            </p>
          </div>
        </div>
      </section>

      {/* Feed */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-5">
          {communityPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Submit CTA */}
        <div className="mt-14 rounded-2xl border border-bitcoin/30 bg-gradient-to-br from-bitcoin/10 via-background to-background p-8 text-center">
          <Coins className="mx-auto h-8 w-8 text-bitcoin" />
          <h2 className="mt-4 text-2xl font-bold">Got a Bitcoin-only story?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            The wall is curated by the community. Share your first-stack moment, your Lightning
            number-go-up tale, or your mural story. Good content gets good sats.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-xs text-muted-foreground">
            Send your story to us and it may land on the wall. Until then, tip the wall directly:
          </p>
          <div className="mt-6 flex justify-center">
            <TipButton
              label={`Tip the wall at ${siteConfig.lightningAddress}`}
              memo="Community Wall tip"
              variant="default"
              className="h-10 px-6"
            />
          </div>
        </div>
      </section>
    </div>
  );
}