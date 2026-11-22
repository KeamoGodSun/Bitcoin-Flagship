'use client';

import { useState } from 'react';
import { GraduationCap, Info, Menu, Store, Ticket, X, type LucideIcon } from 'lucide-react';
import { StoryDrawer } from '@/components/story-drawer';
import { LnbitsModal } from '@/components/lnbits-modal';
import { stories, type Story } from '@/lib/stories';

const icons: Record<Story['id'], LucideIcon> = {
  vouchers: Ticket,
  'market-day': Store,
  workshops: GraduationCap,
  about: Info,
};

const poppedPositions = [
  'translate3d(58px, -18px, 0)',
  'translate3d(116px, -78px, 0)',
  'translate3d(158px, -150px, 0)',
  'translate3d(178px, -226px, 0)',
];

export function StoryMenu() {
  const [open, setOpen] = useState(false);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentContext, setPaymentContext] = useState('');

  return (
    <>
      <div className="fixed bottom-5 left-5 z-[75] sm:bottom-7 sm:left-7">
        {stories.map((story, index) => {
          const Icon = icons[story.id];
          return (
            <button
              key={story.id}
              type="button"
              aria-hidden={!open}
              tabIndex={open ? 0 : -1}
              onClick={() => {
                setActiveStory(story);
                setOpen(false);
              }}
              className="absolute bottom-0 left-0 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-bitcoin/35 bg-card/95 px-4 py-2.5 text-xs font-semibold text-foreground shadow-xl backdrop-blur transition-[transform,opacity] duration-500 hover:border-bitcoin hover:text-bitcoin sm:text-sm"
              style={{
                transform: open ? poppedPositions[index] : 'translate3d(0, 0, 0) scale(0.6)',
                opacity: open ? 1 : 0,
                pointerEvents: open ? 'auto' : 'none',
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                transitionDelay: open ? `${index * 55}ms` : '0ms',
              }}
            >
              <Icon className="h-3.5 w-3.5 text-bitcoin" />
              {story.label}
            </button>
          );
        })}

        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="relative inline-flex items-center gap-2.5 rounded-full border border-bitcoin/40 bg-foreground px-6 py-3.5 text-sm font-semibold text-background shadow-2xl transition hover:bg-bitcoin hover:text-background"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      <StoryDrawer
        story={activeStory}
        onClose={() => setActiveStory(null)}
        onAction={(story) => {
          setActiveStory(null);
          setPaymentContext(story.label);
          setPaymentOpen(true);
        }}
      />
      <LnbitsModal open={paymentOpen} onOpenChange={setPaymentOpen} context={paymentContext} />
    </>
  );
}
