'use client';

import { useEffect, useState } from 'react';

export function StatusPill() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable <= 0 ? 0 : Math.min(100, Math.round((window.scrollY / scrollable) * 100)));
    };
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
      <div className="fixed left-0 top-0 z-[65] h-[3px] bg-bitcoin transition-[width] duration-150" style={{ width: `${progress}%` }} />
      <div className="fixed right-3 top-[4.5rem] z-[65] flex items-center gap-2.5 rounded-full border border-bitcoin/25 bg-card/95 px-3.5 py-2 text-[11px] font-medium text-foreground shadow-lg backdrop-blur sm:right-6 sm:top-20 sm:px-4 sm:text-xs">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="whitespace-nowrap">Flagship Node • Online</span>
        <span className="h-3 w-px bg-bitcoin/30" />
        <span className="min-w-[2.5rem] text-right font-mono tabular-nums text-bitcoin">{progress}%</span>
      </div>
    </>
  );
}
