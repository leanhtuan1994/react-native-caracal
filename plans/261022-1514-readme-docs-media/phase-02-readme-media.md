# Phase 2: Publish media and update the README

## Context

`README.md` line 89 has `<!-- add a gif image here -->` between "Stay up to date" and
"Libraries used". The key features list does not mention liquid glass, dark mode, or
iPhone Duo / foldable support.

## Files

- Create `docs/public/screenshots/` with the contents of `./media/` (keep the `iphone/` and
  `iphone-duo/` subfolders; copy `devices-home.webp` to the root).
- Modify `README.md`.

## Steps

1. Copy media (stills, GIFs, MP4s):

   ```bash
   mkdir -p docs/public/screenshots
   cp -R plans/261022-1514-readme-docs-media/media/* docs/public/screenshots/
   ```

2. In `README.md`, replace `<!-- add a gif image here -->` with a `## 📸 Screenshots`
   section:
   - The device comparison: `./docs/public/screenshots/devices-home.webp`, captioned
     "iPhone 18 Pro · iPhone Duo (closed) · iPhone Duo (open)".
   - A 4-image strip in an HTML table (`width="200"`): `01-onboarding`, `03-home`,
     `04-profile`, `07-home-dark`.
   - The flow GIF `iphone/demo.gif` centered, `width="270"`.
   - A short "Ready for iPhone Duo" line linking to the docs page
     (`https://react-native-template-atlas.vercel.app/docs/ui-and-theme/iphone-duo`) with
     `iphone-duo/inner.gif` (`width="480"`).
3. Add two bullets to **Key Features**:
   - "🪟 iOS 26 liquid glass UI with light and dark themes."
   - "📱 Adaptive layouts for iPhone Duo, iPad and Android foldables (safe-area aware,
     two-column feed on wide windows)."
4. Use `<p align="center">` / `<img>` HTML so widths are respected on GitHub; give every
   image an `alt`.

## Verify

- Preview `README.md` on the pushed branch on github.com: all images load, GIFs animate.
- `du -ch` of files referenced from the README is under 8 MB.
- Prettier passes on `README.md` (lint-staged runs it).

## Risk

GitHub caches images through camo; if an image is replaced later, rename it rather than
overwrite to bust the cache.
