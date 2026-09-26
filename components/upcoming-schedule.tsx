'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarClock, MapPin, Zap } from 'lucide-react';
import { events, eventCategories } from '@/lib/data';
import { parseEventDate, formatEventDate, toDayKey } from '@/lib/ics';
import { getProgram } from '@/lib/programs';
import { useWallet } from '@/components/wallet-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DAY_MS = 86_400_000;

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function daysUntil(from: Date, date: number): number {
  return Math.round((date - from.getTime()) / DAY_MS);
}

function countdownLabel(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `in ${days} days`;
}

export function UpcomingSchedule({ limit = 6 }: { limit?: number }) {
  const { openWallet } = useWallet();

  const upcoming = useMemo(() => {
    const today = startOfToday();
    const todayKey = toDayKey(today);
    return events
      .map((event) => ({ event, date: parseEventDate(event.date) }))
      .filter((entry) => toDayKey(entry.date) >= todayKey)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, limit);
  }, [limit]);

  const groups = useMemo(() => {
    const buckets: { key: string; label: string; items: typeof upcoming }[] = [];
    for (const entry of upcoming) {
      const key = `${entry.date.getFullYear()}-${entry.date.getMonth()}`;
      const last = buckets[buckets.length - 1];
      if (last && last.key === key) {
        last.items.push(entry);
      } else {
        buckets.push({
          key,
          label: entry.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          items: [entry],
        });
      }
    }
    return buckets;
  }, [upcoming]);

  return (
    <div>
      {groups.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <CalendarClock className="mx-auto h-8 w-8 text-bitcoin" />
          <p className="mt-3 text-muted-foreground">
            No upcoming events scheduled right now — check the full schedule soon.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.key}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-bitcoin">{group.label}</h3>
                <span className="h-px flex-1 bg-border" />
              </div>

              <ol className="space-y-3">
                {group.items.map(({ event, date }) => {
                  const cat = eventCategories.find((c) => c.id === event.category);
                  const program = getProgram(event.programId);
                  const dayCount = daysUntil(startOfToday(), date.getTime());
                  return (
                    <li
                      key={event.id}
                      className="group flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-bitcoin/50 sm:flex-nowrap"
                    >
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg border border-bitcoin/30 bg-bitcoin/10 text-bitcoin">
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {date.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-xl font-bold leading-none">{date.getDate()}</span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-semibold">{event.title}</h4>
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                              dayCount === 0
                                ? 'bg-bitcoin text-background'
                                : 'border border-bitcoin/30 text-bitcoin'
                            )}
                          >
                            {countdownLabel(dayCount)}
                          </span>
                        </div>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            {cat && <cat.icon className="h-3.5 w-3.5 text-bitcoin" />}
                            {cat?.label}
                          </span>
                          {program && <span className="text-bitcoin">{program.name}</span>}
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-bitcoin" />
                            {event.location}
                          </span>
                        </p>
                      </div>

                      {program && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => openWallet(program.walletGroupId, program.id)}
                        >
                          <Zap className="h-3.5 w-3.5 text-bitcoin" /> Support
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center sm:justify-end">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-bitcoin transition-colors hover:text-bitcoin-light"
        >
          View full schedule &amp; timeline
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}