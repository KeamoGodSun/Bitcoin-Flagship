'use client';

import { useEffect, useMemo, useState } from 'react';
import { Archive, CalendarPlus, MapPin, Radio } from 'lucide-react';
import { events, type EventItem } from '@/lib/data';
import {
  buildEventBookshelf,
  countEventStatuses,
  getEventStatus,
  getNextEvent,
  type EventShelf,
  type EventStatus,
} from '@/lib/event-archive';
import { downloadEventIcs, formatEventDate } from '@/lib/ics';
import { getProgram } from '@/lib/programs';
import { getWalletGroup } from '@/lib/wallets';
import { cn } from '@/lib/utils';

const STATUS_META: Record<EventStatus, { label: string; chip: string; card: string }> = {
  past: {
    label: 'Archived',
    chip: 'border-border bg-muted/50 text-muted-foreground',
    card: 'opacity-60 hover:opacity-100',
  },
  today: {
    label: 'Happening now',
    chip: 'border-bitcoin/60 bg-bitcoin/15 text-bitcoin',
    card: 'border-bitcoin/60 ring-1 ring-bitcoin/30',
  },
  upcoming: {
    label: 'Upcoming',
    chip: 'border-bitcoin/30 bg-bitcoin/10 text-bitcoin',
    card: 'hover:border-bitcoin/40',
  },
};

const icsButton =
  'inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-bitcoin/50 hover:text-bitcoin';

export function EventBookshelf() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const refresh = () => setNow(new Date());
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);

  const book = useMemo(() => buildEventBookshelf(events), []);
  const counts = useMemo(() => (now ? countEventStatuses(events, now) : null), [now]);
  const nextEvent = useMemo(() => (now ? getNextEvent(events, now) : undefined), [now]);

  return (
    <section id="archive" className="border-y border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-bitcoin">
            <Archive className="h-4 w-4" aria-hidden="true" />
            Event archive
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Every event, filed by the month</h2>
          <p className="mt-4 text-muted-foreground">
            Meet-ups, bootcamps, movie nights and game days all land here. Once a date passes, the event files itself
            onto its month shelf, so the shelves fill up into a year-by-year record as the campaign runs.
          </p>
        </div>

        {counts ? (
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="rounded-full border border-bitcoin/30 bg-bitcoin/10 px-3 py-1 text-bitcoin">
              {counts.upcoming} upcoming
            </span>
            <span className="rounded-full border border-bitcoin/60 bg-bitcoin/15 px-3 py-1 text-bitcoin">
              {counts.today} today
            </span>
            <span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-muted-foreground">
              {counts.past} archived
            </span>
          </div>
        ) : null}

        {nextEvent ? <NextUp event={nextEvent} now={now!} /> : null}

        {book.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">Nothing on the shelf yet — check back soon.</p>
        ) : (
          <div className="mt-12 space-y-12">
            {book.map((entry) => (
              <YearBook
                key={entry.year}
                year={entry.year}
                shelves={entry.shelves}
                eventCount={entry.eventCount}
                now={now}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function NextUp({ event, now }: { event: EventItem; now: Date }) {
  const program = getProgram(event.programId);
  const group = getWalletGroup(program?.walletGroupId ?? 'flagship');
  const GroupIcon = group.icon;
  const live = getEventStatus(event, now) === 'today';

  return (
    <div className="mt-8 flex flex-col gap-4 rounded-xl border border-bitcoin/40 bg-bitcoin/5 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bitcoin">
          <Radio className="h-3.5 w-3.5" aria-hidden="true" />
          {live ? 'Happening now' : 'Next on the shelf'}
        </div>
        <h3 className="mt-2 text-xl font-semibold">{event.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatEventDate(event.date)} · {event.location} · {program?.name ?? group.shortName}
        </p>
      </div>
      <button type="button" onClick={() => downloadEventIcs(event)} className={cn(icsButton, 'shrink-0 px-3 py-2 text-xs')}>
        <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        Add to calendar
      </button>
    </div>
  );
}

function YearBook({
  year,
  shelves,
  eventCount,
  now,
}: {
  year: number;
  shelves: EventShelf[];
  eventCount: number;
  now: Date | null;
}) {
  return (
    <section aria-labelledby={`shelf-${year}`}>
      <div className="flex items-baseline gap-3">
        <h3 id={`shelf-${year}`} className="text-2xl font-bold tracking-tight sm:text-3xl">
          {year}
        </h3>
        <span className="text-sm text-muted-foreground">
          {eventCount} {eventCount === 1 ? 'event' : 'events'}
        </span>
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
      <div className="mt-6 space-y-8">
        {shelves.map((shelf) => (
          <MonthShelf key={shelf.key} shelf={shelf} now={now} />
        ))}
      </div>
    </section>
  );
}

function MonthShelf({ shelf, now }: { shelf: EventShelf; now: Date | null }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[2.5rem_1fr] sm:gap-5">
      <div className="flex sm:justify-center">
        <span
          className="select-none rounded-sm border border-bitcoin/30 bg-bitcoin/10 px-1 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-bitcoin sm:py-3"
          style={{ writingMode: 'vertical-rl' }}
        >
          {shelf.spine}
        </span>
      </div>
      <div className="min-w-0">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:hidden">
          {shelf.label}
        </h4>
        <div className="grid gap-3 border-b-2 border-dashed border-border/70 pb-5 sm:grid-cols-2 lg:grid-cols-3">
          {shelf.events.map((event) => (
            <ShelfEvent key={event.id} event={event} now={now} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ShelfEvent({ event, now }: { event: EventItem; now: Date | null }) {
  const program = getProgram(event.programId);
  const group = getWalletGroup(program?.walletGroupId ?? 'flagship');
  const GroupIcon = group.icon;
  const meta = now ? STATUS_META[getEventStatus(event, now)] : null;

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col rounded-lg border border-border/70 bg-background/60 p-4 pl-5 transition-colors',
        meta?.card
      )}
    >
      <span
        className="absolute inset-y-3 left-0 w-1 rounded-r bg-bitcoin/40 transition-colors group-hover:bg-bitcoin"
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <GroupIcon className="h-3.5 w-3.5 shrink-0 text-bitcoin" aria-hidden="true" />
          {group.shortName}
        </span>
        {meta ? (
          <span className={cn('shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium', meta.chip)}>
            {meta.label}
          </span>
        ) : null}
      </div>
      <h5 className="mt-3 text-sm font-semibold leading-snug">{event.title}</h5>
      <p className="mt-1 text-xs text-muted-foreground">
        {formatEventDate(event.date)}
        {event.endDate ? ` – ${formatEventDate(event.endDate)}` : ''}
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">{event.location}</span>
      </p>
      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
        <span className="truncate text-[11px] text-muted-foreground">{program?.name ?? event.category}</span>
        <button
          type="button"
          onClick={() => downloadEventIcs(event)}
          className={icsButton}
          aria-label={`Add ${event.title} to calendar`}
        >
          <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" />
          .ics
        </button>
      </div>
    </article>
  );
}
