'use client';

import { useState } from 'react';
import { Loader2, PenLine, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { addVisitorPost, isSupabaseConfigured, rememberDisplayName, storedDisplayName } from '@/lib/supabase';

const TAG_HINT = 'Add up to 3 tags, comma separated. e.g. lightning, meetup';

export function WallComposer() {
  const connected = isSupabaseConfigured();
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const body = content.trim();
    if (!body) return;

    setSending(true);
    setError(null);
    try {
      const cleanTags = tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 3);

      await addVisitorPost({
        author: name.trim() || 'anon',
        handle: handle.trim(),
        content: body,
        tags: cleanTags,
      });

      rememberDisplayName(name.trim() || 'anon');
      setContent('');
      setTags('');
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not post. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!connected) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/40 p-5">
        <h3 className="flex items-center gap-2 font-semibold">
          <PenLine className="h-4 w-4 text-muted-foreground" />
          Post to the wall
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Posting opens once the community database is connected. Until then the wall is read-only, because an
          open wall we cannot store is just a form that throws your words away.
        </p>
        <Button className="mt-4" disabled variant="outline">
          Posting not available yet
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-bitcoin/30 bg-card p-5">
      <h3 className="flex items-center gap-2 font-semibold">
        <PenLine className="h-4 w-4 text-bitcoin" />
        Post to the wall
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Anyone can post, no account needed. A moderator reads it before it appears, so it will not be on the wall the
        moment you hit send.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 40))}
          placeholder={storedDisplayName() || 'Your name'}
          maxLength={40}
          aria-label="Your name"
        />
        <Input
          value={handle}
          onChange={(e) => setHandle(e.target.value.slice(0, 40))}
          placeholder="@handle (optional)"
          maxLength={40}
          aria-label="Your handle"
        />
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, 1000))}
        placeholder="What happened in your part of the community? First purchase, a Lightning payment that actually worked, the mural, the meetup."
        rows={4}
        className="mt-2"
        aria-label="Your post"
      />

      <Input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder={TAG_HINT}
        className="mt-2"
        aria-label="Tags"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={sending || !content.trim()} className="gap-1.5">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send to the wall
        </Button>
        <span className="text-xs text-muted-foreground">{content.trim().length}/1000</span>
      </div>

      {done ? (
        <p className="mt-3 text-sm text-bitcoin">
          Sent. It goes live once a moderator approves it.
        </p>
      ) : null}
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
