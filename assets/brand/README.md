# Caracal brand assets

Source of truth for every raster asset in this repo. The PNGs in `assets/` and the docs site's
`favicon.svg` / `og.jpg` are **generated** from these files — edit the SVG, then run:

```bash
pnpm brand:assets
```

Maintainer reference. If you scaffolded a project from this template, replace these files with
your own mark and re-run the command above.

## The mark

The right-facing profile combines swept ear tips, a curved cheek and a short angular muzzle.
Flat, editable vector faces run diagonally from the cheek to the brow. Keep this orientation
when pairing the symbol with the outlined Caracal wordmark.

| File                            | Use                                                   |
| ------------------------------- | ----------------------------------------------------- |
| `caracal-mark.svg`              | Full-color mark on Ink, 48px and above                |
| `caracal-mark-light.svg`        | Richer orange and sand facets on light surfaces       |
| `caracal-mark-compact.svg`      | Simplified facets for navigation and favicons         |
| `caracal-mark-micro.svg`        | Single-color silhouette for the smallest placements   |
| `caracal-lockup-horizontal.svg` | Full mark and outlined wordmark on dark backgrounds   |
| `og-card.svg`                   | 1200×630 social card, source for `docs/public/og.jpg` |

The compact drawing retains the slanted eye and combines adjoining facets. The micro
drawing uses only the outer contour. Use the SVG paths directly for editing in Illustrator.

## Palette

The mark uses tangerine (`#FF8443`) for the head, fired clay (`#CC4B30`) for the cheek
and pale sand (`#FFE2AF`) for the muzzle. The app icon sits on Ink (`#0A0D11`).
Use the project's existing Caracal orange and Orbit cyan tokens for interface text and controls.

### Text-safe light variants

Use the following interface colors for text and controls on Sand (`#F5F1EA`).

| Role                  | Light value | Contrast on Sand | Foreground on it   |
| --------------------- | ----------- | ---------------- | ------------------ |
| Caracal, as text/fill | `#A25C2B`   | 4.55:1           | 5.04:1 (`#FFFDF9`) |
| Orbit, as text/fill   | `#1A788F`   | 4.52:1           | 5.01:1 (`#FFFDF9`) |

Dark mode needs no second step — `#C8763C` on Ink is 5.67:1 and `#7DD3E8` on Ink is 11.45:1.

## Typography

- **Space Grotesk** 600 / 500 — display, wordmark
- **JetBrains Mono** 400 / 700 — labels, CLI, code

The wordmark in `caracal-lockup-horizontal.svg` and `og-card.svg` is **outlined to paths**, so
those files render identically with no fonts installed. Regenerating them from live text would
reintroduce a font dependency — don't.

## Clear space

Keep free space of at least half the mark's height on all sides.
