'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const NAME_KEY = 'bf_first_name';
const SEEN_KEY = 'bf_welcome_seen_v1';

export function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(SEEN_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [open]);

  const finish = useCallback((value: string) => {
    const trimmed = value.trim();
    try {
      window.localStorage.setItem(SEEN_KEY, '1');
      if (trimmed) window.localStorage.setItem(NAME_KEY, trimmed);
    } catch {}
    if (trimmed) {
      window.dispatchEvent(new CustomEvent<string>('bf:first-name', { detail: trimmed }));
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish('');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, finish]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label="Close welcome message"
        onClick={() => finish('')}
        className="absolute inset-0 h-full w-full cursor-default bg-foreground/35 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl sm:p-10"
      >
        <button
          type="button"
          onClick={() => finish('')}
          aria-label="Skip"
          className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bitcoin">Quick one</p>
        <h2 id="welcome-title" className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
          What&rsquo;s your first name?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Just your first name. It makes the site a little more yours.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            finish(name);
          }}
          className="mt-8"
        >
          <label htmlFor="welcome-name" className="text-xs font-medium text-muted-foreground">
            First name
          </label>
          <input
            id="welcome-name"
            ref={inputRef}
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="given-name"
            placeholder="e.g. Thabo"
            className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-bitcoin focus:ring-2 focus:ring-bitcoin/20"
          />
          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => finish('')}
              className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Skip
            </button>
            <button
              type="submit"
              className="rounded-full bg-bitcoin px-7 py-3 text-sm font-semibold text-background transition hover:bg-bitcoin-light"
            >
              Let&rsquo;s go
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
