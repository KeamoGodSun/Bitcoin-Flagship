import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const COURSE_DATA = join(root, 'lib', 'course-data.ts');
const CLAIMS_FILE = join(root, 'docs', 'course-claims.json');

const OFFLINE = process.argv.includes('--offline');
const TIMEOUT_MS = 30000;
const CONCURRENCY = 4;
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

let failures = 0;
let warnings = 0;

function report(ok, label, detail = '') {
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? ` - ${detail}` : ''}`);
}

function warn(label, detail = '') {
  warnings += 1;
  console.log(`WARN  ${label}${detail ? ` - ${detail}` : ''}`);
}

function manual(label, figure, reason) {
  console.log(`MANUAL  ${label} - ${figure} not auto-checked: ${reason}`);
}

function skip(label, detail = '') {
  console.log(`SKIP  ${label}${detail ? ` - ${detail}` : ''}`);
}

function section(title) {
  console.log('');
  console.log(title);
  console.log('-'.repeat(title.length));
}

function loadLessons() {
  const raw = readFileSync(COURSE_DATA, 'utf8');
  const pattern = /const\s+([A-Za-z0-9_]+)\s*:\s*Lesson\s*=\s*\{/g;
  const starts = [];
  let match;
  while ((match = pattern.exec(raw)) !== null) {
    starts.push({ name: match[1], index: match.index });
  }
  return starts.map((entry, i) => {
    const end = i + 1 < starts.length ? starts[i + 1].index : raw.length;
    const block = raw.slice(entry.index, end);
    const id = (block.match(/\bid:\s*'([^']+)'/) ?? [])[1] ?? entry.name;
    const title = (block.match(/\btitle:\s*'((?:[^'\\]|\\.)*)'/) ?? [])[1] ?? '';
    const sources = [...block.matchAll(/\burl:\s*'((?:[^'\\]|\\.)*)'/g)].map((m) => ({
      url: m[1].replace(/\\(.)/g, '$1'),
    }));
    return { name: entry.name, id, title, block, sources };
  });
}

function extractStrings(block) {
  return [...block.matchAll(/'((?:[^'\\]|\\.)*)'/g)]
    .map((m) => m[1].replace(/\\(.)/g, '$1'))
    .join('\n');
}

function decodeEntities(text) {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#x27;|&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ');
}

const SKIP_NUMBER_PATTERNS = [
  /\b\d+\s*(?:minutes?|mins?)\b/gi,
  /\b\d+\s*(?:lessons?|questions?|levels?)\b/gi,
  /\b(?:level|lesson|m)\s*-?\d+(?:\.\d+)?\b/gi,
  /\b(?:1[6-9]|20)\d{2}s?\b/g,
  /\b\d+(?:\.\d+)?\s*(?:words?|screens?|variations?)\b/gi,
  /\bQ[1-5]\b/g,
  /\b[1-5][a-d]\b/g,
  /\bP-S\b/g,
  /\bBIP\d+\b/gi,
  /\b1[0-9]?\s*(?:in|of)\s*\d+\b/gi,
];

function scanFigures(text, ignore) {
  let scrubbed = text;
  for (const pattern of SKIP_NUMBER_PATTERNS) {
    scrubbed = scrubbed.replace(pattern, ' ');
  }
  const found = new Map();
  const pattern = /(?:[$£€]\s?)?\d[\d,]*\.?\d*\s?(?:bn|billion|million|trillion|k|%|percent|per cent)?/gi;
  for (const match of scrubbed.matchAll(pattern)) {
    // The pattern can swallow a trailing separator, as in "Levels 2 to 7, and",
    // which would otherwise dodge the short-number guard below.
    const token = match[0].trim().replace(/[.,;]+$/, '');
    if (token.length < 2) continue;
    if (/^\d{1,2}$/.test(token) && !/%/.test(token)) continue;
    if (ignore.includes(token)) continue;
    if (ignore.some((entry) => entry.includes(token))) continue;
    found.set(token, (found.get(token) ?? 0) + 1);
  }
  return [...found.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// A timeout, a dropped connection, a 5xx and a 429 are all the network rather
// than the page, and they move around between runs: four consecutive runs of
// this script failed a different handful of URLs each time, including pages
// that return 200 when fetched on their own. A 404 is the opposite, and a 403
// is a bot block that asking again will not fix, so neither is retried.
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504, 522, 524]);
const MAX_ATTEMPTS = 3;
const RETRY_BASE_MS = 1500;
// One cited figure is an 8 MB PDF on a slow link, which needs longer than the
// first attempt allows once four fetches are competing. A dead host still fails
// on attempt one, so the longer budget only applies to URLs already in trouble.
const RETRY_TIMEOUT_MS = 60000;

async function fetchOnce(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml,*/*' },
    });
    const status = response.status;
    if (!response.ok) {
      return { status, ok: false, text: '', blocked: status === 403 || status === 429 || status === 401 };
    }
    const body = await response.text();
    return { status, ok: true, text: decodeEntities(body), blocked: false };
  } catch (error) {
    const aborted = error?.name === 'AbortError';
    return { status: aborted ? 'timeout' : 'error', ok: false, text: '', blocked: false, error: error?.message };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url) {
  for (let attempt = 1; ; attempt++) {
    const result = await fetchOnce(url, attempt === 1 ? TIMEOUT_MS : RETRY_TIMEOUT_MS);
    const transient =
      result.status === 'timeout' || result.status === 'error' || RETRYABLE_STATUS.has(result.status);
    if (!transient || attempt >= MAX_ATTEMPTS) return { ...result, attempts: attempt };
    await sleep(RETRY_BASE_MS * 2 ** (attempt - 1) + Math.random() * 250);
  }
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

function daysBetween(from, to) {
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

async function main() {
  if (!existsSync(COURSE_DATA)) {
    console.log(`Cannot find ${COURSE_DATA}. Run this from the project root.`);
    process.exit(1);
  }

  const lessons = loadLessons();
  const register = existsSync(CLAIMS_FILE)
    ? JSON.parse(readFileSync(CLAIMS_FILE, 'utf8'))
    : { claims: [], ignore: [] };
  const claims = register.claims ?? [];
  const ignore = register.ignore ?? [];

  console.log(`Course data  : ${lessons.length} lessons`);
  console.log(`Claim register: ${claims.length} tracked figures`);
  if (OFFLINE) console.log('Mode         : offline (no network requests)');

  const allSources = [];
  for (const lesson of lessons) {
    for (const source of lesson.sources) {
      allSources.push({ ...source, lesson: lesson.id });
    }
  }

  section(`Source links (${allSources.length} cited)`);

  const fetched = new Map();
  if (!OFFLINE) {
    await mapLimit(allSources, CONCURRENCY, async (source) => {
      const result = await fetchText(source.url);
      fetched.set(source.url, result);
    });
  }

  for (const source of allSources) {
    if (OFFLINE) {
      skip(`${source.lesson} ${truncate(source.url)}`);
      continue;
    }
    const result = fetched.get(source.url);
    const retried = (result.attempts ?? 1) > 1 ? ` (took ${result.attempts} attempts)` : '';
    if (result.ok) {
      report(true, `${source.lesson} ${truncate(source.url)}`, `HTTP ${result.status}${retried}`);
    } else if (result.blocked) {
      warn(
        `${source.lesson} ${truncate(source.url)}`,
        `HTTP ${result.status} bot-blocked, check by hand${retried}`
      );
    } else {
      report(false, `${source.lesson} ${truncate(source.url)}`, `HTTP ${result.status}${retried}`);
    }
  }

  section('Claim coverage');

  const citedByLesson = new Map(lessons.map((lesson) => [lesson.id, lesson.sources.map((s) => s.url)]));

  for (const claim of claims) {
    const cited = citedByLesson.get(claim.lesson) ?? [];
    if (!cited.includes(claim.source)) {
      report(
        false,
        `${claim.id}`,
        `source is not cited by ${claim.lesson}, so a reader cannot check it`
      );
    }
  }

  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  for (const claim of claims) {
    if (!lessonIds.has(claim.lesson)) {
      report(false, `${claim.id}`, `unknown lesson ${claim.lesson}`);
    }
  }

  const claimNeedles = new Set(claims.flatMap((claim) => claim.needles ?? []));
  const orphanedNeedles = [...claimNeedles].filter(
    (needle) => !allSources.some((source) => source.url === (claims.find((c) => (c.needles ?? []).includes(needle))?.source ?? ''))
  );
  if (orphanedNeedles.length > 0) {
    warn('needles not attached to a known source', orphanedNeedles.join(', '));
  }

  report(
    claims.every((claim) => citedByLesson.get(claim.lesson)?.includes(claim.source)),
    'every tracked figure points at a source its own lesson cites'
  );

  section(`Figure verification (${claims.length} tracked)`);

  for (const claim of claims) {
    if (OFFLINE) {
      skip(`${claim.id}`, claim.figure);
      continue;
    }
    const result = fetched.get(claim.source);
    if (!result || !result.ok) {
      skip(`${claim.id}`, claim.figure);
      continue;
    }
    if (/\.pdf($|\?)/i.test(claim.source)) {
      skip(`${claim.id}`, claim.figure);
      continue;
    }
    // Some publishers serve HTTP 200 to bots but return a stub instead of the
    // article, so needle-matching would report a false failure. A claim marked
    // `manual` is tracked and surfaced, never silently dropped, and its reason
    // is printed so the next reviewer knows it still needs a human.
    if (claim.manual) {
      manual(`${claim.id}`, claim.figure, claim.manual);
      continue;
    }
    const missing = (claim.needles ?? []).filter((needle) => !result.text.includes(needle));
    if (missing.length === 0) {
      report(true, `${claim.id}`, `${claim.figure} found in source`);
    } else {
      report(false, `${claim.id}`, `${claim.figure} no longer in source, missing: ${missing.join(', ')}`);
    }
  }

  section('Staleness');

  const today = new Date();
  const defaultCadence = register.reviewCadenceDays ?? 90;
  for (const claim of claims) {
    const cadence = claim.cadence ?? defaultCadence;
    const age = daysBetween(new Date(claim.checked), today);
    if (age > cadence) {
      warn(`${claim.id}`, `checked ${age} day${age === 1 ? '' : 's'} ago, cadence ${cadence}`);
    }
  }
  const oldest = claims
    .map((claim) => ({ claim, age: daysBetween(new Date(claim.checked), today) }))
    .sort((a, b) => b.age - a.age)[0];
  if (oldest) {
    console.log(
      `Oldest tracked figure: ${oldest.claim.id} at ${oldest.age} day${oldest.age === 1 ? '' : 's'}.`
    );
  }

  section('Unregistered figures');

  for (const lesson of lessons) {
    const text = extractStrings(lesson.block);
    const figures = scanFigures(text, ignore);
    if (figures.length === 0) continue;
    const registered = claims
      .filter((claim) => claim.lesson === lesson.id)
      .flatMap((claim) => claim.needles ?? []);
    const isRegistered = (token) =>
      token.length >= 3 && registered.some((needle) => needle.includes(token));
    const unregistered = figures.filter(([token]) => !isRegistered(token));
    if (unregistered.length === 0) continue;
    console.log(`${lesson.id}: ${unregistered.length} number(s) with no claim registered`);
    for (const [token, count] of unregistered.slice(0, 12)) {
      console.log(`        ${token}${count > 1 ? ` (x${count})` : ''}`);
    }
    if (unregistered.length > 12) {
      console.log(`        ...and ${unregistered.length - 12} more`);
    }
    warnings += 1;
  }

  console.log('');
  console.log('This checks that a figure is still present in the source it cites.');
  console.log('It cannot tell you the source is right, that the framing is fair, or');
  console.log('that a conclusion still follows. Those need a human read.');
  console.log('');
  if (failures > 0) {
    console.log(`${failures} check(s) failed and ${warnings} warning(s).`);
    process.exit(1);
  }
  console.log(`All ${failures === 0 ? 'checks' : ''} passed with ${warnings} warning(s).`);
}

function truncate(url, max = 58) {
  return url.length > max ? `${url.slice(0, max - 1)}…` : url;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
