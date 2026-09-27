'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Coins, MessageSquare, Store, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/post-card';
import { WallComposer } from '@/components/wall-composer';
import { TipDialog } from '@/components/tip-dialog';
import { MerchantStore } from '@/components/merchant-store';
import { LearnHub } from '@/components/learn-hub';
import { communityPosts } from '@/lib/data';
import { siteConfig } from '@/lib/config';
import { fetchVisitorPosts, isSupabaseConfigured, type VisitorPost } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const TABS = [
  { value: 'wall', label: 'Wall', icon: MessageSquare },
  { value: 'learn', label: 'Learn', icon: Zap },
  { value: 'store', label: 'Store', icon: Store },
];

function Wall() {
  const [tipOpen, setTipOpen] = useState(false);
  const [visitorPosts, setVisitorPosts] = useState<VisitorPost[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured());
  const [loadError, setLoadError] = useState<string | null>(null);
  const live = isSupabaseConfigured();

  useEffect(() => {
    if (!live) return;
    let cancelled = false;

    (async () => {
      try {
        const posts = await fetchVisitorPosts();
        if (!cancelled) setVisitorPosts(posts);
      } catch {
        if (!cancelled) setLoadError('Could not load community posts.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [live]);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-2xl font-bold">The wall</h2>
        <p className="text-sm text-muted-foreground">
          {live
            ? 'Posts here are written by the public, and the counts are the real ones: likes are one per visitor, and sats only count once a payment settles.'
            : 'Not connected yet. The posts below are samples and every count is switched off, because a wall that quotes invented numbers is worse than an empty one.'}
        </p>
      </div>

      {!live ? (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-dashed border-border bg-card/40 p-4 text-sm text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Likes, comments, posting and tip totals read as &ldquo;not counting&rdquo; until the community database is
            connected. Nothing is stored on this device and no number on this page is real.
          </span>
        </p>
      ) : null}

      <div className="mt-6">
        <WallComposer />
      </div>

      {loadError ? <p className="mt-4 text-sm text-destructive">{loadError}</p> : null}

      {live && visitorPosts.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            From the community
          </h3>
          <div className="mt-4 space-y-5">
            {visitorPosts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  id: post.id,
                  author: post.author,
                  handle: post.handle || 'community member',
                  date: new Date(post.createdAt).toLocaleDateString(),
                  content: post.content,
                  tags: post.tags,
                }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {live && !loading && visitorPosts.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
          No community posts yet. The five below are the ones we curated — be the first to add yours.
        </p>
      ) : null}

      <div className="mt-10 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">From the team</h3>
        {communityPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-bitcoin/30 bg-gradient-to-br from-bitcoin/10 via-background to-background p-8 text-center">
        <Coins className="mx-auto h-8 w-8 text-bitcoin" />
        <h3 className="mt-4 text-2xl font-bold">Got a Bitcoin-only story?</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          The wall is curated by the community. Share your first-stack moment, your Lightning number-go-up tale, or your
          mural story. Good content gets good sats.
        </p>
        <p className="mx-auto mt-3 max-w-xl text-xs text-muted-foreground">
          Send your story to us and it may land on the wall. Until then, tip the wall directly:
        </p>
        <div className="mt-6 flex justify-center">
          <Button
            onClick={() => setTipOpen(true)}
            className="h-10 gap-1.5 px-6"
            aria-label={`Tip the wall at ${siteConfig.lightningAddress}`}
          >
            <Zap className="h-4 w-4" /> Tip the wall
          </Button>
        </div>
      </div>

      <TipDialog
        open={tipOpen}
        onOpenChange={setTipOpen}
        memo="Community Wall tip"
        defaultAmount={2100}
      />
    </div>
  );
}

export function CommunityHub() {
  const connected = isSupabaseConfigured();
  const [tab, setTab] = useState('wall');

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('tab');
    if (requested && TABS.some((entry) => entry.value === requested)) setTab(requested);
  }, []);

  return (
    <div>
      {process.env.NODE_ENV !== 'production' && !connected ? (
        <p className="mb-8 flex items-start gap-2 rounded-lg border border-dashed border-border bg-card/40 p-3 text-xs text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            The wall is running on sample content. Live comments, likes and tip totals switch on once
            <span className="font-mono"> NEXT_PUBLIC_SUPABASE_URL</span> and
            <span className="font-mono"> NEXT_PUBLIC_SUPABASE_ANON_KEY</span> are set and the migrations in
            <span className="font-mono"> supabase/migrations</span> have been applied.
          </span>
        </p>
      ) : null}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className={cn('gap-1.5')}>
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="wall" className="mt-8">
          <Wall />
        </TabsContent>
        <TabsContent value="learn" className="mt-8">
          <LearnHub />
        </TabsContent>
        <TabsContent value="store" className="mt-8">
          <MerchantStore />
        </TabsContent>
      </Tabs>
    </div>
  );
}
