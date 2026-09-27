#!/usr/bin/env node
/**
 * Prose review aid for the course content, not a pass/fail gate.
 *
 * It runs `write-good` over the reader-facing sentences extracted from
 * lib/course-data.ts and prints findings grouped by category. The output is
 * intentionally not scored as pass/fail, because on this project's voice a
 * large share of the findings are wrong:
 *
 *   - "roughly" and "about" are required. The course's honesty rule says every
 *     figure is hedged and dated, so removing that hedging would be a defect.
 *   - Passive voice is often the clearest description of a mechanism
 *     ("the subsidy is paid", "the transaction is settled"), and the actor is
 *     frequently irrelevant or is the system itself.
 *   - "it is" is plain English and suits a beginner audience.
 *
 * What this script is actually for is the two categories that have caught real
 * defects here: vague fillers such as "things", and adverbs that claim a
 * precision the course does not have, such as "exactly" attached to a number.
 * Those two are listed separately below so they can be skimmed rather than
 * buried under hundreds of expected hits.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SOURCE = 'lib/course-data.ts';

// Categories worth a human read. Everything else is expected noise on this voice.
const PRIORITY = {
  precision: /\b(exactly|precisely|always|never|all|none|every|only)\b/i,
  vague: /\b(things|stuff|aspect|element|factors?)\b/i,
  dismissive: /\b(simply|just|obviously|of course|trivial)\b/i,
};

const source = readFileSync(SOURCE, 'utf8');
const sentences = [];
const re = /'((?:[^'\\\n]|\\.){25,})'/g;
let match;
while ((match = re.exec(source)) !== null) {
  const text = match[1].replace(/\\'/g, "'").replace(/\\n/g, ' ');
  if (/https?:/.test(text)) continue; // urls
  if (/^[a-z0-9-]+$/.test(text)) continue; // slugs and ids
  if (!/[a-z]{6,}/i.test(text)) continue; // units and short fragments
  sentences.push(text);
}

const dir = mkdtempSync(join(tmpdir(), 'prose-'));
const file = join(dir, 'prose.txt');
writeFileSync(file, sentences.join('\n'));

console.log(`Extracted ${sentences.length} reader-facing sentences from ${SOURCE}\n`);

// Resolve write-good's JS entry and run it with node directly. Invoking the
// `npx`/`write-good` shim fails on Windows: `execFileSync` refuses to spawn a
// `.cmd` without a shell (EINVAL), and wrapping it in a shell just trades that
// for quoting problems. The entry path is stable in the package's own manifest.
const manifest = JSON.parse(readFileSync('node_modules/write-good/package.json', 'utf8'));
const entry = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin['write-good'];
const entryPath = join('node_modules', 'write-good', entry);

let output = '';
let ran = false;
try {
  output = execFileSync(process.execPath, [entryPath, file], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  ran = true;
} catch (error) {
  // write-good exits non-zero when it has findings, which is the normal case.
  output = `${error.stdout || ''}${error.stderr || ''}`;
  if (error.code !== 1) ran = Boolean(output.trim());
}

if (!ran) {
  console.error('write-good did not run. Its findings cannot be reported.');
  console.error('Install it with: npm i -D write-good');
  process.exit(1);
}

const buckets = { precision: [], vague: [], dismissive: [] };
for (const line of output.split('\n')) {
  const hit = line.match(/^"(.+?)" (?:can weaken meaning|is wordy or unneeded|may be passive voice)/);
  if (!hit) continue;
  const word = hit[1].toLowerCase();
  for (const [key, pattern] of Object.entries(PRIORITY)) {
    if (pattern.test(word)) buckets[key].push(word);
  }
}

const titles = {
  precision: 'Precision claims - check each is not overclaiming',
  vague: 'Vague fillers - check each could be a concrete noun',
  dismissive: 'Difficulty-dismissers - check each is not shrugging off a real obstacle',
};

for (const [key, words] of Object.entries(buckets)) {
  const counts = new Map();
  for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);
  const list = [...counts].sort((a, b) => b[1] - a[1]);
  console.log(`## ${titles[key]}`);
  console.log(list.length ? `   ${list.map(([w, n]) => `${w}:${n}`).join('  ')}` : '   none');
  console.log('');
}

console.log(
  'This script does not exit non-zero. Almost every write-good finding on this content is\n' +
    'expected: "roughly" and "about" are required by the honesty rule, passive voice is often the\n' +
    'clearest description of a mechanism, and "it is" suits a beginner audience. Read the three\n' +
    'lists above, ignore the rest.',
);
