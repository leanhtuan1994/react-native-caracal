/**
 * Renders every raster brand asset from the SVG sources in assets/brand/.
 *
 * Run with `pnpm brand:assets`. Output is deterministic — running twice produces
 * byte-identical files with the same renderer.
 *
 * See assets/brand/README.md for the size guidance that decides which mark
 * variant each size uses.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const brand = (file) => join(root, 'assets/brand', file);

const INK = '#0A0D11';

/**
 * Render a mark SVG centred on a square canvas.
 *
 * Trim transparent margins so coverage describes the artwork itself. The
 * adaptive foreground uses extra padding for launcher masks.
 */
async function renderMark({ source, size, coverage, background, out }) {
  const inner = Math.round(size * coverage);
  const mark = await sharp(readFileSync(brand(source)), { density: 600 })
    .trim({ threshold: 0 })
    .resize(inner, inner, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const canvas = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  }).composite([{ input: mark, gravity: 'centre' }]);

  writeFileSync(
    join(root, out),
    await canvas.png({ compressionLevel: 9 }).toBuffer()
  );
  return out;
}

const targets = [
  // iOS/app icon — opaque Ink, mark at 70%.
  {
    source: 'caracal-mark.svg',
    size: 1024,
    coverage: 0.7,
    background: INK,
    out: 'assets/icon.png',
  },
  // Android adaptive foreground — transparent, padded to fit the circular safe zone.
  {
    source: 'caracal-mark.svg',
    size: 1024,
    coverage: 0.47,
    out: 'assets/adaptive-icon.png',
  },
  // Splash — transparent; app.config.ts sets the Ink backgroundColor and a 150px width.
  {
    source: 'caracal-mark.svg',
    size: 512,
    coverage: 0.8,
    out: 'assets/splash-icon.png',
  },
  // Expo web favicon — compact variant, fewer facets at small sizes.
  {
    source: 'caracal-mark-compact.svg',
    size: 48,
    coverage: 0.85,
    background: INK,
    out: 'assets/favicon.png',
  },
];

async function main() {
  for (const target of targets) {
    console.log(`✓ ${await renderMark(target)}`);
  }

  // Docs favicon: the compact variant verbatim, no rasterization needed.
  writeFileSync(
    join(root, 'docs/public/favicon.svg'),
    readFileSync(brand('caracal-mark-compact.svg'))
  );
  console.log('✓ docs/public/favicon.svg');

  // Docs social card. mozjpeg off keeps encoding reproducible across machines.
  const og = await sharp(readFileSync(brand('og-card.svg')))
    .resize(1200, 630)
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4', mozjpeg: false })
    .toBuffer();
  writeFileSync(join(root, 'docs/public/og.jpg'), og);
  console.log('✓ docs/public/og.jpg');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
