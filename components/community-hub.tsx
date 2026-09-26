'use client';

import { useState } from 'react';
import { AlertTriangle, Coins, MessageSquare, Store, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/post-card';
import { TipDialog } from '@/components/tip-dialog';
import { MerchantStore } from '@/components/merchant-store';
import { LearnHub } from '@/components/learn-hub';
import { communityPosts } from '@/lib/data';
import { siteConfig } from '@/lib/config';
import { isSupabaseConfigured } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const TABS = [
  { value: 'wall', label: 'Wall', icon: MessageSquare },
  { value: 'learn', label: 'Learn', icon: Zap },
  { value: 'store', label: 'Store', icon: Store },
];

function Wall() {
  const [tipOpen, setTipOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-2xl font-bold">The wall</h2>
        <p className="text-sm text-muted-foreground">
          Counts here are the real ones: likes are one per visitor, and sats only count once a payment settles.
        </p>
      </div>

      <div className="mt-6 space-y-5">
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

  return (
    <div>
      {process.env.NODE_ENV !== 'production' && !connected ? (
        <p className="mb-8 flex items-start gap-2 rounded-lg border border-dashed border-border bg-card/40 p-3 text-xs text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            The wall is running on sample content. Live comments, likes and tip totals switch on once
            <span className="font-mono"> NEXT_PUBLIC_SUPABASE_URL</span> and
            <span className="font-mono"> NEXT_PUBLIC_SUPABASE_ANON_KEY</span> are set and
            <span className="font-mono"> supabase/schema.sql</span> has been run.
          </span>
        </p>
      ) : null}

      <Tabs defaultValue="wall">
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
