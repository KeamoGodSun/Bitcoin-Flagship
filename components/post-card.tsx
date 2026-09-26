'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Heart, Loader2, MessageSquare, Send, Sparkles, Zap } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TipDialog } from '@/components/tip-dialog';
import { cn } from '@/lib/utils';
import type { CommunityPost } from '@/lib/data';
import {
  addComment,
  fetchComments,
  fetchLikeCount,
  fetchLikedPostIds,
  fetchTipTotal,
  isSupabaseConfigured,
  rememberDisplayName,
  storedDisplayName,
  toggleLike,
  type WallComment,
} from '@/lib/supabase';

interface PostCardProps {
  post: CommunityPost;
}

export function PostCard({ post }: PostCardProps) {
  const connected = isSupabaseConfigured();

  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [satsTipped, setSatsTipped] = useState(post.satsTipped);
  const [comments, setComments] = useState<WallComment[]>([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [tipOpen, setTipOpen] = useState(false);

  const loadTipTotal = useCallback(async () => {
    if (!connected) return;
    try {
      setSatsTipped(await fetchTipTotal(post.id));
    } catch {
      setNotice('Could not load the tip total.');
    }
  }, [connected, post.id]);

  useEffect(() => {
    if (!connected) return;
    let cancelled = false;

    (async () => {
      try {
        const [count, likedIds, total, loaded] = await Promise.all([
          fetchLikeCount(post.id),
          fetchLikedPostIds(),
          fetchTipTotal(post.id),
          fetchComments(post.id),
        ]);
        if (cancelled) return;
        setLikes(count);
        setLiked(likedIds.includes(post.id));
        setSatsTipped(total);
        setComments(loaded);
        setAuthor(storedDisplayName());
      } catch {
        if (!cancelled) setNotice('Live wall data is unavailable right now.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [connected, post.id]);

  const onToggleLike = async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((prev) => prev + (nextLiked ? 1 : -1));

    if (!connected) return;
    try {
      await toggleLike(post.id, nextLiked);
    } catch {
      setLiked(!nextLiked);
      setLikes((prev) => prev + (nextLiked ? -1 : 1));
      setNotice('Like did not save. It stays on this device only.');
    }
  };

  const onSubmitComment = async (event: React.FormEvent) => {
    event.preventDefault();
    const body = draft.trim();
    const name = author.trim() || 'anon';
    if (!body) return;

    setSending(true);
    setNotice(null);
    try {
      const saved = await addComment(post.id, name, body);
      setComments((prev) => [...prev, saved]);
      setDraft('');
      rememberDisplayName(name);
    } catch {
      setNotice('Comment did not save. Please try again.');
    } finally {
      setSending(false);
    }
  };

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
          {post.sample ? (
            <Badge
              variant="secondary"
              className="gap-1 border border-dashed border-border bg-transparent text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              <Sparkles className="h-3 w-3" />
              Sample
            </Badge>
          ) : null}
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

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleLike}
              className={cn(
                'inline-flex items-center gap-1.5 text-xs font-medium transition-colors',
                liked ? 'text-bitcoin' : 'text-muted-foreground hover:text-bitcoin'
              )}
              aria-label={liked ? 'Unlike post' : 'Like post'}
            >
              <Heart className={cn('h-4 w-4', liked && 'fill-bitcoin')} />
              {likes.toLocaleString()}
            </button>

            <button
              onClick={() => setCommentsOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-bitcoin"
              aria-expanded={commentsOpen}
            >
              <MessageSquare className="h-4 w-4" />
              {comments.length > 0 ? `${comments.length} ` : ''}
              {comments.length === 1 ? 'comment' : 'comments'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {satsTipped > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Zap className="h-3.5 w-3.5 text-bitcoin" />
                {satsTipped.toLocaleString()} sats tipped
              </span>
            )}
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setTipOpen(true)}>
              <Zap className="h-3.5 w-3.5 text-bitcoin" /> Tip
            </Button>
          </div>
        </div>

        {notice ? (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5" />
            {notice}
          </p>
        ) : null}

        {commentsOpen ? (
          <div className="mt-4 border-t border-border/70 pt-4">
            {comments.length > 0 ? (
              <ul className="space-y-3">
                {comments.map((comment) => (
                  <li key={comment.id} className="text-sm">
                    <span className="font-semibold text-foreground">{comment.author}</span>{' '}
                    <span className="text-xs text-muted-foreground">
                      · {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    <p className="mt-0.5 leading-relaxed text-muted-foreground">{comment.body}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No comments yet. Start the thread.</p>
            )}

            {connected ? (
              <form onSubmit={onSubmitComment} className="mt-4 space-y-2">
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your name"
                  maxLength={40}
                  className="max-w-[200px]"
                />
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.slice(0, 1000))}
                  placeholder="Add a comment"
                  rows={2}
                />
                <Button type="submit" size="sm" disabled={sending || !draft.trim()} className="gap-1.5">
                  {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  Post comment
                </Button>
              </form>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                Comments switch on once the community database is connected.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <TipDialog
        open={tipOpen}
        onOpenChange={setTipOpen}
        postId={post.id}
        memo={`Tip for ${post.author} — ${post.id}`}
        defaultAmount={2100}
        onPaid={loadTipTotal}
      />
    </article>
  );
}
