'use client';

import { useState } from 'react';
import { Calendar, MapPin, ArrowRight, Zap, LayoutGrid, CalendarClock } from 'lucide-react';
import { events, eventCategories, type EventCategory } from '@/lib/data';
import { useWallet } from '@/components/wallet-provider';
import { EventSchedule } from '@/components/event-schedule';
import { Button } from '@/components/ui/button';
import { getWalletGroup } from '@/lib/wallets';
import { getProgram } from '@/lib/programs';
import { formatEventDate } from '@/lib/ics';
import { cn } from '@/lib/utils';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventCategory>('meetups');
  const [view, setView] = useState<'categories' | 'schedule'>('categories');
  const { openWallet } = useWallet();
  const filteredEvents = events.filter((e) => e.category === activeTab);
  const activeCategory = eventCategories.find((c) => c.id === activeTab);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-bitcoin/15 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-gradient-bitcoin">Events</span> &amp; Projects
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Meetups, workshops, murals, and campaigns. Find an event near you and get involved.
            </p>
          </div>
        </div>
      </section>

      {/* View toggle */}
      <div className="mx-auto mt-10 flex w-fit items-center gap-2 rounded-xl border border-border bg-card p-1.5">
        {(
          [
            { id: 'categories', label: 'Browse', icon: LayoutGrid },
            { id: 'schedule', label: 'Schedule & Timeline', icon: CalendarClock },
          ] as const
        ).map((option) => (
          <button
            key={option.id}
            onClick={() => setView(option.id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all',
              view === option.id
                ? 'bg-bitcoin text-background shadow-lg shadow-bitcoin/30'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <option.icon className="h-4 w-4" />
            {option.label}
          </button>
        ))}
      </div>

      {/* Tabs + Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {view === 'schedule' ? (
          <EventSchedule />
        ) : (
          <>
        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {eventCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all sm:px-5',
                activeTab === cat.id
                  ? 'bg-bitcoin text-background shadow-lg shadow-bitcoin/30'
                  : 'border border-border bg-card text-muted-foreground hover:border-bitcoin/50 hover:text-foreground'
              )}
            >
              <cat.icon className="h-4 w-4" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Category description */}
        <div className="mx-auto mt-10 max-w-2xl text-center">
          <p className="text-lg text-muted-foreground">{activeCategory?.description}</p>
        </div>

        {/* Category wallet */}
        {activeCategory && (() => {
          const program = getProgram(filteredEvents[0]?.programId ?? '');
          const groupName = program ? getWalletGroup(program.walletGroupId).shortName : null;
          return groupName ? (
            <div className="mx-auto mt-6 flex max-w-2xl items-center justify-center gap-3 rounded-xl border border-bitcoin/30 bg-bitcoin/5 px-5 py-3 text-center">
              <Zap className="h-4 w-4 shrink-0 text-bitcoin" />
              <p className="text-sm text-muted-foreground">
                Every event here is funded by the{' '}
                <span className="font-semibold text-bitcoin">{groupName}</span> wallet.
              </p>
            </div>
          ) : null;
        })()}

        {/* Events grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const cat = eventCategories.find((c) => c.id === event.category);
            return (
              <div
                key={event.title}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-bitcoin/50 hover:shadow-lg hover:shadow-bitcoin/5"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-bitcoin">
                  {cat && <cat.icon className="h-4 w-4" />}
                  <span>{cat?.label}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{event.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{event.description}</p>
                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-bitcoin" />
                    {formatEventDate(event.date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-bitcoin" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <button className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-bitcoin transition-colors hover:text-bitcoin-light">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/60 pt-4">
                  <span className="truncate text-[11px] font-medium text-muted-foreground">
                    {getProgram(event.programId)?.name ?? event.programId}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const program = getProgram(event.programId);
                      if (program) openWallet(program.walletGroupId, program.id);
                    }}
                    className="gap-1.5"
                  >
                    <Zap className="h-3.5 w-3.5 text-bitcoin" /> Support
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">No events scheduled in this category yet. Check back soon.</p>
        )}
          </>
        )}
      </section>
    </div>
  );
}
