---
phase: 7
title: 'QA, E2E flows and docs'
status: in-progress
priority: P2
effort: '5h'
dependencies: [5, 6]
---

# Phase 7: QA, E2E flows and docs

## Goal

The whole flow is covered by Maestro E2E flows that pass on iOS, the Home feed scrolls
without slow React commits, every quality gate is green, and the docs describe the new
flow, local auth, glass components and fonts.

## Files to Create / Modify

- Modify: `.maestro/config.yaml`, `.maestro/auth/onboarding.yaml`, `.maestro/auth/login-with-validation.yaml`, `.maestro/app/tabs.yaml`, `.maestro/utils/onboarding.yaml`, `.maestro/utils/login.yaml`
- Delete: `.maestro/utils/onboarding-and-login.yaml`
- Create: `.maestro/auth/sign-up.yaml`, `.maestro/utils/create-account.yaml`, `.maestro/utils/logout.yaml`
- Delete: `.maestro/app/create-post.yaml` (the post-creation feature no longer exists)
- Modify: `package.json` (`e2e-test` script)
- Modify docs: `CLAUDE.md`, `docs/content/docs/guides/authentication.mdx`, `docs/content/docs/guides/navigation.mdx`, `docs/content/docs/guides/storage.mdx`, `docs/content/docs/ui-and-theme/fonts.mdx`, `docs/content/docs/ui-and-theme/custom-components.mdx`, `docs/content/docs/testing/end-to-end-testing.mdx`, `docs/content/docs/ui-and-theme/meta.json`
- Create docs: `docs/content/docs/ui-and-theme/liquid-glass.mdx`
- Create: `plans/260922-1048-liquid-glass-app-flow/reports/qa-summary.md`

## Key facts

- Maestro selects by `id:` (the React Native `testID`) or visible text. Use the testIDs defined in phases 5 and 6.
- The app id for development is `com.caracal.development`.
- Accounts are local (decision D1) and `clearState` wipes MMKV, so every flow that needs a signed-in user first creates one through `utils/create-account.yaml` with test values (`E2E User`, `e2e.user@example.com`, `secret1`). These are throwaway local test values, not credentials.
- Before editing a doc, read it; after editing, check every command and path it mentions against the code.

## Tasks

### Task 7.1 — E2E script and shared env

- Target files: `package.json` (`scripts.e2e-test`).
- Steps:
  1. Set the script to:
     `"e2e-test": "maestro test .maestro/ -e APP_ID=com.caracal.development -e NAME='E2E User' -e EMAIL=e2e.user@example.com -e PASSWORD=secret1"`
- Verify: `grep -c "e EMAIL=e2e.user@example.com" package.json` prints `1`.

### Task 7.2 — Rewrite Maestro utils

- Target files: `.maestro/utils/onboarding.yaml`, `.maestro/utils/login.yaml`, delete `.maestro/utils/onboarding-and-login.yaml`, new `.maestro/utils/create-account.yaml`, new `.maestro/utils/logout.yaml` (keep `tags: [util]` in each).
- Steps:
  1. `utils/onboarding.yaml`: assert `id: onboarding-get-started` visible, tap `id: onboarding-have-account`, assert `id: login-email-input` visible.
  2. `utils/create-account.yaml`: tap `id: onboarding-get-started`; tap and fill `sign-up-name-input` (`${NAME}`), `sign-up-email-input` (`${EMAIL}`), `sign-up-password-input` and `sign-up-confirm-input` (`${PASSWORD}`), running `hide-keyboard.yaml` after each; tap `id: sign-up-terms`; tap `id: sign-up-submit`; `extendedWaitUntil: { visible: 'Home', timeout: 10000 }`.
  3. `utils/logout.yaml`: tap text `Settings`; `scrollUntilVisible: { element: { id: settings-logout } }`; tap `id: settings-logout`; assert `id: login-email-input`.
  4. `utils/login.yaml`: tap `id: login-email-input`, `inputText: ${EMAIL}`, run `hide-keyboard.yaml`, tap `id: login-password-input`, `inputText: ${PASSWORD}`, run `hide-keyboard.yaml`, tap `id: login-submit`, `extendedWaitUntil: { visible: 'Home', timeout: 10000 }`.
  5. `utils/onboarding-and-login.yaml`: delete it (`git rm`); flows now create the account first.
- Verify: `grep -rn "Let's Get Started\|login-button\|Typography\|style-tab\|dummyjson" .maestro` prints nothing; `test -f .maestro/utils/create-account.yaml && test -f .maestro/utils/logout.yaml` exits 0.

### Task 7.3 — Rewrite Maestro flows

- Target files: `.maestro/auth/onboarding.yaml`, `.maestro/auth/login-with-validation.yaml`, `.maestro/auth/sign-up.yaml`, `.maestro/app/tabs.yaml`, `.maestro/config.yaml`; delete `.maestro/app/create-post.yaml`.
- Steps:
  1. `auth/onboarding.yaml`: `clearState`, `launchApp`, assert `Everything your app needs, from day one.`, tap `id: onboarding-have-account`, assert `id: login-email-input`.
  2. `auth/sign-up.yaml`: `clearState`, `launchApp`, run `utils/create-account.yaml`; tap text `Profile`; assert `${NAME}` and `${EMAIL}`.
  3. `auth/login-with-validation.yaml`: `clearState`, `launchApp`, run `utils/create-account.yaml`, run `utils/logout.yaml`; tap `id: login-submit`; assert `Email is required` and `Password is required`; tap `id: login-email-input`, `inputText: emily@`; tap `id: login-password-input`, `inputText: '123'`; hide keyboard; tap `id: login-submit`; assert `Invalid email format` and `Password must be at least 6 characters`; clear both fields (`eraseText`); enter `${EMAIL}` and `wrong12`; tap `id: login-submit`; assert `Email or password is incorrect.`; clear both fields; run `utils/login.yaml`.
  4. `app/tabs.yaml`: `clearState`, `launchApp`, run `utils/create-account.yaml`; assert `id: home-search-input`; tap text `Profile`; assert `${EMAIL}`; tap text `Settings`; tap `id: settings-theme-dark`; tap `id: settings-theme-light`; run `utils/logout.yaml`.
  5. `config.yaml`: keep `flows: [auth/*, app/*]` and `excludeTags: [util]`; set `flowsOrder` to `onboarding`, `sign-up`, `login-with-validation`, `tabs`.
  6. `git rm .maestro/app/create-post.yaml`.
- Verify: `ls .maestro/auth` prints exactly `login-with-validation.yaml onboarding.yaml sign-up.yaml`; `ls .maestro/app` prints exactly `tabs.yaml`.

### Task 7.4 — Run E2E on iOS

- Steps:
  1. `maestro --version`; if the command is missing, run `pnpm install-maestro` and re-check.
  2. Boot the iOS 26 simulator, run `pnpm ios` (track the Metro PID) and wait for the app to launch.
  3. Run `pnpm e2e-test`.
  4. Stop Metro when done.
- Verify: `pnpm e2e-test` exits 0 and its output shows the 4 flows passed.

### Task 7.5 — Feed performance check

- Goal: the Home feed does not produce slow React commits while scrolling (decision D4 check).
- Steps (use the `argent-react-native-profiler` skill):
  1. With the app signed in on Home, start the React profiler (`react-profiler-start`).
  2. Scroll the feed down 8 times and back up 4 times (`gesture-swipe`).
  3. Stop (`react-profiler-stop`) and run `react-profiler-analyze`.
  4. Write the slowest 3 commits (component, duration ms) into `reports/qa-summary.md` under "Feed profile".
- Verify: every commit listed in the analysis is under `100` ms. A commit ≥ 100 ms is a Verify failure → Failure Protocol.

### Task 7.6 — Full quality gate

- Steps:
  1. `pnpm check-all`.
  2. `npx expo install --check`.
- Verify: both exit 0.

### Task 7.7 — Docs

- Steps (read each file before editing; keep edits to what changed):
  1. `CLAUDE.md`: in "Key Technologies" note Space Grotesk fonts; in "File-Based Routing" replace the `(home)`/`(components)` bullets with `onboarding.tsx`, `(auth)` (login, sign-up) and `(home)` tabs (index, profile, settings) guarded by `Stack.Protected` using `getRouteGuards`; add a short "Liquid glass" subsection naming `src/components/glass` (`GlassLayer`, `GlassSurface`, `AmbientBackground`, `ButtonGlass`/`InputGlass`/`ChipGlass`, `GlassListSection`) and the rule "no live glass inside list cells".
  2. `docs/content/docs/ui-and-theme/liquid-glass.mdx`: new page — what the glass layers do per platform (iOS 26 native, older iOS blur, Android translucent), how to put glass into a HeroUI `background` prop, when to use `GlassSurface`, the list-cell rule; add `"liquid-glass"` after `"heroui-native"` in `docs/content/docs/ui-and-theme/meta.json`.
  3. `fonts.mdx`: Space Grotesk loading and the family-name remap to the `--font-*` variables in `src/themes/sky.css`.
  4. `custom-components.mdx`: update the ControlledInput section to the real props (`label`, `testID`, `description`, `isPassword`, `labelAccessory`, translated errors).
  5. `authentication.mdx`: local accounts in MMKV (`src/lib/auth/accounts.ts`: salted SHA-256 via `expo-crypto`, email uniqueness), `loginWithEmail` / `signUpWithEmail`, session `userId`, synchronous `hydrateAuth()`, route guards, `useCurrentUser`, `useSignOut`; state clearly that this is a local demo and a real app should swap in an API.
  6. `navigation.mdx`: the three guarded groups and NativeTabs with Profile.
  7. `storage.mdx`: the `accounts` and `session` MMKV keys and that passwords are stored only as salted hashes.
  8. `end-to-end-testing.mdx`: the four flows, the `create-account` / `logout` utils, and how `pnpm e2e-test` passes `NAME` / `EMAIL` / `PASSWORD` test values.
  9. Build the docs site: `pnpm --dir docs install --frozen-lockfile` then `pnpm --dir docs build`.
- Verify: `grep -c "liquid-glass" docs/content/docs/ui-and-theme/meta.json` prints `1`; `grep -rn "Inter_400Regular" CLAUDE.md docs/content` prints nothing; `pnpm --dir docs build` exits 0.

### Task 7.8 — QA summary and final commit

- Steps:
  1. Complete `reports/qa-summary.md`: E2E result, feed profile, check-all result, list of screenshot files in `reports/screens/`, and any deviations from the design with the reason (for example decisions D4 and D5).
  2. Commit: `git add -A && git commit -m "test(e2e): cover liquid glass app flow and update docs"`.
- Verify: `test -f plans/260922-1048-liquid-glass-app-flow/reports/qa-summary.md` exits 0; `git status --porcelain` prints nothing; `git log -1 --pretty=%s` prints `test(e2e): cover liquid glass app flow and update docs`.

## Failure Protocol

If any Verify step does not meet its stated pass condition, STOP this phase.
Do not improvise a fix, retry blindly, or reason around the failure.
Spawn the `kongming` subagent for next-step counsel and pass:

- the phase and task id,
- what you attempted (the steps you ran),
- the exact command and its full output,
- the pass condition it failed to meet.
  Apply kongming's guidance, then re-run the Verify step.
  If `kongming` cannot be spawned in this environment, STOP and report the same
  failure evidence to the user. Never continue by self-reasoning.

## Execution notes

- Task 7.4 passed (4/4 flows) on a spare iPhone 17 Pro simulator prepared with the user's approval (English-only keyboard, AutoFill Passwords off). Added `utils/launch-app.yaml` (dev-client reconnect after `clearState`) and `utils/dismiss-password-prompt.yaml`; Profile asserts use the new `profile-email` test id. `login-with-validation.yaml` finishes sign-in inline instead of calling `utils/login.yaml` (kongming's advice: `eraseText` cannot reliably clear a long email).
- Task 7.5 passed: 32 commits, none at or above 16 ms. No per-commit breakdown exists because the profiler keeps detail only for hot commits.
- Task 7.6 is **not green**: `pnpm check-all` passes, but `npx expo install --check` exits 1 on 16 upstream patch releases whose versions are identical on `main`. Following kongming's advice the bump is left for a separate `chore(deps)` change instead of widening this branch.
- Task 7.7: `pnpm --dir docs build` exits 0 (one earlier run failed on a transient Google Fonts download).
