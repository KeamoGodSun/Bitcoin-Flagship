'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchVisitorPosts, isSupabaseConfigured, type VisitorPost } from '@/lib/supabase';

export function CommunityFeed() {
  const connected = isSupabaseConfigured();
  const [posts, setPosts] = useState<VisitorPost[]>([]);
  const [loading, setLoading] = useState(connected);

  useEffect(() => {
    if (!connected) return;
    let cancelled = false;

    (async () => {
      try {
        const loaded = await fetchVisitorPosts(3);
        if (!cancelled) setPosts(loaded);
      } catch {
        // Leave the list empty; the honest fallback below covers it.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [connected]);

  return (
    <div>
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">From the Community</h2>
        <p className="mt-4 text-muted-foreground">
          Written by the people using this site, on the community wall.
        </p>
      </div>

      {connected && !loading && posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col rounded-xl border border-border bg-background p-5 transition-all hover:border-bitcoin/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bitcoin text-background font-bold">
                  ₿
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">
                    {post.handle || post.author}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground">{post.content}</p>
            </article>
          ))}
        </div>
      ) : connected && !loading ? (
        <p className="mx-auto max-w-lg rounded-lg border border-dashed border-border bg-background/60 p-6 text-center text-sm text-muted-foreground">
          Nothing on the wall yet. Be the first to post.
        </p>
      ) : (
        <div className="mx-auto max-w-lg rounded-lg border border-dashed border-border bg-background/60 p-6 text-center">
          <Users className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            Nothing to show here yet, and we are not going to invent it. This section pulls real posts off the{' '}
            <span className="font-medium text-foreground">community wall</span>, so it stays empty until someone
            writes something.
          </p>
        </div>
      )}

      <div className="mt-10 text-center">
        <a href="/community?tab=wall">
          <Button className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Go to the community wall
          </Button>
        </a>
      </div>
    </div>
  );
}
