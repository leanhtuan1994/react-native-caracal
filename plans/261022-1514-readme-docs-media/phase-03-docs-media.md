# Phase 3: Add media to the docs site

## Context

The docs site (Fumadocs on Next.js, `docs/`) serves `docs/public/` at the site root, so
Phase 2's files are available at `/screenshots/...`. The only existing video embed is in
`ui-and-theme/ui-theming.mdx` (a raw `<video controls>` pointing at a GitHub asset URL);
reuse that pattern.

## Files

- Modify `docs/content/docs/index.mdx` (Introduction)
- Modify `docs/content/docs/ui-and-theme/iphone-duo.mdx`
- Modify `docs/content/docs/ui-and-theme/ui-theming.mdx` (dark mode section)
- Optional: `docs/content/docs/ui-and-theme/liquid-glass.mdx`

## Steps

1. **Introduction (`index.mdx`)**: after the opening paragraph, add
   `![Caracal on iPhone and iPhone Duo](/screenshots/devices-home.webp)` and a row of
   `iphone/01-onboarding`, `03-home`, `04-profile`, `06-settings-dark`.
2. **iPhone Duo page (`iphone-duo.mdx`)**:
   - Under "What the Duo changes", add `iphone-duo/compare-home.webp` (cover vs inner).
   - Under "Rules for screens", next to the readable-column rule, add
     `inner-03-settings.webp`; next to the two-column rule, add `inner-02-home.webp`.
   - In "Testing", embed both videos:

     ```mdx
     <video
       src="/screenshots/iphone-duo/cover.mp4"
       autoPlay
       loop
       muted
       playsInline
       style={{ maxWidth: '300px' }}
     />
     <video
       src="/screenshots/iphone-duo/inner.mp4"
       autoPlay
       loop
       muted
       playsInline
       style={{ width: '100%' }}
     />
     ```

3. **Theming (`ui-theming.mdx`)**: in the dark mode section add `iphone/05-settings.webp` and
   `iphone/06-settings-dark.webp` side by side.
4. **Liquid glass (optional)**: add `iphone/03-home.webp` and `07-home-dark.webp` to show the
   glass surfaces in both themes.

## Verify

```bash
cd docs
pnpm install --ignore-workspace
pnpm build
pnpm dev   # open /docs, /docs/ui-and-theme/iphone-duo, /docs/ui-and-theme/ui-theming
```

- Every image loads, videos autoplay muted and loop, and nothing overflows at 375 px width.
- The Vercel preview on the PR shows the same.

## Risk

`autoPlay` needs `muted` and `playsInline` to start on iOS Safari; keep all three.
