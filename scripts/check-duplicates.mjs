#!/usr/bin/env node
/**
 * Duplicate and near-duplicate wording checks on the course content.
 *
 * "Double wording" is worth checking for in a quiz specifically, because two
 * answers that say the same thing make the question unanswerable: the reader is
 * being asked to choose between two true statements, which teaches them nothing
 * and, if the duplicate is the distractor, is actively misleading. The same
 * defect appears at lesson scale as a paragraph that has been copy-pasted and
 * lightly edited, which is how an unverified claim tends to get restated as fact.
 *
 * Three checks, in descending order of how much they matter:
 *
 *   1. Near-duplicate options within one question. The severe case is two
 *      options where BOTH are correct, or where a distractor means the same as
 *      the answer. Flagged at a high similarity threshold so the wording differs
 *      in a way a reader would notice.
 *
 *   2. Identical option labels reused across different questions, which usually
 *      means a generic distractor has been copy-pasted so widely it stops
 *      teaching anything.
 *
 *   3. Repeated long phrases across lessons, which is how a sentence gets
 *      duplicated by accident during editing.
 *
 * Similarity is measured on normalised tokens with a bigram Jaccard score, which
 * ignores word order and small edits, so a real duplicate is caught even when it
 * has been reworded slightly.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const DATA = 'lib/course-data.ts';
const tmp = mkdtempSync(join(tmpdir(), 'dupes-'));

let courseLevels;
try {
  execFileSync(
    process.execPath,
    [
      join('node_modules', 'typescript', 'bin', 'tsc'),
      DATA, '--outDir', tmp, '--module', 'esnext', '--target', 'es2022',
      '--moduleResolution', 'bundler', '--skipLibCheck',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );
  ({ courseLevels } = await import(pathToFileURL(join(tmp, 'course-data.js')).href));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

const STOP = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'of', 'to', 'in', 'on', 'at', 'by',
  'for', 'with', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'it', 'its',
  'this', 'that', 'these', 'those', 'you', 'your', 'they', 'them', 'their', 'we',
  'i', 'he', 'she', 'his', 'her', 'not', 'no', 'do', 'does', 'did', 'so', 'than',
  'then', 'there', 'here', 'what', 'which', 'who', 'when', 'where', 'how', 'can',
  'will', 'would', 'should', 'could', 'may', 'might', 'must', 'from', 'into',
]);

const tokens = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w));

/** Bigram Jaccard similarity over the content words. */
function similarity(a, b) {
  const ta = tokens(a);
  const tb = tokens(b);
  if (ta.length === 0 || tb.length === 0) return 0;
  // Very short options that share all their words are genuinely the same option.
  const grams = (t) => {
    const g = new Set();
    for (let i = 0; i < t.length - 1; i++) g.add(`${t[i]} ${t[i + 1]}`);
    if (t.length === 1) g.add(t[0]);
    return g;
  };
  const ga = grams(ta);
  const gb = grams(tb);
  let inter = 0;
  for (const g of ga) if (gb.has(g)) inter++;
  const union = ga.size + gb.size - inter;
  return union === 0 ? 0 : inter / union;
}

const OPTION_SIMILARITY = 0.8;
const PHRASE_SIMILARITY = 0.85;
const PHRASE_MIN_WORDS = 12;

const nearDuplicateOptions = [];
const reusedLabels = [];
const repeatedPhrases = [];

const labelCounts = new Map();
const sentences = [];

for (const level of courseLevels) {
  for (const lesson of level.lessons) {
    for (const q of lesson.questions) {
      // 1. Near-duplicate options inside one question.
      for (let i = 0; i < q.options.length; i++) {
        for (let j = i + 1; j < q.options.length; j++) {
          const a = q.options[i];
          const b = q.options[j];
          const score = similarity(a.label, b.label);
          if (score >= OPTION_SIMILARITY) {
            nearDuplicateOptions.push({
              where: q.id,
              score,
              a: `${a.id} (correct: ${a.correct}) ${a.label}`,
              b: `${b.id} (correct: ${b.correct}) ${b.label}`,
              bothCorrect: a.correct && b.correct,
            });
          }
        }
        // 2. The same label reused as a distractor across questions.
        const key = q.options[i].label.toLowerCase().replace(/\s+/g, ' ').trim();
        if (!labelCounts.has(key)) labelCounts.set(key, []);
        labelCounts.get(key).push({ qid: q.id, oid: q.options[i].id, correct: q.options[i].correct });
      }
    }

    // 3. Sentences, for repeated phrase detection.
    const prose = [
      lesson.blurb,
      ...lesson.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.points || [])]),
      ...lesson.tryIt,
      ...lesson.questions.flatMap((q) => [q.prompt, ...q.options.map((o) => o.label)]),
    ];
    for (const p of prose) {
      for (const s of String(p).split(/(?<=[.?!])\s+/)) {
        if (tokens(s).length >= PHRASE_MIN_WORDS) sentences.push({ s, lesson: lesson.id });
      }
    }
  }
}

for (const [label, uses] of labelCounts) {
  if (uses.length > 1) {
    reusedLabels.push({ label, uses });
  }
}

// Repeated long phrases: compare each sentence against others in a different
// lesson. Quadratic, but the corpus is small enough that it is instant, and the
// index guard keeps the output focused on genuine cross-lesson reuse.
for (let i = 0; i < sentences.length; i++) {
  for (let j = i + 1; j < sentences.length; j++) {
    if (sentences[i].lesson === sentences[j].lesson) continue;
    const score = similarity(sentences[i].s, sentences[j].s);
    if (score >= PHRASE_SIMILARITY) {
      repeatedPhrases.push({
        score,
        a: `${sentences[i].lesson}: ${sentences[i].s}`,
        b: `${sentences[j].lesson}: ${sentences[j].s}`,
      });
    }
  }
}

nearDuplicateOptions.sort((x, y) => y.score - x.score);
repeatedPhrases.sort((x, y) => y.score - x.score);
reusedLabels.sort((x, y) => y.uses.length - x.uses.length);

let total = 0;

if (nearDuplicateOptions.length) {
  total += nearDuplicateOptions.length;
  console.log(`## Near-duplicate options in the same question (${nearDuplicateOptions.length})`);
  console.log('   Two answers that mean the same thing make the question unanswerable.\n');
  for (const d of nearDuplicateOptions) {
    console.log(`   ${d.where}  similarity ${d.score.toFixed(2)}${d.bothCorrect ? '   ** BOTH ARE CORRECT **' : ''}`);
    console.log(`     ${d.a.slice(0, 130)}`);
    console.log(`     ${d.b.slice(0, 130)}`);
  }
  console.log('');
}

if (reusedLabels.length) {
  total += reusedLabels.length;
  console.log(`## Option label reused across questions (${reusedLabels.length})`);
  console.log('   A distractor reused this widely has stopped teaching anything.\n');
  for (const r of reusedLabels) {
    const where = r.uses.map((u) => `${u.qid}/${u.oid}${u.correct ? ' (correct)' : ''}`).join(', ');
    console.log(`   "${r.label.slice(0, 110)}"`);
    console.log(`     used ${r.uses.length}x: ${where}`);
  }
  console.log('');
}

if (repeatedPhrases.length) {
  total += repeatedPhrases.length;
  console.log(`## Long phrase repeated across lessons (${repeatedPhrases.length})`);
  console.log('   Usually a paragraph copy-pasted during editing.\n');
  for (const p of repeatedPhrases.slice(0, 25)) {
    console.log(`   similarity ${p.score.toFixed(2)}`);
    console.log(`     ${p.a.slice(0, 140)}`);
    console.log(`     ${p.b.slice(0, 140)}`);
  }
  if (repeatedPhrases.length > 25) console.log(`   ...and ${repeatedPhrases.length - 25} more`);
  console.log('');
}

if (total === 0) {
  console.log('No duplicate or near-duplicate wording found.');
} else {
  console.log(`${total} duplicate-wording finding(s) to review.`);
}
