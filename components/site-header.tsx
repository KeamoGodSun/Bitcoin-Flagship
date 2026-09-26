'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navLinks } from '@/lib/nav';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt="Bitcoin Flagship logo"
            width={36}
            height={36}
            className="rounded-lg object-contain"
          />
          <span className="text-lg font-bold tracking-tight">
            ₿itcoin <span className="text-bitcoin">Flagship</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'text-bitcoin'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-md bg-bitcoin px-5 py-2 text-sm font-semibold text-background shadow-lg shadow-bitcoin/20 transition-all hover:bg-bitcoin-light hover:shadow-bitcoin/40"
          >
            Join Us
          </Link>
        </div>

        <button
          className="flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border/60 bg-background px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'block rounded-md px-4 py-3 text-base font-medium transition-colors',
                pathname === link.href
                  ? 'bg-secondary text-bitcoin'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-md bg-bitcoin px-4 py-3 text-center text-base font-semibold text-background"
          >
            Join Us
          </Link>
        </nav>
      )}
    </header>
  );
}
