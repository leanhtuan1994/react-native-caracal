---
title: 'Liquid glass starter app flow'
description: 'Implement the Onboarding → Sign in → Create account → Home/Profile/Settings flow from the Starter App Flow design, using HeroUI Native components and an iOS 26 liquid glass look.'
status: in-progress
priority: P1
effort: '4-5d'
branch: feat/liquid-glass-app-flow
tags: [expo-router, heroui-native, liquid-glass, auth, react-query, i18n]
created: 2026-09-22
---

# Liquid glass starter app flow

## Overview

Build the app flow shown in the design canvas "Starter App Flow"
(https://claude.ai/artifact/MKsEuGPtzMUcKDUcib3ThE): Onboarding, Sign in (with validation
errors), Create account, and a signed-in tab area with Home (posts feed), Profile and
Settings. Use HeroUI Native components wherever one exists, Uniwind for styling, and an
iOS 26 liquid glass look with platform fallbacks. The current app has only setup code
(empty Home and Settings screens, no auth routing), so screens and routing are rebuilt to
match the design.

This plan is written for handover to an executor model. Every phase file carries its own
tasks, success criteria, mechanical Verify steps and a Failure Protocol.

## Accepted decisions (do not reverse)

| #   | Decision                                                                                                                                                                                                                                                                                                            | Source         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| D1  | Auth is **local only**: Create account stores the account in MMKV (password salted + SHA-256 hashed with `expo-crypto`), Sign in checks email + password against stored accounts, and the session (`userId`) persists in MMKV. No auth API calls.                                                                   | User           |
| D2  | After **Create account** succeeds the user is signed in immediately with the new account; Profile shows that account (full name, username = email local part, email).                                                                                                                                               | User           |
| D3  | Glass: iOS 26 uses native liquid glass (`expo-glass-effect` `GlassView` when `isLiquidGlassAvailable()`); older iOS uses HeroUI `GlassView` (expo-blur); Android uses a translucent theme color. The tab bar stays `NativeTabs` (system glass on iOS 26).                                                           | User           |
| D4  | Feed post cards in the scrolling list use a **flat translucent surface**, not live blur, to avoid per-cell blur cost. Live glass is used on non-scrolling chrome (header controls, search field, forms, grouped lists, buttons).                                                                                    | Advisor        |
| D5  | Controls in the design without a destination (bell, voice search, Forgot password, Edit profile, Change password, Rate, Support, Privacy Policy, Terms of Service, Github, Website, See all) are displayed and show a "Coming soon" toast when tapped; no real links are opened. Share uses the native share sheet. | User + planner |
| D6  | Fonts switch from Inter to Space Grotesk (the family `src/themes/sky.css` already names); `--radius` increases to `1rem` for the rounded glass look.                                                                                                                                                                | Planner        |

## Phases

| #   | Phase                                                                           | Status  | Depends on |
| --- | ------------------------------------------------------------------------------- | ------- | ---------- |
| 1   | [Foundation: deps, fonts, radius, translations](./phase-01-foundation.md)       | Pending | —          |
| 2   | [Navigation skeleton with auth guards](./phase-02-navigation-skeleton.md)       | Pending | 1          |
| 3   | [Glass primitives and spike](./phase-03-glass-primitives.md)                    | Pending | 1          |
| 4   | [Local auth and mock posts data](./phase-04-local-auth-posts-data.md)           | Pending | 1          |
| 5   | [Auth screens: onboarding, sign in, create account](./phase-05-auth-screens.md) | Pending | 2, 3, 4    |
| 6   | [App screens: home, profile, settings](./phase-06-app-screens.md)               | Pending | 2, 3, 4    |
| 7   | [QA, E2E flows and docs](./phase-07-qa-e2e-docs.md)                             | Pending | 5, 6       |

Run phases in numeric order. Phases 3 and 4 do not depend on each other, but run them one
after another in a single session.

## Non-goals

- No custom JS tab bar; `NativeTabs` stays.
- No real password reset, profile edit, store rating, or legal pages (see D5).
- No network for this flow: accounts stay on the device and Home posts are bundled mock data (`src/lib/posts/mock-posts.ts`). The existing axios/react-query setup in `src/api/` stays as template scaffolding, unused by these screens.
- No MMKV encryption or account migration; passwords are only ever stored hashed.
- No web-specific glass work beyond what compiles.
- No paid `heroui-native-pro` glass theme.

## Global constraints (every phase)

- Package manager is `pnpm`; add Expo packages with `npx expo install <pkg>`.
- Files and folders use kebab-case. Components stay under 80 lines and functions under 70 lines (ESLint `max-lines-per-function`); at most 3 params per function.
- Use `type`, not `interface`, in new code. Use `import type` for type-only imports.
- Use HeroUI Native components (`Button`, `TextField`, `Label`, `Input`, `FieldError`, `SearchField`, `Chip`, `Avatar`, `Card`, `Surface`, `ListGroup`, `Tabs`, `Checkbox`, `Toast`) before writing a custom one.
- Every interactive element gets a `testID` (names listed in each phase).
- User-visible strings come from `src/translations/*.json` via `useTranslation()`; never hard-code copy.
- Do not print tokens or passwords in logs or test output.
- Commit after each phase with a conventional commit message (lowercase, ≤100 chars).

## Success criteria (whole plan)

- [ ] `pnpm check-all` exits 0.
- [ ] A fresh install on the iOS simulator walks Onboarding → Create account → Home → Profile (shows the new account) → Settings → Logout → Sign in with the same email and password → Home; a wrong password shows "Email or password is incorrect."
- [ ] Wrong email format and a short password show the two validation messages from the design.
- [ ] Theme switch Light / Dark / System and Language English / Vietnamese work from Settings and persist across app restarts.
- [ ] Maestro flows in `.maestro/` pass on iOS.

## Execution

```bash
/ak:cook plans/260922-1048-liquid-glass-app-flow/plan.md --advice
```

<!-- slug: liquid-glass-app-flow -->
