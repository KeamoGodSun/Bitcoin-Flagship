'use client';

import { useState } from 'react';
import { Heart, Zap } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TipDialog } from '@/components/tip-dialog';
import { cn } from '@/lib/utils';
import type { CommunityPost } from '@/lib/data';

interface PostCardProps {
  post: CommunityPost;
}

export function PostCard({ post }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);

  const initials = post.author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="flex gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-bitcoin/40">
      <Avatar className="h-10 w-10 border border-bitcoin/30 bg-bitcoin/10">
        <AvatarFallback className="text-sm font-bold text-bitcoin">{initials}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm font-semibold text-foreground">{post.author}</span>
          <span className="text-xs text-muted-foreground">
            {post.handle} · {post.date}
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-foreground/90">{post.content}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="border border-bitcoin/20 bg-bitcoin/5 text-bitcoin"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setLiked((prev) => !prev);
              setLikes((prev) => prev + (liked ? -1 : 1));
            }}
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-medium transition-colors',
              liked ? 'text-bitcoin' : 'text-muted-foreground hover:text-bitcoin'
            )}
            aria-label={liked ? 'Unlike post' : 'Like post'}
          >
            <Heart className={cn('h-4 w-4', liked && 'fill-bitcoin')} />
            {likes.toLocaleString()}
          </button>

          <div className="flex items-center gap-3">
            {post.satsTipped > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Zap className="h-3.5 w-3.5 text-bitcoin" />
                {post.satsTipped.toLocaleString()} sats tipped
              </span>
            )}
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setTipOpen(true)}>
              <Zap className="h-3.5 w-3.5 text-bitcoin" /> Tip
            </Button>
          </div>
        </div>
      </div>

      <TipDialog
        open={tipOpen}
        onOpenChange={setTipOpen}
        memo={`Tip for ${post.author}`}
        defaultAmount={2100}
      />
    </article>
  );
}