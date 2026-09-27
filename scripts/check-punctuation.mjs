#!/usr/bin/env node
/**
 * Punctuation and typography checks on the learner-facing course prose.
 *
 * cspell catches spelling and write-good catches hedging and passive voice, but
 * neither looks at punctuation, so a doubled word or a missing space after a
 * comma survives both. This covers the mechanical errors that are unambiguous,
 * and deliberately does not try to be a style guide: the course uses British
 * spelling, single quotes for nested quotation, and en or em dashes, and none of
 * those are reported.
 *
 * The text checked is the reader-facing content of lib/course-data.ts: section
 * headings, paragraphs, list points, table cells, blurbs, tryIt steps, question
 * prompts, option labels and option explanations. Object keys, ids and URLs are
 * not checked because a key like `heading:` is not prose.
 *
 * Report only, no exit code, because a couple of these are judgement calls a
 * human should make. Everything it prints is a real mechanical defect though, so
 * treat a non-empty report as work to do rather than noise.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const DATA = 'lib/course-data.ts';
const tmp = mkdtempSync(join(tmpdir(), 'punct-'));

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
  const { courseLevels } = await import(pathToFileURL(join(tmp, 'course-data.js')).href);
  await check(courseLevels);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

async function check(courseLevels) {
  const findings = [];

  /** Add a finding with a little context so it can be found in the source. */
  const flag = (where, kind, match, detail) => {
    findings.push({ where, kind, match, detail });
  };

  const inspect = (where, text, kindOfField) => {
    if (typeof text !== 'string' || !text.trim()) return;
    // Option labels, table cells, headings and list points are phrases, not
    // sentences, so a missing terminal full stop is correct in them and only
    // paragraph prose is held to that rule.
    const isProse = kindOfField === 'prose';

    // Doubled words: "the the", "of of". A few are legitimate across a phrase
    // boundary, so the finding is reported with both words for a human glance.
    for (const m of text.matchAll(/\b([A-Za-z]{1,12})\s+\1\b/gi)) {
      if (m[1].toLowerCase() === 'had') continue; // "had had" is valid English
      flag(where, 'doubled word', m[0], `"${m[0]}"`);
    }

    // Space before closing punctuation.
    for (const m of text.matchAll(/\s+[,;:.!?](?=\s|$)/g)) {
      const ch = m[0].trim();
      // A colon introducing a list or a time is fine with a space, but there is
      // none in this content, so treat every one as a defect.
      flag(where, 'space before punctuation', m[0], `space before "${ch}"`);
    }

    // Missing space after sentence punctuation.
    for (const m of text.matchAll(/[.!?](?=[A-Z][a-z])/g)) {
      flag(where, 'missing space after full stop', m[0], `"${m[0]}"`);
    }
    for (const m of text.matchAll(/[,;](?=[A-Za-z])/g)) {
      flag(where, 'missing space after comma or semicolon', m[0], `"${m[0]}"`);
    }

    // Repeated punctuation, excluding an ellipsis and a full stop ending a
    // sentence that happens to be followed by another.
    for (const m of text.matchAll(/([,;:])\1+/g)) {
      flag(where, 'repeated punctuation', m[0], `"${m[0]}"`);
    }
    for (const m of text.matchAll(/\.\.\.\./g)) {
      flag(where, 'too many full stops', m[0], `"${m[0]}"`);
    }

    // A comma directly before a full stop.
    for (const m of text.matchAll(/,\./g)) {
      flag(where, 'comma before full stop', m[0], `"${m[0]}"`);
    }

    // Unbalanced brackets and quotes.
    for (const [open, close, name] of [['(', ')', 'parenthesis'], ['[', ']', 'bracket']]) {
      const o = (text.match(new RegExp(`\\${open}`, 'g')) || []).length;
      const c = (text.match(new RegExp(`\\${close}`, 'g')) || []).length;
      if (o !== c) {
        flag(where, `unbalanced ${name}s`, `${open}x${o} ${close}x${c}`, `${o} opened, ${c} closed`);
      }
    }
    // Only double and curly quotes are expected to balance. A straight single
    // quote in this content is always an apostrophe, never a quotation mark: it
    // appears as a plural possessive ("miners' electricity"), a trailing
    // possessive after a name ending in s ("Mises' regression theorem"), a
    // contraction, or in a BIP44 derivation path (m/44'/0'/0'/0/0) where it
    // marks hardened derivation. Counting those toward a balance would report
    // every one of them as an unclosed quote.
    const quotes = (text.match(/["\u201C\u201D\u2018\u2019]/g) || []).length;
    if (quotes % 2 !== 0) {
      flag(where, 'unpaired quotation mark', `${quotes}`, `${quotes} found, so one is unclosed`);
    }

    // Doubled quotation marks, which are always a typo rather than an empty quote.
    for (const m of text.matchAll(/""+/g)) {
      flag(where, 'doubled quotation mark', m[0], `"${m[0]}"`);
    }
    for (const m of text.matchAll(/(?<![\w])''+(?![\w])/g)) {
      flag(where, 'doubled apostrophe', m[0], `"${m[0]}"`);
    }

    // The pronoun "i" should be capitalised, but never inside a word.
    for (const m of text.matchAll(/(?<![\w'"])i(?![\w'"])/g)) {
      flag(where, 'lowercase pronoun i', ' i ', 'should be "I"');
    }

    // Trailing whitespace and double spaces inside prose.
    if (/[ \t]{2,}/.test(text)) {
      const m = text.match(/[ \t]{2,}/);
      flag(where, 'multiple consecutive spaces', m[0], `"${m[0]}"`);
    }
    if (/\s$/.test(text)) {
      flag(where, 'trailing whitespace', 'end', 'string ends with a space');
    }

    // A paragraph that ends without terminal punctuation is almost always a
    // truncated string rather than deliberate, but only prose is held to it.
    const trimmed = text.trim();
    if (isProse && trimmed.length > 40 && !/[.!?:)\]"']$/.test(trimmed)) {
      flag(where, 'no terminal punctuation', trimmed.slice(-28), `"…${trimmed.slice(-28)}"`);
    }
  };

  for (const level of courseLevels) {
    for (const lesson of level.lessons) {
      inspect(`${lesson.id} blurb`, lesson.blurb, 'prose');
      for (const s of lesson.sections) {
        inspect(`${lesson.id} heading`, s.heading, 'phrase');
        for (const p of s.paragraphs) inspect(`${lesson.id} "${s.heading}"`, p, 'prose');
        for (const p of s.points || []) inspect(`${lesson.id} "${s.heading}" point`, p, 'phrase');
        for (const [i, row] of (s.table?.rows || []).entries()) {
          for (const [j, cell] of row.entries()) {
            inspect(`${lesson.id} table "${s.heading}" r${i + 1}c${j + 1}`, cell, 'phrase');
          }
        }
        if (s.table?.note) inspect(`${lesson.id} table note "${s.heading}"`, s.table.note, 'prose');
      }
      for (const t of lesson.tryIt) inspect(`${lesson.id} tryIt`, t, 'prose');
      for (const q of lesson.questions) {
        inspect(`${q.id} prompt`, q.prompt, 'phrase');
        for (const o of q.options) {
          inspect(`${q.id} option ${o.id} label`, o.label, 'phrase');
          inspect(`${q.id} option ${o.id} explanation`, o.explanation, 'prose');
        }
      }
    }
  }

  if (findings.length === 0) {
    console.log('Punctuation clean across all learner-facing course content.');
    return;
  }

  const byKind = new Map();
  for (const f of findings) {
    if (!byKind.has(f.kind)) byKind.set(f.kind, []);
    byKind.get(f.kind).push(f);
  }
  console.log(`${findings.length} punctuation finding(s) in ${byKind.size} categories:\n`);
  for (const [kind, list] of byKind) {
    console.log(`## ${kind} (${list.length})`);
    for (const f of list.slice(0, 12)) console.log(`   ${f.where}: ${f.detail}`);
    if (list.length > 12) console.log(`   ...and ${list.length - 12} more`);
    console.log('');
  }
}
