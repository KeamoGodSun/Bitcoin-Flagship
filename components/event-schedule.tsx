'use client';

import { useMemo, useState } from 'react';
import { CalendarPlus, ChevronLeft, ChevronRight, MapPin, Zap } from 'lucide-react';
import { events, eventCategories } from '@/lib/data';
import { downloadEventIcs, parseEventDate, toDayKey, formatEventDate } from '@/lib/ics';
import { useWallet } from '@/components/wallet-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getProgram, programs } from '@/lib/programs';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function monthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function EventSchedule() {
  const { openWallet } = useWallet();
  const today = useMemo(() => new Date(), []);

  const sorted = useMemo(
    () =>
      [...events]
        .map((event) => ({ event, date: parseEventDate(event.date) }))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    []
  );

  const nextEvent = sorted.find((entry) => entry.date >= new Date(today.getFullYear(), today.getMonth(), today.getDate()));

  const [month, setMonth] = useState<Date>(() => startOfMonth(nextEvent ? nextEvent.date : today));
  const [selectedDay, setSelectedDay] = useState<string>(() => toDayKey(nextEvent ? nextEvent.date : today));
  const [programFilter, setProgramFilter] = useState<string>('all');

  const visible = useMemo(
    () => (programFilter === 'all' ? sorted : sorted.filter((entry) => entry.event.programId === programFilter)),
    [sorted, programFilter]
  );

  const usedPrograms = useMemo(() => {
    const ids = new Set(sorted.map((entry) => entry.event.programId));
    return programs.filter((p) => ids.has(p.id));
  }, [sorted]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, typeof events>();
    for (const { event, date } of visible) {
      const key = toDayKey(date);
      map.set(key, [...(map.get(key) ?? []), event]);
    }
    return map;
  }, [visible]);

  const cells = useMemo(() => {
    const first = startOfMonth(month);
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
    const gridStart = new Date(first.getFullYear(), first.getMonth(), 1 - offset);

    const list: { key: string; day: number; inMonth: boolean }[] = [];
    for (let i = 0; i < totalCells; i += 1) {
      const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      list.push({
        key: toDayKey(date),
        day: date.getDate(),
        inMonth: date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear(),
      });
    }
    return list;
  }, [month]);

  const todayKey = toDayKey(today);
  const monthEventCount = cells.filter((cell) => cell.inMonth && eventsByDay.has(cell.key)).length;
  const selectedEvents = eventsByDay.get(selectedDay) ?? [];

  const groupedByMonth = useMemo(() => {
    const groups: { key: string; label: string; items: typeof visible }[] = [];
    for (const entry of visible) {
      const key = `${entry.date.getFullYear()}-${entry.date.getMonth()}`;
      const last = groups[groups.length - 1];
      if (last && last.key === key) {
        last.items.push(entry);
      } else {
        groups.push({ key, label: monthLabel(entry.date), items: [entry] });
      }
    }
    return groups;
  }, [visible]);

  return (
    <div className="space-y-12">
      {/* Program filter */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setProgramFilter('all')}
          className={cn(
            'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
            programFilter === 'all'
              ? 'border-bitcoin bg-bitcoin/15 text-bitcoin'
              : 'border-border text-muted-foreground hover:border-bitcoin/40 hover:text-foreground'
          )}
        >
          All programs
        </button>
        {usedPrograms.map((program) => (
          <button
            key={program.id}
            onClick={() => setProgramFilter(program.id)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
              programFilter === program.id
                ? 'border-bitcoin bg-bitcoin/15 text-bitcoin'
                : 'border-border text-muted-foreground hover:border-bitcoin/40 hover:text-foreground'
            )}
          >
            {program.name}
          </button>
        ))}
      </div>

      {/* Calendar */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">{monthLabel(month)}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {monthEventCount === 0
                ? 'No events this month'
                : `${monthEventCount} event${monthEventCount === 1 ? '' : 's'} this month`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setMonth(startOfMonth(today))}>
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous month"
              onClick={() => setMonth((current) => addMonths(current, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next month"
              onClick={() => setMonth((current) => addMonths(current, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((cell) => {
            const dayEvents = eventsByDay.get(cell.key) ?? [];
            const isToday = cell.key === todayKey;
            const isSelected = cell.key === selectedDay;
            return (
              <button
                key={cell.key}
                onClick={() => setSelectedDay(cell.key)}
                className={cn(
                  'relative flex h-12 flex-col items-center justify-center rounded-lg border text-sm transition-colors sm:h-14',
                  cell.inMonth ? 'text-foreground' : 'text-muted-foreground/40',
                  dayEvents.length > 0 && 'hover:border-bitcoin/60',
                  isSelected
                    ? 'border-bitcoin bg-bitcoin/15 text-bitcoin'
                    : isToday
                      ? 'border-bitcoin/50 text-bitcoin'
                      : 'border-transparent hover:border-border'
                )}
              >
                <span className={cn('font-medium', isToday && 'underline underline-offset-4')}>{cell.day}</span>
                {dayEvents.length > 0 && (
                  <span className="mt-1 flex gap-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <span
                        key={event.id}
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          isSelected ? 'bg-bitcoin' : 'bg-bitcoin/70'
                        )}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day detail */}
        <div className="mt-6 border-t border-border/60 pt-4">
          <p className="text-sm font-medium">
            {parseEventDate(selectedDay).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          {selectedEvents.length === 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">Nothing scheduled for this day.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {selectedEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{event.title}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-bitcoin" />
                        {event.location}
                      </span>
                      <span className="text-bitcoin">{getProgram(event.programId)?.name}</span>
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => downloadEventIcs(event)} className="gap-1.5">
                    <CalendarPlus className="h-3.5 w-3.5" /> Add
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Project Timeline</h2>
          <p className="mt-3 text-muted-foreground">
            Every meetup, program, and campaign on one timeline.
          </p>
        </div>

        <div className="space-y-10">
          {groupedByMonth.map((group) => (
            <div key={group.key}>
              <div className="mb-4 flex items-center gap-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-bitcoin">{group.label}</h3>
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">
                  {group.items.length} event{group.items.length === 1 ? '' : 's'}
                </span>
              </div>

              <ol className="relative space-y-4 border-l border-border/60 pl-6">
                {group.items.map(({ event, date }) => {
                  const cat = eventCategories.find((c) => c.id === event.category);
                  const program = getProgram(event.programId);
                  const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                  return (
                    <li key={event.id} className="relative">
                      <span
                        className={cn(
                          'absolute -left-[31px] top-5 h-3 w-3 rounded-full ring-4 ring-background',
                          isPast ? 'bg-muted-foreground/40' : 'bg-bitcoin'
                        )}
                      />
                      <div className="rounded-xl border border-border bg-card p-5 transition-all hover:border-bitcoin/50">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-lg bg-bitcoin/10 px-2.5 py-1 text-xs font-bold text-bitcoin">
                            {formatEventDate(date, { month: 'short', day: 'numeric' })}
                          </span>
                          {cat && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                              <cat.icon className="h-3.5 w-3.5 text-bitcoin" />
                              {cat.label}
                            </span>
                          )}
                          {program && (
                            <span className="rounded-full border border-bitcoin/30 px-2 py-0.5 text-[11px] font-medium text-bitcoin">
                              {program.name}
                            </span>
                          )}
                          {isPast && <span className="text-xs text-muted-foreground">Completed</span>}
                        </div>

                        <h4 className="mt-3 text-lg font-semibold">{event.title}</h4>
                        <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 text-bitcoin" />
                          {event.location}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {program && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5"
                              onClick={() => openWallet(program.walletGroupId, program.id)}
                            >
                              <Zap className="h-3.5 w-3.5 text-bitcoin" /> Support this event
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-muted-foreground"
                            onClick={() => downloadEventIcs(event)}
                          >
                            <CalendarPlus className="h-3.5 w-3.5" /> Add to calendar
                          </Button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}