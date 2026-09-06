import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const INPUT_ROOT = process.env.GALLERY_SOURCE || 'C:/Users/bitco/bitcoin-flagship';
const OUTPUT_ROOT = path.join(projectRoot, 'public', 'gallery');
const MANIFEST_PATH = path.join(projectRoot, 'lib', 'gallery-manifest.json');

const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 80;
const KEEP_BEST = Number(process.env.KEEP_BEST ?? 6);

const CATEGORY_MAP = [
  {
    folder: 'TREZOR ACADEMY',
    group: 'education',
    groupLabel: 'Education',
    section: 'trezor-academy',
    sectionLabel: 'Trezor Academy',
    include: [
      'IMG-20250723-WA0006.jpg',
      'IMG-20250805-WA0045.jpg',
      'IMG-20250805-WA0048.jpg',
      'IMG-20250805-WA0016.jpg',
    ],
  },
  {
    folder: 'MY FIRST BITCOIN',
    group: 'education',
    groupLabel: 'Education',
    section: 'my-first-bitcoin',
    sectionLabel: 'My First Bitcoin',
    include: ['IMG-20250814-WA0025.jpg'],
  },
  {
    folder: 'LIGHTNING BOOTCAMP',
    group: 'education',
    groupLabel: 'Education',
    section: 'lightning-bootcamp',
    sectionLabel: 'Lightning Bootcamp',
    keepAll: true,
  },
  {
    folder: 'GAME DAY',
    group: 'events',
    groupLabel: 'Events',
    section: 'game-day',
    sectionLabel: 'Game Day',
  },
  {
    folder: 'MOVIE NIGHT',
    group: 'events',
    groupLabel: 'Events',
    section: 'movie-night',
    sectionLabel: 'Movie Nights',
  },
  {
    folder: 'MEET-UPS',
    group: 'events',
    groupLabel: 'Events',
    section: 'meet-ups',
    sectionLabel: 'Meet-ups',
    keepAll: true,
  },
  {
    folder: 'MURALS & BILLLBOARDS',
    group: 'public-art',
    groupLabel: 'Public Art & Awareness',
    section: 'murals-billboards',
    sectionLabel: 'Murals & Billboards',
  },
  {
    folder: 'MERCHANT ON-BOARDING',
    group: 'community',
    groupLabel: 'Community',
    section: 'merchant-onboarding',
    sectionLabel: 'Merchant On-boarding',
  },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const round2 = (value) => Math.round(value * 100) / 100;

function qualityScore(meta, stats) {
  const channels = stats.channels.slice(0, 3);
  const lum =
    0.3 * channels[0].mean + 0.59 * channels[1].mean + 0.11 * channels[2].mean;
  const dev =
    0.3 * channels[0].stdev + 0.59 * channels[1].stdev + 0.11 * channels[2].stdev;

  const pixels = (meta.width || 1) * (meta.height || 1);
  const resolution = clamp(Math.log10(pixels) / 7.5, 0, 1);
  const exposure = 1 - Math.min(Math.abs(lum - 128) / 128, 1) * 0.45;
  const contrast = clamp(dev / 55, 0, 1);

  const score = resolution * 0.35 + exposure * 0.4 + contrast * 0.25;
  return Math.round(score * 1000) / 1000;
}

async function analyze(inputBuffer) {
  const pipeline = sharp(inputBuffer, { failOn: 'none' }).rotate();
  const meta = await pipeline.clone().metadata();
  const stats = await pipeline.clone().stats();
  return { meta, stats, score: qualityScore(meta, stats) };
}

async function autoEnhance(inputBuffer) {
  const pipeline = sharp(inputBuffer, { failOn: 'none' }).rotate().resize({
    width: MAX_DIMENSION,
    height: MAX_DIMENSION,
    fit: 'inside',
    withoutEnlargement: true,
  });

  const stats = await pipeline.clone().stats();
  const channels = stats.channels.slice(0, 3);

  const lum =
    0.3 * channels[0].mean + 0.59 * channels[1].mean + 0.11 * channels[2].mean;
  const dev =
    0.3 * channels[0].stdev + 0.59 * channels[1].stdev + 0.11 * channels[2].stdev;

  const brightness = clamp(132 / (lum || 1), 0.85, 1.5);
  const contrast = clamp(1 + Math.max(0, 70 - (dev || 1)) / 400, 0.98, 1.3);
  const saturation = 1.15;

  const img = pipeline.modulate({
    brightness: round2(brightness),
    saturation,
    lightness: 0,
  });

  if (contrast !== 1) {
    img.linear(contrast, -(128 * contrast - 128));
  }

  return img
    .sharpen({ sigma: 1, m1: 0.5, m2: 0.3 })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();
}

async function processFolder(config) {
  const sourceDir = path.join(INPUT_ROOT, config.folder);
  if (!fs.existsSync(sourceDir)) {
    console.warn(`  ! Skipped (folder not found): ${config.folder}`);
    return null;
  }

  const outputDir = path.join(OUTPUT_ROOT, config.group, config.section);
  fs.mkdirSync(outputDir, { recursive: true });

  const files = fs
    .readdirSync(sourceDir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const candidates = [];
  for (const file of files) {
    const src = path.join(sourceDir, file);
    try {
      const buffer = await fs.promises.readFile(src);
      const { score } = await analyze(buffer);
      candidates.push({ file, buffer, score });
    } catch (err) {
      console.error(`  ! Could not analyze ${file}: ${err.message}`);
    }
  }

  candidates.sort((a, b) => b.score - a.score);

  const forced = new Set((config.include ?? []).map((f) => f.toLowerCase()));
  const forcedPicks = candidates.filter((c) => forced.has(c.file.toLowerCase()));
  let bestPicks =
    candidates.filter((c) => !forced.has(c.file.toLowerCase())) ?? [];
  if (!config.keepAll) {
    bestPicks = bestPicks.slice(0, KEEP_BEST - forcedPicks.length);
  }
  const picks = [...forcedPicks, ...bestPicks];

  const images = [];
  let processed = 0;

  for (const { file, buffer } of picks) {
    const outName = `${path.parse(file).name}.webp`;
    const out = path.join(outputDir, outName);

    try {
      const enhanced = await autoEnhance(buffer);
      await fs.promises.writeFile(out, enhanced);
      images.push(outName);
      processed++;
    } catch (err) {
      console.error(`  ! Failed ${file}: ${err.message}`);
    }
  }

  return {
    group: config.group,
    groupLabel: config.groupLabel,
    section: config.section,
    sectionLabel: config.sectionLabel,
    images,
    processed,
    total: candidates.length,
  };
}

async function main() {
  console.log(`Source : ${INPUT_ROOT}`);
  console.log(`Output : ${OUTPUT_ROOT}`);
  console.log(`Keeping best ${KEEP_BEST} per section`);
  console.log('');

  if (fs.existsSync(OUTPUT_ROOT)) {
    fs.rmSync(OUTPUT_ROOT, { recursive: true });
  }

  const results = [];
  for (const config of CATEGORY_MAP) {
    console.log(`Processing: ${config.folder}`);
    const result = await processFolder(config);
    if (result) {
      results.push(result);
      console.log(`  -> picked ${result.processed}/${result.total} images`);
    }
  }

  const manifest = results
    .filter((r) => r !== null && r.images.length > 0)
    .map(({ group, groupLabel, section, sectionLabel, images }) => ({
      group,
      groupLabel,
      section,
      sectionLabel,
      images,
    }));

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log('');
  console.log(`Manifest written to ${MANIFEST_PATH}`);
  console.log(`Total: ${manifest.reduce((acc, g) => acc + g.images.length, 0)} images across ${manifest.length} sections`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});