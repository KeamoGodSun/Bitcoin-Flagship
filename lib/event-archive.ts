import type { EventItem } from './data';
import { parseEventDate } from './ics';

export type EventStatus = 'past' | 'today' | 'upcoming';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function sortByDate(events: EventItem[]): EventItem[] {
  return [...events].sort(
    (a, b) => parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime() || a.title.localeCompare(b.title)
  );
}

/** Status is always measured against a caller-supplied `now` so it can be resolved on the client. */
export function getEventStatus(event: EventItem, now: Date): EventStatus {
  const today = startOfDay(now).getTime();
  const start = startOfDay(parseEventDate(event.date)).getTime();
  if (today < start) return 'upcoming';

  const end = startOfDay(parseEventDate(event.endDate ?? event.date)).getTime();
  if (today > end) return 'past';

  return 'today';
}

export interface EventStatusCounts {
  past: number;
  today: number;
  upcoming: number;
}

export function countEventStatuses(events: EventItem[], now: Date): EventStatusCounts {
  return events.reduce<EventStatusCounts>(
    (counts, event) => {
      counts[getEventStatus(event, now)] += 1;
      return counts;
    },
    { past: 0, today: 0, upcoming: 0 }
  );
}

export function getNextEvent(events: EventItem[], now: Date): EventItem | undefined {
  return sortByDate(events.filter((event) => getEventStatus(event, now) !== 'past'))[0];
}

export interface EventShelf {
  /** Sortable key, e.g. "2026-10". */
  key: string;
  year: number;
  /** Zero-based month index, matching Date#getMonth. */
  month: number;
  /** e.g. "October 2026". */
  label: string;
  /** Vertical spine label, e.g. "OCT 2026". */
  spine: string;
  events: EventItem[];
}

export interface EventBook {
  year: number;
  shelves: EventShelf[];
  eventCount: number;
}

/**
 * Files every event onto month shelves grouped into year "books".
 * Newest year first; months run oldest to newest inside a year so past
 * events sit at the top of the shelf and future events fill in below.
 */
export function buildEventBookshelf(events: EventItem[]): EventBook[] {
  const shelves = new Map<number, Map<number, EventItem[]>>();

  for (const event of sortByDate(events)) {
    const date = parseEventDate(event.date);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (!shelves.has(year)) shelves.set(year, new Map());
    const months = shelves.get(year)!;
    if (!months.has(month)) months.set(month, []);
    months.get(month)!.push(event);
  }

  return Array.from(shelves.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, months]) => {
      const bookShelves = Array.from(months.entries())
        .sort((a, b) => a[0] - b[0])
        .map<EventShelf>(([month, monthEvents]) => ({
          key: `${year}-${String(month + 1).padStart(2, '0')}`,
          year,
          month,
          label: `${MONTH_NAMES[month]} ${year}`,
          spine: `${MONTH_SHORT[month]} ${year}`,
          events: monthEvents,
        }));

      return {
        year,
        shelves: bookShelves,
        eventCount: bookShelves.reduce((total, shelf) => total + shelf.events.length, 0),
      };
    });
}
