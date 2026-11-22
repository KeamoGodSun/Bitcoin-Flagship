'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { Story } from '@/lib/stories';

interface StoryDrawerProps {
  story: Story | null;
  onClose: () => void;
  onAction: (story: Story) => void;
}

export function StoryDrawer({ story, onClose, onAction }: StoryDrawerProps) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const jumpTo = useCallback(
    (next: number) => {
      if (!story) return;
      const clamped = Math.max(0, Math.min(story.slides.length - 1, next));
      const track = trackRef.current;
      if (track) {
        track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
      }
      setIndex(clamped);
    },
    [story]
  );

  useEffect(() => {
    setIndex(0);
  }, [story?.id]);

  useEffect(() => {
    if (!story) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') jumpTo(index + 1);
      if (event.key === 'ArrowLeft') jumpTo(index - 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [story, onClose, index, jumpTo]);

  if (!story) return null;

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close story"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-foreground/45 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${story.label} story`}
        className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl sm:max-h-[82vh] sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-border/70 px-6 py-4 sm:px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-bitcoin">Flagship stories</p>
            <p className="mt-1 font-display text-xl">{story.label}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close story"
            className="rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          ref={trackRef}
          onScroll={onScroll}
          className="no-scrollbar flex flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-auto scroll-smooth"
        >
          {story.slides.map((slide, slideIndex) => (
            <div
              key={slide.eyebrow}
              className="flex w-full shrink-0 snap-center flex-col justify-center px-7 py-10 sm:px-12 sm:py-12"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin">{slide.eyebrow}</p>
              <h3 className="mt-5 font-display text-3xl leading-tight sm:text-[2.75rem]">{slide.title}</h3>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">{slide.body}</p>
              {slideIndex === story.slides.length - 1 ? (
                <button
                  type="button"
                  onClick={() => onAction(story)}
                  className="mt-9 inline-flex w-fit items-center gap-2 rounded-full bg-bitcoin px-7 py-3.5 text-sm font-semibold text-background shadow-lg shadow-bitcoin/20 transition hover:bg-bitcoin-light"
                >
                  {story.actionLabel}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border/70 px-6 py-4 sm:px-8">
          <div className="flex items-center gap-1.5">
            {story.slides.map((slide, slideIndex) => (
              <button
                key={slide.eyebrow}
                type="button"
                aria-label={`Go to slide ${slideIndex + 1}`}
                onClick={() => jumpTo(slideIndex)}
                className={`h-1.5 rounded-full transition-all ${
                  slideIndex === index ? 'w-8 bg-bitcoin' : 'w-3 bg-border hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => jumpTo(index - 1)}
              disabled={index === 0}
              className="rounded-full border border-border p-2 transition hover:border-bitcoin hover:text-bitcoin disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => jumpTo(index + 1)}
              disabled={index === story.slides.length - 1}
              className="rounded-full border border-border p-2 transition hover:border-bitcoin hover:text-bitcoin disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
