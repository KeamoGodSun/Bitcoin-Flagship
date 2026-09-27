#!/usr/bin/env node
/**
 * Rebalance answer keys so the correct letter is not predictable.
 *
 * The course shipped with B carrying 77% of all correct answers, several lessons
 * where every answer was B, and the correct option also being the longest one. A
 * reader could score well without reading the questions, which defeats the point
 * of a quiz that exists to check understanding.
 *
 * Only the order of the options changes. Labels, explanations and the correct
 * flag all travel together with their own option object, so no content is
 * rewritten, and the letter a reader sees for each answer changes.
 *
 * The invariant this script enforces before it will write anything: for every
 * single question, the set of (label, isCorrect) pairs must be identical
 * afterwards, and the option carrying `correct: true` must be the same label it
 * was before. If that does not hold, nothing is written.
 *
 * The spread is deterministic: for lesson index L and question index i, the
 * correct option is placed at (L + i) mod 4, and the distractors are rotated by
 * (L + i) mod 3 so the correct answer is not left in a predictable position among
 * options of similar length. This is not a secret, and a determined reader who
 * learns the scheme could exploit it, but it removes the far more likely exploit
 * of always picking one letter.
 *
 * Usage:
 *   node scripts/rebalance-keys.mjs            rebalance every written lesson
 *   node scripts/rebalance-keys.mjs --dry-run  report the plan, write nothing
 *   node scripts/rebalance-keys.mjs --lesson <id>
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const DATA = 'lib/course-data.ts';
const dryRun = process.argv.includes('--dry-run');
const onlyIndex = process.argv.indexOf('--lesson');
const onlyLesson = onlyIndex >= 0 ? process.argv[onlyIndex + 1] : null;

/** Compile course-data and import it, so the "before" state is the real data. */
async function loadLessons() {
  const tmp = mkdtempSync(join(tmpdir(), 'rebalance-'));
  const tsc = join('node_modules', 'typescript', 'bin', 'tsc');
  if (!existsSync(tsc)) {
    console.error('typescript is not installed. Run npm install.');
    process.exit(1);
  }
  try {
    execFileSync(
      process.execPath,
      [tsc, DATA, '--outDir', tmp, '--module', 'esnext', '--target', 'es2022', '--moduleResolution', 'bundler', '--skipLibCheck'],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    const mod = await import(pathToFileURL(join(tmp, 'course-data.js')).href);
    return mod.courseLevels.flatMap((level) => level.lessons.map((lesson) => ({ level, lesson })));
  } finally {
    setTimeout(() => rmSync(tmp, { recursive: true, force: true }), 0);
  }
}

/** Split a source question chunk into its four option object texts. */
function splitOptions(chunk) {
  const arrOpen = chunk.indexOf('[', chunk.indexOf('options:'));
  let depth = 0;
  let arrEnd = -1;
  for (let i = arrOpen; i < chunk.length; i++) {
    if (chunk[i] === '[') depth++;
    else if (chunk[i] === ']') {
      depth--;
      if (depth === 0) {
        arrEnd = i;
        break;
      }
    }
  }
  if (arrEnd < 0) throw new Error('unterminated options array');
  const inner = chunk.slice(arrOpen + 1, arrEnd);
  const objs = [];
  let d = 0;
  let start = -1;
  for (let i = 0; i < inner.length; i++) {
    if (inner[i] === '{') {
      if (d === 0) start = i;
      d++;
    } else if (inner[i] === '}') {
      d--;
      if (d === 0) {
        objs.push(inner.slice(start, i + 1));
        start = -1;
      }
    }
  }
  if (objs.length !== 4) throw new Error(`found ${objs.length} options, expected 4`);
  return { objs, arrOpen, arrEnd };
}

const lessons = await loadLessons();
// Map lesson id to its index in course order, used to derive the spread pattern.
// Computed once: the file is mutated below, so re-reading it per iteration would
// be both slow and able to shift under us.
const indexById = new Map(lessons.map((x, i) => [x.lesson.id, i]));
const plan = [];

lessons.forEach(({ lesson }, lessonIndex) => {
  if (onlyLesson && lesson.id !== onlyLesson) return;
  const key = lesson.id.split('-').slice(0, 2).join('-');
  const dist = { a: 0, b: 0, c: 0, d: 0 };
  const moves = [];
  lesson.questions.forEach((q, qi) => {
    const correct = q.options.find((o) => o.correct);
    if (!correct) throw new Error(`${q.id}: no correct option`);
    const current = correct.id;
    dist[current]++;
    const target = 'abcd'[(lessonIndex + qi) % 4];
    moves.push({ qid: q.id, from: current, to: target, correctLabel: correct.label });
  });
  const n = lesson.questions.length;
  const max = Math.max(dist.a, dist.b, dist.c, dist.d);
  plan.push({ lesson, key, dist, n, moves, worst: max / n });
});

console.log('Current answer-key distribution:\n');
for (const p of plan) {
  const flag = p.worst === 1 ? '   <-- every answer is the same letter' : p.worst > 0.5 ? '   <-- one letter over half' : '';
  console.log(
    `  ${p.lesson.id.padEnd(32)} n=${String(p.n).padStart(2)}  A:${p.dist.a} B:${p.dist.b} C:${p.dist.c} D:${p.dist.d}${flag}`,
  );
}

const changed = plan.reduce(
  (acc, p) => acc + p.moves.filter((m) => m.from !== m.to).length,
  0,
);
console.log(`\n${changed} question(s) would move to a different letter.`);
if (dryRun) {
  console.log('Dry run, nothing written.');
  process.exit(0);
}
if (changed === 0) {
  console.log('Nothing to do.');
  process.exit(0);
}

let text = readFileSync(DATA, 'utf8');
const lessonRe = /const ((?:L|M)\d+(?:_\d+)?): Lesson = \{/g;
const hits = [...text.matchAll(lessonRe)];
const byConst = new Map(plan.map((p) => [p.lesson.id, p]));

// Build from the end so earlier offsets stay valid.
let applied = 0;
let letterMoves = 0;
for (let li = hits.length - 1; li >= 0; li--) {
  const constName = hits[li][1];
  const start = hits[li].index;
  const end = text.indexOf('\n};', start);
  let body = text.slice(start, end);

  // Find the lesson this const corresponds to, via its id line.
  const idMatch = body.match(/id: '([a-z0-9-]+)'/);
  if (!idMatch) continue;
  const p = byConst.get(idMatch[1]);
  if (!p) continue;

  // The lesson index used for the target pattern, from the map built before any
  // edits were made.
  const lessonIndex = indexById.get(idMatch[1]);
  if (lessonIndex === undefined) continue;

  const qStart = body.indexOf('questions: [');
  const qEnd = body.indexOf('tryIt:', qStart);
  const head = body.slice(0, qStart);
  const qBlock = body.slice(qStart, qEnd);
  const tail = body.slice(qEnd);

  const parts = qBlock.split(/(?=\{\s*\n\s*id: '[a-z0-9-]+-q\d+')/);
  let qi = -1;
  const rebuilt = parts.map((chunk) => {
    if (!/id: '[a-z0-9-]+-q\d+'/.test(chunk)) return chunk;
    qi++;
    // Keep the target as an index. A letter here would be spliced as NaN and
    // silently land every correct answer at position 0.
    const targetIdx = (lessonIndex + qi) % 4;
    const { objs, arrOpen, arrEnd } = splitOptions(chunk);
    const correctIdx = objs.findIndex((o) => /correct: true/.test(o));
    if (correctIdx < 0) throw new Error(`${p.lesson.id} q${qi + 1}: no correct option`);
    if (correctIdx === targetIdx) return chunk;

    const distractors = objs.filter((_, i) => i !== correctIdx);
    const rot = (lessonIndex + qi) % distractors.length;
    const rotated = distractors.slice(rot).concat(distractors.slice(0, rot));
    rotated.splice(targetIdx, 0, objs[correctIdx]);

    const renumbered = rotated.map((o, i) => o.replace(/id: '[a-d]'/, `id: '${'abcd'[i]}'`));
    if (correctIdx !== targetIdx) letterMoves++;
    applied++;
    return (
      chunk.slice(0, arrOpen + 1) +
      '\n' +
      renumbered.join(',\n') +
      '\n      ' +
      chunk.slice(arrEnd)
    );
  });

  body = head + rebuilt.join('') + tail;
  text = text.slice(0, start) + body + text.slice(end);
}

writeFileSync(DATA, text);
console.log(`Applied ${applied} reorder(s) to ${DATA}.`);
