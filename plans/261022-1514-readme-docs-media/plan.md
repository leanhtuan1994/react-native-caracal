---
title: 'README and docs screenshots for iPhone and iPhone Duo'
description: 'Add watermark-free screenshots, GIFs and videos of the app on a regular iPhone and the iPhone Duo to the README and the docs site, plus two Release-build fixes found while capturing.'
status: completed
priority: P2
effort: '0.5d'
branch: docs/readme-screenshots
tags: [docs, readme, screenshots, iphone-duo, media]
created: 2026-10-22
---

# README and docs screenshots for iPhone and iPhone Duo

## Overview

The README has a `<!-- add a gif image here -->` placeholder and the docs site shows no
screenshots of the app. This plan publishes the media captured on 2026-10-22 and wires it
into the README, the docs introduction, and the iPhone Duo page.

All media is captured, optimized and published in `docs/public/screenshots/`. It was captured with
`xcrun simctl io` (no argent watermark) from a **Release** build, with the status bar set
to 9:41 / full signal / full battery, using the demo account "Emily Johnson".

Capturing in Release surfaced two bugs. Their fixes are already in the working tree on
`main` (uncommitted) and are Phase 1.

## Captured media

| File                                                                          | Size            | Content                                                                                     |
| ----------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------- |
| `screenshots/devices-home.webp`                                               | 108 KB          | Home on iPhone 18 Pro, Duo cover and Duo inner, side by side (1862×700)                     |
| `screenshots/iphone/01-onboarding.webp` … `07-home-dark.webp`                 | 28–61 KB each   | Onboarding, Sign up, Home, Profile, Settings (light) and Settings, Home (dark); 600 px wide |
| `screenshots/iphone/demo.gif`                                                 | 3.1 MB          | 22 s flow: scroll feed, tag filter, tabs, Light → Dark → System (270 px, 8 fps)             |
| `screenshots/iphone/demo.mp4`                                                 | 1.5 MB          | Same flow, 590 px, H.264                                                                    |
| `screenshots/iphone-duo/cover-01-onboarding.webp` … `cover-03-settings.webp`  | 22–40 KB        | Cover display: onboarding, Home, Settings (side tab bar)                                    |
| `screenshots/iphone-duo/inner-01-onboarding.webp` … `inner-04-home-dark.webp` | 19–55 KB        | Inner display: onboarding, two-column Home, Settings, two-column Home dark; 1000 px wide    |
| `screenshots/iphone-duo/compare-home.webp`                                    | 82 KB           | Duo cover vs inner Home, side by side                                                       |
| `screenshots/iphone-duo/cover.gif` / `cover.mp4`                              | 1.0 MB / 408 KB | 5 s scroll on the cover display                                                             |
| `screenshots/iphone-duo/inner.gif` / `inner.mp4`                              | 2.0 MB / 731 KB | 16 s on the inner display: two-column scroll, fold to half-open and back, tab switch        |

Raw `.mov` recordings and full-resolution PNGs stay in the session scratchpad and are not
committed.

## Accepted decisions

| #   | Decision                                                                                                                                          | Source  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| D1  | Capture with `xcrun simctl io` (screenshot / recordVideo), not argent screenshots, so the media has no watermark.                                 | User    |
| D2  | Cover both a regular iPhone (iPhone 18 Pro) and the iPhone Duo (cover and inner displays).                                                        | User    |
| D3  | Stills are WebP (q86): GitHub, npm and Next.js all render it, and it is ~10× smaller than PNG.                                                    | Planner |
| D4  | The README uses GIFs (GitHub does not play repo-relative `.mp4`); the docs site uses `.mp4` in `<video>` because it is 2–4× smaller than the GIF. | Planner |

## Phases

| #   | Phase                                                                         | Status | Depends on |
| --- | ----------------------------------------------------------------------------- | ------ | ---------- |
| 1   | [Release-build fixes found during capture](./phase-01-release-build-fixes.md) | Done   | —          |
| 2   | [Publish media and update the README](./phase-02-readme-media.md)             | Done   | —          |
| 3   | [Add media to the docs site](./phase-03-docs-media.md)                        | Done   | 2          |

Phases 2 and 3 can share one PR. Phase 1 is a separate `fix:` commit (same PR is fine).

## Non-goals

- No Android screenshots (no Android foldable AVD locally; add later).
- No automated screenshot pipeline (Maestro/Fastlane snapshot). Capture steps are recorded
  in [`./capture-recipe.md`](./capture-recipe.md) for manual re-runs.
- No App Store marketing frames or device bezels.

## Acceptance criteria

- README shows a screenshot strip, an iPhone GIF and an iPhone Duo section; all images load
  on github.com and total README media stays under 8 MB.
- Docs introduction shows the screenshot strip; the iPhone Duo page shows cover/inner stills
  and plays `cover.mp4` / `inner.mp4`.
- `pnpm build` in `docs/` passes; no broken image links.
- Phase 1 fixes merged: a Release build shows translated text (no `home.all`-style keys) and
  the onboarding panel glow fills the panel after unfolding.

## Resolved questions

Accepted on 2026-10-22:

1. Media lives in `docs/public/screenshots/`, shared by the README and the docs site.
2. The README keeps both GIFs (~5 MB total, under the 8 MB limit).
3. `docs/public/screenshots/**` is added to `ignorePaths` in `compress-images.yml` so the
   optimized files are not re-encoded.

## Outcome

- The docs Theming page's old Obytes dark-mode video was replaced with the new light/dark
  Settings screenshots and `iphone/demo.mp4`, since it showed an outdated UI.
- The `screenshots/` folder was removed from this plan after copying, to avoid committing the
  files twice.
