# Phase 1: Release-build fixes found during capture

**Status:** Done.

## Context

Both bugs only showed up in a Release build on the simulator; Debug builds with Metro hid them.

### Bug 1: raw translation keys in Release

- **Symptom:** Home showed `home.greeting_afternoon`, `home.search_placeholder`, `tabs.home`
  instead of English text.
- **Cause:** `src/lib/i18n/index.tsx` calls `i18n.init()` as a module side effect, but no
  module on the startup path imports it. Only `language-pill.tsx` and `general-section.tsx`
  import `@/lib/i18n`, and Release bundles evaluate modules lazily, so `useTranslation()`
  rendered before `init()` ran.
- **Fix:** `import '@/lib/i18n';` near the top of `src/app/_layout.tsx`, after `global.css`,
  with a comment explaining why.

### Bug 2: onboarding panel glow cut off after unfolding

- **Symptom:** On the Duo inner display, the onboarding feature panel's blue/violet glow
  covered only the left part of the panel.
- **Cause:** same as the `AmbientBackground` bug fixed in PR #25. `react-native-svg`
  percentage gradients keep the bounds of their first draw.
- **Fix:** `src/components/onboarding/panel-glow.tsx` keys its `Svg` on
  `useWindowDimensions()` width × height, matching `ambient-background.tsx`.

## Files

- `src/app/_layout.tsx` (modified)
- `src/components/onboarding/panel-glow.tsx` (modified)

## Steps

1. Review the diff: `git diff src/app/_layout.tsx src/components/onboarding/panel-glow.tsx`.
2. Commit as `fix: initialize i18n at startup and redraw panel glow on resize`.

## Verify

- [x] `pnpm type-check`, `eslint`, `pnpm test` (44 tests) pass — checked 2026-10-22.
- [x] Release build on iPhone 18 Pro shows English text on Home, Profile, Settings.
- [x] Release build on iPhone Duo: fold closed → open, the onboarding glow fills the panel.

## Risk

Low. The i18n import only moves initialization earlier; `getLanguage()` reads MMKV
synchronously, which is already available at module scope.
