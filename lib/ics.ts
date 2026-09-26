import type { EventItem } from '@/lib/data';

/**
 * Parses an event date without timezone surprises: 'YYYY-MM-DD' is built as a
 * local date, so it can never shift a day in negative UTC offsets. Falls back to
 * `new Date(value)` for any legacy free-text format.
 */
export function parseEventDate(date: string): Date {
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(date.trim());
  if (iso) {
    return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  }
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function formatEventDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
): string {
  return parseEventDate(String(date)).toLocaleDateString('en-US', options);
}

export function toDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function eventSlug(event: EventItem): string {
  return event.id || event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function icsDate(date: Date): string {
  return toDayKey(date).replace(/-/g, '');
}

function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export function buildEventIcs(event: EventItem): string {
  const start = parseEventDate(event.date);
  const end = event.endDate ? parseEventDate(event.endDate) : new Date(start.getTime() + 86400000);
  const endExclusive = new Date(end.getTime() + 86400000);

  const stamp = `${icsDate(new Date())}T000000Z`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bitcoin Flagship//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${eventSlug(event)}@bitcoinflagship.org`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${icsDate(start)}`,
    `DTEND;VALUE=DATE:${icsDate(endExclusive)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    `LOCATION:${escapeIcs(event.location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return `${lines.join('\r\n')}\r\n`;
}

export function downloadEventIcs(event: EventItem): void {
  const blob = new Blob([buildEventIcs(event)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${eventSlug(event)}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
