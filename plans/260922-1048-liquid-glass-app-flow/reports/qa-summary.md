# QA summary: liquid glass app flow

Date: 2026-09-22. Branch `feat/liquid-glass-app-flow`.

## Results

| Check                                                   | Result                                                                                                                                                                                                                                                             |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm check-all` (lint, type-check, translations, Jest) | Pass. 0 lint errors (1 warning: `require` inside a `jest.mock` factory in `glass-layer.test.tsx`), 10 suites / 37 tests pass.                                                                                                                                      |
| `npx expo install --check`                              | **Fails (exit 1)**: 16 Expo packages have newer SDK 57 patch releases (for example `expo-router` 57.0.17 → ~57.0.22). Every listed version is identical on `main`, so this is upstream drift, not caused by this branch. Left for a separate `chore(deps)` change. |
| `pnpm e2e-test` (Maestro 2.9.0, iOS 26.5)               | Pass. 4/4 flows in 3m 19s: onboarding, sign-up, login-with-validation, tabs.                                                                                                                                                                                       |
| Feed profile (React profiler)                           | Pass. See below.                                                                                                                                                                                                                                                   |
| `pnpm --dir docs build`                                 | Pass (exit 0). One earlier run failed while downloading a Google font; the rerun succeeded.                                                                                                                                                                        |
| Manual walkthroughs (Phase 5 and 6)                     | Pass on iPhone 17 Pro Max, iOS 26.5.                                                                                                                                                                                                                               |

## E2E setup

The suite ran on a spare simulator (iPhone 17 Pro, iOS 26.5) set up with the user's approval: English-only keyboard, and AutoFill Passwords and Suggest Strong Passwords turned off. The main simulator was not changed. The flows target the Expo dev-client build (`pnpm ios`), so `.maestro/utils/launch-app.yaml` reconnects the dev client to Metro after `clearState` and closes the developer menu. These steps are documented in `docs/content/docs/testing/end-to-end-testing.mdx`.

`login-with-validation.yaml` finishes sign-in inline: the email field already holds the right value, and clearing a long email with `eraseText` left characters behind, because Maestro deletes from the tap position. `utils/login.yaml` is kept as a reusable util, but no flow calls it now.

## Feed profile

Home feed on the iPhone 17 Pro, dev build, 8 swipes down and 4 up over 28.8 s: 32 React commits, **0 commits at or above 16 ms** (the profiler's hot-commit floor), so every commit is far below the 100 ms limit. The profiler stores per-commit detail only for hot commits, so there is no "slowest three" breakdown; with none at or above 16 ms, there is nothing to list. The report showed React Compiler as not detected in this dev build; this was not investigated further.

## Screenshots (`reports/screens/`)

`onboarding.png`, `create-account-errors.png`, `sign-in.png`, `sign-in-validation-errors.png`, `home-light.png`, `home-dark.png`, `profile.png`, `settings.png`. Spike screenshots: `reports/glass-spike.png`, `reports/glass-spike-pressed.png`.

## Deviations from the design

- D4: feed cards use a flat translucent surface (`bg-surface/60`), not live glass, to keep scrolling cheap.
- D5: bell, voice search, See all, Forgot password, Edit profile, Change password, Rate, Support and the four link rows show a "Coming soon" toast; Share opens the native share sheet.
- In debug builds the Expo dev-client "Tools" button overlaps the Home bell button. Release builds do not have it.

## Fixes found during QA

- Post cards are `accessible`, so each post is one VoiceOver element and its `post-card-*` id is visible to tests.
- Tab triggers pass a translated `accessibilityLabel`; before this, VoiceOver kept the first language's tab names after a language switch.
- The feed list and tag row use `keyboardShouldPersistTaps="handled"`, so the search clear button and tag chips work on the first tap while the keyboard is open.
- Account rows on Profile have test ids (`profile-full-name`, `profile-username`, `profile-email`).
- Jest: the Reanimated mock gained `get`/`set`/`modify` on shared values, and an in-memory `react-native-mmkv` mock was added so components render in tests.
