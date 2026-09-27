#!/usr/bin/env node
/**
 * Keep docs/course-outline.md in step with lib/course-data.ts on the two things
 * that silently break a quiz: the answer letter and the order of the options.
 *
 * Why this exists: the outline is declared the source of truth for structure and
 * questions, but learners read lib/course-data.ts. Reword or reorder an option in
 * one file and not the other and nothing tells you, because the outline keeps
 * saying "Answer: B" long after the quiz moved on. A reviewer reading only the
 * outline then checks a different question from the one a learner gets.
 *
 * It rewrites only the option list and the answer letter, taking both from
 * course-data. Prompts, the "Covers:" line, the question-design notes and the
 * "— explanation" after each answer are left alone, because those are editorial
 * content that belongs to the outline.
 *
 * Two different kinds of disagreement are handled differently, on purpose:
 *
 *   order/answer drift    The options are the same text in a different order, or
 *                         the answer letter is stale. Fixed automatically, since
 *                         reordering loses no content.
 *
 *   wording drift         An option's text differs between the files. This is
 *                         NOT touched by default, because picking a winner would
 *                         mean silently rewriting prose. It is reported. Pass
 *                         --adopt-data to take the learner-facing wording.
 *
 * Usage:
 *   node scripts/sync-outline.mjs                    fix order/answer drift
 *   node scripts/sync-outline.mjs --check            report only, exit 1 on drift
 *   node scripts/sync-outline.mjs --lesson <id>      limit to one lesson
 *   node scripts/sync-outline.mjs --adopt-data       also take course-data wording
 */
import { readFileSync, writeFileSync } from 'node:fs';

const OUTLINE = 'docs/course-outline.md';
const DATA = 'lib/course-data.ts';

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const adoptData = args.includes('--adopt-data');
const onlyIndex = args.indexOf('--lesson');
const onlyLesson = onlyIndex >= 0 ? args[onlyIndex + 1] : null;

const unescape = (s) => s.replace(/\\'/g, "'").replace(/\\`/g, '`');
const stripQuotes = (s) => s.replace(/^['"]|['"]$/g, '').trim();
const squash = (s) => unescape(stripQuotes(s)).replace(/\s+/g, ' ').trim();

/** Ordered option labels plus the correct letter, for every written lesson. */
function readLessonsFromData() {
  const src = readFileSync(DATA, 'utf8');
  const out = [];
  const re = /const ((?:L|M)\d+(?:_\d+)?): Lesson = \{/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const end = src.indexOf('\n};', m.index);
    const body = src.slice(m.index, end);
    const idMatch = body.match(/id: '([a-z0-9-]+)'/);
    const qs = body.indexOf('questions: [');
    if (qs < 0) continue;
    const qBlock = body.slice(qs, body.indexOf('tryIt:', qs));

    const chunks = qBlock.split(/id: '([a-z0-9-]+-q\d+)'/).slice(1);
    const questions = [];
    for (let i = 0; i < chunks.length; i += 2) {
      const opts = [
        ...chunks[i + 1].matchAll(/id: '([a-d])',\s*label:\s*([\s\S]*?),\s*correct: (true|false)/g),
      ];
      if (opts.length !== 4) {
        throw new Error(`${idMatch[1]} ${chunks[i]}: ${opts.length} options, expected 4`);
      }
      questions.push({
        id: chunks[i],
        labels: opts.map((o) => squash(o[2])),
        correct: 'ABCD'[opts.findIndex((o) => o[3] === 'true')],
      });
    }
    out.push({ constName: m[1], id: idMatch[1], questions });
  }
  return out;
}

/** Parse an outline option region into {letter, body}, tolerating line wrapping. */
function parseOutlineOptions(region) {
  const marks = [...region.matchAll(/(?:^|\s)\u00b7?\s*([A-D])\.\s/g)].map((m) => ({
    letter: m[1],
    at: m.index,
  }));
  const opts = [];
  for (let i = 0; i < marks.length; i++) {
    const from = marks[i].at + region.slice(marks[i].at).indexOf('.') + 1;
    const to = i + 1 < marks.length ? marks[i + 1].at : region.length;
    opts.push({ letter: marks[i].letter, body: squash(region.slice(from, to)) });
  }
  return opts;
}

const lessons = readLessonsFromData().filter((l) => !onlyLesson || l.id === onlyLesson);
if (lessons.length === 0) {
  console.error(onlyLesson ? `No written lesson with id ${onlyLesson}` : 'No written lessons found');
  process.exit(1);
}

const original = readFileSync(OUTLINE, 'utf8');
let text = original;
const orderDrift = [];
const wordingDrift = [];
let rewritten = 0;
let checked = 0;

for (const lesson of lessons) {
  const cm = lesson.constName.match(/^([LM])(\d+)_(\d+)$/);
  if (!cm) throw new Error(`cannot derive an outline heading from ${lesson.constName}`);
  const heading = new RegExp(`^### ${cm[1]}${cm[2]}\\.${cm[3]}\\b`, 'm');
  const hm = heading.exec(text);
  if (!hm) {
    console.error(`Outline has no heading for ${lesson.constName} (${cm[1]}${cm[2]}.${cm[3]})`);
    process.exit(1);
  }
  const start = hm.index;
  const nh = /^### /gm;
  nh.lastIndex = start + 4;
  const nm = nh.exec(text);
  const end = nm ? nm.index : text.length;
  const section = text.slice(start, end);

  const starts = [...section.matchAll(/^\d+\. \*\*/gm)].map((m) => m.index);
  starts.push(section.length);
  const found = starts.length - 1;
  if (found !== lesson.questions.length) {
    console.error(`${lesson.id}: outline has ${found} questions, course-data has ${lesson.questions.length}`);
    process.exit(1);
  }

  let out = section.slice(0, starts[0]);
  for (let i = 0; i < found; i++) {
    const block = section.slice(starts[i], starts[i + 1]);
    const ansPos = block.indexOf('**Answer:');
    if (ansPos < 0) {
      console.error(`${lesson.id}: outline question ${i + 1} has no Answer line`);
      process.exit(1);
    }
    const head = block.slice(0, ansPos);
    const tail = block.slice(ansPos);
    const osm = /\n\s{3}[A-D]\.\s/.exec(head);
    if (!osm) {
      console.error(`${lesson.id}: outline question ${i + 1} has no option list`);
      process.exit(1);
    }
    const optStart = osm.index;
    const q = lesson.questions[i];
    const outlineOpts = parseOutlineOptions(head.slice(optStart));
    checked++;

    const currentAnswer = (tail.match(/\*\*Answer: ([A-D])\*\*/) || [])[1];
    const answerStale = currentAnswer !== q.correct;

    // Do the two files hold the same four options, ignoring order?
    const outlineBodies = outlineOpts.map((o) => o.body);
    const dataBodies = q.labels;
    const sameSet =
      outlineBodies.length === 4 &&
      dataBodies.every((d) => outlineBodies.includes(d)) &&
      outlineBodies.every((o) => dataBodies.includes(o));
    const sameOrder = sameSet && outlineBodies.every((b, idx) => b === dataBodies[idx]);

    let textDiffers = false;
    if (!sameSet) {
      const pairs = [];
      for (const d of dataBodies) {
        const near = outlineBodies.find((o) => o.slice(0, 40) === d.slice(0, 40));
        pairs.push(near === undefined ? `outline has no equivalent of "${d.slice(0, 70)}"` : `outline: "${near}"`);
      }
      wordingDrift.push({ lesson: lesson.id, q: i + 1, id: q.id, pairs });
    }

    const needsFix = answerStale || !sameOrder || (!sameSet && adoptData);
    if (!needsFix) {
      out += block;
      continue;
    }
    if (!sameSet && !adoptData) {
      // Order cannot be safely established when the text differs, so leave it.
      out += block;
      continue;
    }
    orderDrift.push({
      lesson: lesson.id,
      q: i + 1,
      id: q.id,
      answer: answerStale ? `${currentAnswer} -> ${q.correct}` : 'unchanged',
      order: !sameOrder,
    });

    if (checkOnly) {
      out += block;
      continue;
    }

    const wantedOptions = q.labels.map((l, idx) => `${'ABCD'[idx]}. ${l}`).join(' \u00b7 ');
    out +=
      head.slice(0, optStart) +
      '\n   ' +
      wantedOptions +
      '\n  ' +
      tail.replace(/\*\*Answer: [A-D]\*\*/, `**Answer: ${q.correct}**`);
    rewritten++;
  }

  if (out !== section) text = text.slice(0, start) + out + text.slice(end);
}

if (wordingDrift.length) {
  console.log(`Wording drift between the two files, in ${wordingDrift.length} question(s).`);
  console.log('These are left alone unless you pass --adopt-data:\n');
  for (const d of wordingDrift) {
    console.log(`  ${d.lesson} ${d.id}:`);
    for (const p of d.pairs.slice(0, 3)) console.log(`    ${p.slice(0, 130)}`);
    if (d.pairs.length > 3) console.log(`    ...and ${d.pairs.length - 3} more`);
  }
  console.log('');
}

if (checkOnly) {
  if (orderDrift.length === 0) {
    console.log(`${OUTLINE} answers and option order match ${DATA} across ${checked} question(s).`);
    process.exit(wordingDrift.length ? 1 : 0);
  }
  console.log(`Order or answer drift in ${orderDrift.length} question(s):`);
  for (const d of orderDrift) {
    console.log(`  ${d.lesson} ${d.id}: answer ${d.answer}${d.order ? ', option order differs' : ''}`);
  }
  console.log(`\nRun: node scripts/sync-outline.mjs   (to fix ${OUTLINE} from ${DATA})`);
  process.exit(1);
}

if (rewritten === 0) {
  console.log(
    wordingDrift.length
      ? `${OUTLINE}: nothing rewritten. ${wordingDrift.length} question(s) differ in wording; use --adopt-data to take the course-data text.`
      : `${OUTLINE} already matches ${DATA} across ${checked} question(s).`,
  );
} else {
  writeFileSync(OUTLINE, text);
  console.log(
    `Rewrote ${rewritten} question(s) in ${OUTLINE} from ${DATA} ` +
      `(${orderDrift.length} with order/answer drift, ${checked} checked).`,
  );
}
