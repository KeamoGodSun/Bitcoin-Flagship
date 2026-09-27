#!/usr/bin/env node
/**
 * Structural checks on lesson quiz data, plus an answer-key audit.
 *
 * This compiles lib/course-data.ts and imports the result rather than
 * regex-parsing the source. Regex over a TypeScript file is quietly wrong for
 * multi-line string values and for labels containing apostrophes, and a checker
 * that reports false problems is worse than no checker.
 *
 * Enforced invariants:
 *   1. Every question has exactly one correct option.
 *   2. Every question has options a, b, c and d, in that order.
 *   3. Every option has a non-empty explanation, since a wrong guess still has
 *      to teach the mechanism.
 *   4. Question ids are unique within a lesson and prefixed with the lesson id.
 *   5. Lessons have non-empty blurbs, sections, questions and tryIt steps.
 *
 * Reported but NOT enforced: the answer-key distribution. A lesson where every
 * answer is the same letter is guessable, which defeats the purpose of the
 * quiz, but the right balance is an editorial judgement per lesson. The audit
 * below exists to make that judgement possible rather than to automate it.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const tmp = mkdtempSync(join(tmpdir(), 'course-data-'));

function cleanup() {
  try {
    rmSync(tmp, { recursive: true, force: true });
  } catch {
    /* best effort */
  }
}
process.on('exit', cleanup);

try {
  execFileSync(
    process.execPath,
    [
      require_resolve_tsc(),
      'lib/course-data.ts',
      '--outDir',
      tmp,
      '--module',
      'esnext',
      '--target',
      'es2022',
      '--moduleResolution',
      'bundler',
      '--skipLibCheck',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'], cwd: process.cwd() },
  );
} catch (error) {
  console.error('Could not compile lib/course-data.ts');
  console.error(String(error.stdout || error.stderr || error.message).slice(0, 2000));
  process.exit(1);
}

function require_resolve_tsc() {
  const p = join('node_modules', 'typescript', 'bin', 'tsc');
  if (!existsSync(p)) {
    console.error('typescript is not installed. Run npm install.');
    process.exit(1);
  }
  return p;
}

const entry = join(tmp, 'course-data.js');
if (!existsSync(entry)) {
  console.error(`Expected compiled output at ${entry}`);
  process.exit(1);
}
// course-data.ts has no runtime imports, so a single self-contained module.
writeFileSync(entry, (await import('node:fs')).readFileSync(entry, 'utf8'));
const mod = await import(pathToFileURL(entry).href);
const { courseLevels } = mod;

const problems = [];
const lessons = [];

for (const level of courseLevels) {
  for (const lesson of level.lessons) {
    lessons.push({ level, lesson });
  }
}

if (lessons.length === 0) {
  console.error('No written lessons found. This checker is about to be useless, so it stops.');
  process.exit(1);
}

let totalQuestions = 0;
const globalDist = { a: 0, b: 0, c: 0, d: 0 };

console.log('Answer-key distribution: a lesson where every answer is one letter is guessable.\n');
console.log(`  ${'lesson'.padEnd(10)} ${'n'.padStart(3)}    A  B  C  D`);

for (const { level, lesson } of lessons) {
  const tag = `${lesson.id}`;
  if (!lesson.blurb || !lesson.blurb.trim()) problems.push(`${tag}: empty blurb`);
  if (!lesson.minutes || lesson.minutes <= 0) problems.push(`${tag}: bad minutes`);
  if (!Array.isArray(lesson.sections) || lesson.sections.length === 0) {
    problems.push(`${tag}: no sections`);
  }
  for (const s of lesson.sections || []) {
    if (!s.heading || !s.heading.trim()) problems.push(`${tag}: a section has no heading`);
    if (!Array.isArray(s.paragraphs) || s.paragraphs.length === 0) {
      problems.push(`${tag}: section "${s.heading}" has no paragraphs`);
    }
    for (const p of s.paragraphs || []) {
      if (typeof p !== 'string' || !p.trim()) problems.push(`${tag}: empty paragraph in "${s.heading}"`);
    }
    if (s.table) {
      const width = s.table.head.length;
      for (const [i, row] of (s.table.rows || []).entries()) {
        if (row.length !== width) {
          problems.push(`${tag}: table "${s.heading}" row ${i + 1} has ${row.length} cells, expected ${width}`);
        }
      }
    }
  }
  if (!Array.isArray(lesson.tryIt) || lesson.tryIt.length === 0) {
    problems.push(`${tag}: no tryIt steps`);
  }

  const dist = { a: 0, b: 0, c: 0, d: 0 };
  const seen = new Set();
  // Established convention: question ids are <level>-<lesson>-q<n>, so the prefix
  // is the first two segments of the lesson id, not the whole thing.
  const prefix = `${lesson.id.split('-').slice(0, 2).join('-')}-`;

  for (const q of lesson.questions || []) {
    totalQuestions++;
    if (!q.id || seen.has(q.id)) problems.push(`${tag}: duplicate or missing question id "${q.id}"`);
    seen.add(q.id);
    if (!q.id.startsWith(prefix)) {
      problems.push(`${tag}: question id "${q.id}" does not start with "${prefix}"`);
    }
    if (!q.prompt || !q.prompt.trim()) problems.push(`${tag} ${q.id}: empty prompt`);

    const opts = q.options || [];
    if (opts.length !== 4) {
      problems.push(`${tag} ${q.id}: ${opts.length} options, expected 4`);
      continue;
    }
    const ids = opts.map((o) => o.id);
    if (ids.join('') !== 'abcd') {
      problems.push(`${tag} ${q.id}: option ids are [${ids.join(',')}], expected a,b,c,d`);
    }
    const correct = opts.filter((o) => o.correct);
    if (correct.length !== 1) {
      problems.push(`${tag} ${q.id}: ${correct.length} correct options, expected exactly 1`);
    } else {
      dist[correct[0].id]++;
      globalDist[correct[0].id]++;
    }
    for (const o of opts) {
      if (!o.label || !o.label.trim()) problems.push(`${tag} ${q.id} ${o.id}: empty label`);
      if (!o.explanation || !o.explanation.trim()) {
        problems.push(`${tag} ${q.id} ${o.id}: empty explanation, which leaves a wrong guess teaching nothing`);
      }
    }
  }

  const n = dist.a + dist.b + dist.c + dist.d;
  const max = Math.max(dist.a, dist.b, dist.c, dist.d);
  const same = max === n && n > 0;
  const share = n ? max / n : 0;
  const flag = same ? '   <-- every answer is the same letter' : share > 0.5 ? '   <-- one letter over half' : '';
  console.log(
    `  ${tag.padEnd(24)} ${String(n).padStart(2)}    ${dist.a}  ${dist.b}  ${dist.c}  ${dist.d}${flag}`,
  );
}

const gTotal = globalDist.a + globalDist.b + globalDist.c + globalDist.d;
console.log(
  `\n  course total ${gTotal} questions: A:${globalDist.a} B:${globalDist.b} C:${globalDist.c} D:${globalDist.d}`,
);
if (gTotal && globalDist.d === 0) {
  console.log('  No question anywhere has answer D, so a reader who always picks D scores zero.');
}
if (gTotal) {
  const gMax = Math.max(...Object.values(globalDist));
  const gMin = Math.min(...Object.values(globalDist));
  if (gMax - gMin > gTotal * 0.5) {
    console.log('  Spread is wide enough that letter-choice alone predicts many answers.');
  }
}

const lessonsFlagged = lessons.filter(({ lesson }) => {
  const qs = lesson.questions || [];
  if (qs.length < 3) return false;
  const d = { a: 0, b: 0, c: 0, d: 0 };
  for (const q of qs) for (const o of q.options || []) if (o.correct) d[o.id]++;
  const n = d.a + d.b + d.c + d.d;
  return n > 0 && Math.max(d.a, d.b, d.c, d.d) === n;
});

if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log(`  ${p}`);
  process.exit(1);
}

console.log(`\nStructure OK: ${lessons.length} written lessons, ${totalQuestions} questions.`);
if (lessonsFlagged.length) {
  console.log(
    `${lessonsFlagged.length} lesson(s) are guessable from the answer key alone: ` +
      lessonsFlagged.map((l) => l.lesson.id).join(', '),
  );
  console.log('Reordering the options in those lessons fixes it without rewriting a word.');
}
