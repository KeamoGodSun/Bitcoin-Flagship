'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navLinks } from '@/lib/nav';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Bitcoin Flagship logo"
            width={36}
            height={36}
            className="rounded-lg object-contain"
          />
          <span className="text-lg font-bold tracking-tight">
            ₿itcoin <span className="text-gradient-bitcoin">Flagship</span>
          </span>
        </Link>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => setOpen((current) => !current)}
            className="inline-flex items-center gap-2 rounded-full border border-bitcoin/40 bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-bitcoin hover:text-bitcoin"
          >
            Menu
            <ChevronDown className={cn('h-4 w-4 text-bitcoin transition-transform duration-300', open && 'rotate-180')} />
          </button>

          <div
            role="menu"
            className={cn(
              'absolute right-0 top-[calc(100%+0.75rem)] min-w-[14rem] origin-top-right rounded-2xl border border-bitcoin/25 bg-card/95 p-2 shadow-2xl backdrop-blur transition-all duration-300',
              open ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
            )}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                role="menuitem"
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-bitcoin/10 text-bitcoin'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border/70" />
            <Link
              role="menuitem"
              href="/contact"
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-bitcoin px-4 py-2.5 text-center text-sm font-semibold text-background transition hover:bg-bitcoin-light"
            >
              Join Us
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
