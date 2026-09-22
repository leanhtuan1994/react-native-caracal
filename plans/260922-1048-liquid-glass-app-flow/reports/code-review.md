# Code review: feat/liquid-glass-app-flow vs main

Date: 2026-09-22 (Asia/Saigon)
Scope: `git diff main...HEAD -- src __mocks__ .maestro package.json` (97 files, +2912/-195)
Accepted decisions D1-D6 and non-goals were not re-litigated (local MMKV auth with salted SHA-256 is accepted demo scope).

## Overall assessment

No critical or high-severity defects. Auth state, route guards and hydration are coherent. Nothing logs a password: the only `console.error` is the existing one in `hydrate()` (`src/lib/auth/store.ts:35`), and it logs only a storage/parse error. The `useEffect` sign-out in `profile.tsx` does not loop (explained below). The real gaps are accessibility on inline text links and the terms checkbox, email whitespace validation, missing tests for `hydrate()`, and an E2E setup that only works with a dev client connected to Metro.

## Critical

None.

## High

None.

## Medium

### M1. Inline text links are hard or impossible to reach with VoiceOver or TalkBack (accessibility)

- `src/app/(auth)/login.tsx:29-38` (`login-create-account`)
- `src/app/(auth)/sign-up.tsx:46-55` (`sign-up-sign-in`)
- `src/components/auth/login-form.tsx:53-59` (`login-forgot`)
- `src/components/auth/terms-checkbox.tsx:35-41` (Terms and Privacy links)
- `src/components/home/feed-header.tsx:30-36` (`home-see-all`)

These are nested `<Text onPress>` elements with no `accessibilityRole`. A screen reader reads the parent `Text` as one element that has no `onPress`, so a double-tap does nothing.

- **Failure scenario:** a VoiceOver user signs out. Onboarding is one-time, so the login screen is now the only way to reach Create account. The user cannot activate "Create account", so they cannot create a second account.
- **Fix:** add `accessibilityRole="link"` to each nested pressable `Text`. iOS then lists these as links in the rotor. For the login and sign-up footers, a better option is a HeroUI `Button variant="ghost"` or a standalone pressable `Text` that is not nested, so it is a normal focus stop on both platforms.

### M2. The terms checkbox has no accessible name; the password toggle does not announce its state (accessibility)

- `src/components/auth/terms-checkbox.tsx:27-32`: VoiceOver reads only "checkbox, not checked". Nothing links it to the text beside it. **Fix:** pass `accessibilityLabel={t('auth.sign_up.terms_prefix') + ...}` or a short translated label such as "Accept terms and privacy policy".
- `src/components/ui/password-toggle.tsx:25-26`: the label is always `t('auth.password')`, whatever the state, so the user cannot tell whether the control will show or hide the password. **Fix:** use translated labels "Show password" / "Hide password" chosen by `isVisible`, or add `accessibilityState={{ checked: isVisible }}` and change the role to `switch`.

### M3. Email validation rejects a trailing space before any normalisation runs

`src/components/auth/schemas.ts:3-6`: the `email` schema runs `.email()` on the raw string. `normaliseEmail()` trims in `accounts.ts:24`, but it never gets the chance, because zod rejects first.

- **Failure scenario:** the iOS QuickType bar or autofill inserts `emily@example.com ` (with a trailing space). Sign in and Create account both show "Invalid email format" for a correct address. The user sees no difference on screen.
- **Fix:** `z.string().trim().min(1, ...).email(...)`. zod v3/v4 `.trim()` changes the parsed output, so the handlers receive the trimmed value.

### M4. `hydrate()` and sign-out behaviour have no tests

`src/lib/auth/index.test.tsx` covers `signIn`, login, sign-up and `useCurrentUser`. It does not cover `hydrate()` (`store.ts:25-39`), which decides the first screen on every cold start. It also does not cover `useSignOut` or the sign-out in `profile.tsx`.

- **Risk:** a regression in the orphaned-session branch (a session `userId` whose account is gone) would send users into `(home)` with a `null` user. `HomeHeader` would then show a blank name and avatar. CI would not catch it.
- **Fix:** add three cases using the existing mocks.
  1. No session → `status: 'signOut'`.
  2. Valid session with a known account → `signIn` with that `userId`.
  3. Session whose `getAccountById` returns `undefined` → `signOut`, and `removeItem('session')` is called.

### M5. The E2E flows only run against a dev client connected to Metro

`.maestro/utils/launch-app.yaml:7-28` runs `clearState` and then hard-codes `openLink: exp+caracalapp://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081`. It also waits for dev-menu controls (`Continue`, `xmark`).

- **Failure scenario:** in a release, preview or EAS build, or on a CI runner without Metro on 8081, every flow either fails or waits 30 s and then fails at `onboarding-get-started`. The `package.json` `e2e-test` script inherits this dependency.
- Smaller fragility in the same flows:
  - `dismiss-password-prompt.yaml` checks `visible: 'Not Now'` without waiting. If iOS shows the save-password sheet after the check, it covers `Home` and the 10 s wait fails.
  - Tabs are selected by English text (`'Profile'`, `'Settings'`, `'Home'`). This works only because `clearState` resets the language.
- **Fix:** put the dev-client handshake behind an env flag, for example `runFlow: when: true: ${IS_DEV_CLIENT}`, so the same flows run against a release build. Use `extendedWaitUntil` with a short optional timeout before the `Not Now` check. Where possible, target tabs by `id`.

## Low

### L1. The sign-out `useEffect` in `profile.tsx` is redundant, but it does not loop

`src/app/(home)/profile.tsx:17-21`. Why it does not loop:

- After `signOut()`, `status` changes to `'signOut'`. The `(home)` guard turns false and the screen unmounts.
- Even while it is still mounted, Zustand selectors for `status` and `userId` return the same values on a repeated `signOut`, so nothing re-renders.
- React Compiler keeps `useSignOut`'s closure stable, because `queryClient` is stable.

Side effects:

- If Profile has been visited and the user logs out from Settings, the effect runs again. `removeSession()` and `queryClient.clear()` then execute twice. This is harmless.
- `hydrate()` already handles orphaned sessions, and nothing can delete an account mid-session, so the effect is dead defensive code.
- The effect is inconsistent with `HomeHeader`, which renders blanks when the user is null.

**Fix:** delete the effect and keep `if (!user) return null;`. If a guard is wanted, put it in one place: the store or the `(home)` layout.

### L2. `createAccount` reads, then writes, with an `await` in between

`src/lib/auth/accounts.ts:44-58`: `accounts` is read and checked for duplicates before `await hashPassword(...)`, and written afterwards.

- **Scenario:** two submits land in the same frame, before `isSubmitting` disables the button. Both pass the duplicate check, and the second write drops the first account.
- The window is narrow, and `isDisabled={formState.isSubmitting}` covers normal taps.
- **Fix:** hash first, then run `getAccounts()`, the duplicate check and `setItem` together with no `await` between them.

### L3. `useCurrentUser` is not reactive and re-reads storage on every render

`src/lib/auth/use-current-user.ts:13-14` calls `getAccountById` on every render, which parses the full `accounts` JSON. Under React Compiler the result is effectively keyed on `userId`. It is correct today because accounts are never edited. Once Edit profile exists (D5 calls it "coming soon"), the value will go stale. No action is needed now. When editing lands, move the current account into the Zustand store.

### L4. Hard-coded copy

`src/app/onboarding.tsx:29` renders `Caracal` as a literal, not a translation. It is a brand name, but the project rule says all copy goes through i18n. Use `Env.NAME` (as `about-section.tsx` does) or a translation key.

### L5. The jest MMKV mock splits default-instance state

`__mocks__/react-native-mmkv.ts:35`: `createMMKV()` returns a new map on each call, while hooks called without a storage argument use a separate `defaultStorage`. At runtime, `useSelectedLanguage` (`useMMKVString(LOCAL)`, with no instance) and `storage` (`createMMKV()`) share the default MMKV id. In tests they do not. Any future test that changes language through the hook and reads it back through `getLanguage()` will be wrong. **Fix:** have `createMMKV()` with no id return `defaultStorage`.

### L6. Exports removed from `@/lib/auth`

`TokenType`, `getToken`, `setToken` and `removeToken` are removed. Nothing in the repo uses them (grep-verified), but projects built from this template that relied on them will break. This fits D1. Mention it in the changelog or release notes.

### L7. The login error hides unexpected failures

`src/components/auth/login-form.tsx:26-28` maps every error to "Email or password is incorrect", including `expo-crypto` failures. This is acceptable for the demo. Consider checking `AUTH_ERRORS.invalidCredentials`, as `sign-up-form.tsx` does, and showing a generic error for anything else.

## Checked with no issue found

- **Route guards** (`src/app/_layout.tsx:53-79`, `route-guards.ts`):
  - A signed-in state removes `(auth)` and `onboarding`.
  - Onboarding's `setIsFirstTime(false)` followed by `router.replace` works, because the replace is dispatched before the guard re-renders.
  - An `idle` status after a failed hydrate falls back to `(auth)`.
- **Passwords:** stored only as salted hashes. No password appears in logs, test output or snapshots. The unit test asserts the plain password is absent from storage.
- **Theme persistence:** `loadSelectedTheme()` validates the stored value before calling `Uniwind.setTheme`.
- **Language persistence:** i18n reads the same MMKV key at init.
- **FlashList with the search field in the header:** the header element type is stable, so the input keeps focus while typing.

## Recommended actions (priority order)

1. M1/M2: add `accessibilityRole="link"` or make the auth footers real buttons; label the checkbox and the password toggle.
2. M3: trim email before `.email()` in `schemas.ts`.
3. M4: add `hydrate()` unit tests.
4. M5: put the dev-client handshake in `launch-app.yaml` behind an env flag; wait before dismissing the password prompt.
5. L1/L2: drop the profile effect; reorder `createAccount` so there is no `await` between the read and the write.

## Unresolved questions

- Is running the Maestro suite in CI or against release builds in scope? If not, M5 drops to Low.

## Resolution (executor)

- Medium 1 (inline text links unreachable by VoiceOver): not changed. The iOS accessibility tree captured during the walkthroughs already exposes "Create an account", "Sign in", "Forgot password?", "See all", "Terms of Service" and "Privacy Policy" as `AXLink` elements, because pressable React Native `Text` gets the link trait.
- Medium 2: fixed. The terms checkbox has an accessibility label with the full terms sentence; the password toggle announces "Show password" / "Hide password" (new `auth.show_password` / `auth.hide_password` keys in both languages).
- Medium 3: fixed. The email schema trims before validating; a login-form test covers a trailing space.
- Medium 4: fixed. Three `hydrate()` tests cover an existing account, a session pointing to a missing account, and no session.
- Medium 5 (E2E needs the dev client and Metro): left as is. The plan's E2E target is the `pnpm ios` dev build; release/CI runs are a follow-up.
- Low items: left as is. The Profile fallback sign-out is part of the accepted plan (Task 6.6). The other items are either future-feature concerns (Edit profile, duplicate submits) or intentional template changes (token exports removed by decision D1).
