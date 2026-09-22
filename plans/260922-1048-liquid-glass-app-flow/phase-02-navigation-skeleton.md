---
phase: 2
title: 'Navigation skeleton with auth guards'
status: pending
priority: P1
effort: '3h'
dependencies: [1]
---

# Phase 2: Navigation skeleton with auth guards

## Goal

Routing matches the flow before any styling exists: first launch shows Onboarding, a
signed-out user sees the `(auth)` group (Sign in, Create account), a signed-in user sees
the `(home)` tabs (Home, Profile, Settings). Screens are minimal and get replaced in
phases 5 and 6.

## Files to Create / Modify

- Create: `src/lib/navigation/route-guards.ts`, `src/lib/navigation/route-guards.test.ts`
- Modify: `src/lib/index.tsx` (export navigation helpers)
- Modify: `src/app/_layout.tsx` (auth hydration and `Stack.Protected` groups)
- Create: `src/app/onboarding.tsx`
- Create: `src/app/(auth)/_layout.tsx`, `src/app/(auth)/login.tsx`, `src/app/(auth)/sign-up.tsx`
- Modify: `src/app/(home)/_layout.tsx` (add Profile tab, translated labels)
- Create: `src/app/(home)/profile.tsx`

## Key facts

- `useAuth` (`src/lib/auth/index.tsx`) reads MMKV **synchronously** in `hydrate()`. Call
  `hydrateAuth()` once at module scope in `src/app/_layout.tsx` (the commented line
  `//hydrateAuth();`). Do **not** put it in `useEffect` and do not add a loading spinner —
  that causes a route flash.
- `useIsFirstTime()` (`src/lib/hooks/use-is-first-time.tsx`) returns `[isFirstTime, setIsFirstTime]` and defaults to `true`.
- Guard rules: onboarding visible only when `isFirstTime`; `(auth)` visible when not signed
  in; `(home)` visible when signed in. Order screens onboarding → (auth) → (home) so the
  first allowed screen is the initial route.
- Files inside `src/app/` become routes. Never put test files under `src/app/`.

## Tasks

### Task 2.1 — Pure guard function with tests (test first)

- Goal: guard logic is a tested pure function.
- Target files: `src/lib/navigation/route-guards.ts` (export `getRouteGuards`), `src/lib/navigation/route-guards.test.ts`, `src/lib/index.tsx`.
- Steps:
  1. Write the test first:

     ```ts
     import { getRouteGuards } from './route-guards';

     describe('getRouteGuards', () => {
       it('shows onboarding on first launch', () => {
         expect(
           getRouteGuards({ isFirstTime: true, status: 'signOut' })
         ).toEqual({
           canSeeOnboarding: true,
           canSeeAuth: true,
           canSeeApp: false,
         });
       });
       it('shows auth when signed out after onboarding', () => {
         expect(
           getRouteGuards({ isFirstTime: false, status: 'signOut' })
         ).toEqual({
           canSeeOnboarding: false,
           canSeeAuth: true,
           canSeeApp: false,
         });
       });
       it('shows the app when signed in', () => {
         expect(
           getRouteGuards({ isFirstTime: false, status: 'signIn' })
         ).toEqual({
           canSeeOnboarding: false,
           canSeeAuth: false,
           canSeeApp: true,
         });
       });
       it('treats idle as signed out', () => {
         expect(
           getRouteGuards({ isFirstTime: false, status: 'idle' }).canSeeAuth
         ).toBe(true);
       });
     });
     ```

  2. Run `pnpm test route-guards` and confirm it fails (module missing).
  3. Implement:

     ```ts
     type AuthStatus = 'idle' | 'signOut' | 'signIn';

     type RouteGuardInput = { isFirstTime: boolean; status: AuthStatus };

     export type RouteGuards = {
       canSeeOnboarding: boolean;
       canSeeAuth: boolean;
       canSeeApp: boolean;
     };

     export function getRouteGuards({
       isFirstTime,
       status,
     }: RouteGuardInput): RouteGuards {
       const isSignedIn = status === 'signIn';
       return {
         canSeeOnboarding: isFirstTime,
         canSeeAuth: !isSignedIn,
         canSeeApp: isSignedIn,
       };
     }
     ```

  4. Add `export * from './navigation/route-guards';` to `src/lib/index.tsx`.

- Success criteria: four tests pass.
- Verify: step 2 — `pnpm test route-guards` exits non-zero (expected red; this is NOT a failure). After step 3 — `pnpm test route-guards` exits 0 and prints `4 passed`.

### Task 2.2 — Root layout: hydrate auth and protect route groups

- Goal: the root Stack chooses screens from the guards.
- Target files: `src/app/_layout.tsx` (module scope and `RootLayout`).
- Steps:
  1. Add imports: `import { hydrateAuth, useAuth } from '@/lib/auth';`, `import { useIsFirstTime } from '@/lib/hooks';`, `import { getRouteGuards } from '@/lib/navigation/route-guards';`.
  2. Replace the line `//hydrateAuth();` with `hydrateAuth();`.
  3. Keep the commented `unstable_settings` and SplashScreen lines untouched.
  4. In `RootLayout`, before the `if (!loaded)` check, read state (hooks must run before the early return):
     ```tsx
     const status = useAuth((state) => state.status);
     const [isFirstTime] = useIsFirstTime();
     const guards = getRouteGuards({ isFirstTime, status });
     ```
  5. Replace the `<Stack>` children with:
     ```tsx
     <Stack screenOptions={{ headerShown: false }}>
       <Stack.Protected guard={guards.canSeeOnboarding}>
         <Stack.Screen name="onboarding" />
       </Stack.Protected>
       <Stack.Protected guard={guards.canSeeAuth}>
         <Stack.Screen name="(auth)" />
       </Stack.Protected>
       <Stack.Protected guard={guards.canSeeApp}>
         <Stack.Screen name="(home)" />
       </Stack.Protected>
     </Stack>
     ```
- Success criteria: the file compiles; `hydrateAuth()` runs at module scope; no `useEffect` was added.
- Verify: `grep -c "^hydrateAuth();" src/app/_layout.tsx` prints `1`; `grep -c "Stack.Protected guard" src/app/_layout.tsx` prints `3`; `grep -c "useEffect" src/app/_layout.tsx` prints `0`. (Type-check runs in Task 2.5.)

### Task 2.3 — Create onboarding and auth route files

- Goal: every guarded route exists with a minimal real screen.
- Target files: `src/app/onboarding.tsx`, `src/app/(auth)/_layout.tsx`, `src/app/(auth)/login.tsx`, `src/app/(auth)/sign-up.tsx`.
- Steps:
  1. `src/app/(auth)/_layout.tsx`:

     ```tsx
     import { Stack } from 'expo-router';

     export default function AuthLayout() {
       return <Stack screenOptions={{ headerShown: false }} />;
     }
     ```

  2. `src/app/onboarding.tsx`: default-export `OnboardingScreen` rendering a `View` with `className="flex-1 items-center justify-center bg-background"` and a HeroUI `Button` (`testID="onboarding-get-started"`) whose `onPress` runs `setIsFirstTime(false)` then `router.replace('/sign-up')`. Label: `t('onboarding.get_started')`. Import `router` from `expo-router`, `useIsFirstTime` from `@/lib/hooks`, `useTranslation` from `react-i18next`.
  3. `src/app/(auth)/login.tsx`: default-export `LoginScreen` rendering `Text` from `@/components/ui` with `t('auth.login.title')` and `testID="login-screen"`.
  4. `src/app/(auth)/sign-up.tsx`: default-export `SignUpScreen` rendering `Text` with `t('auth.sign_up.title')` and `testID="sign-up-screen"`.

- Success criteria: four files exist and use translation keys from Phase 1.
- Verify: `ls src/app/onboarding.tsx "src/app/(auth)/_layout.tsx" "src/app/(auth)/login.tsx" "src/app/(auth)/sign-up.tsx"` exits 0.

### Task 2.4 — Tabs: add Profile and translate labels

- Goal: NativeTabs shows Home, Profile, Settings.
- Target files: `src/app/(home)/_layout.tsx`, create `src/app/(home)/profile.tsx`.
- Steps:
  1. `src/app/(home)/profile.tsx`: default-export `ProfileScreen` rendering `Text` with `t('profile.title')` and `testID="profile-screen"`.
  2. In `src/app/(home)/_layout.tsx`, call `const { t } = useTranslation();` and render three triggers in this order:
     - `name="index"`, label `t('tabs.home')`, icon `sf={{ default: 'house', selected: 'house.fill' }}` `md="home"`.
     - `name="profile"`, label `t('tabs.profile')`, icon `sf={{ default: 'person', selected: 'person.fill' }}` `md="person"`.
     - `name="settings"`, label `t('tabs.settings')`, icon `sf="gear"` `md="settings"`.
  3. Keep the existing `NativeTabs.Trigger.Label` / `NativeTabs.Trigger.Icon` child structure.
- Success criteria: three triggers, translated labels.
- Verify: `grep -c "NativeTabs.Trigger name=" "src/app/(home)/_layout.tsx"` prints `3`.

### Task 2.5 — Regenerate typed routes and type-check

- Goal: typed routes know `/onboarding`, `/login`, `/sign-up`, `/profile`.
- Steps:
  1. Check nothing is on the Metro port: `lsof -i :8081`. If a process from this project is listed, stop it (`kill <PID>`); if it belongs to something else, STOP and report.
  2. Start Metro in the background to generate route types: `CI=1 pnpm start` (run it as a background process and note its PID).
  3. Wait until `grep -c "/sign-up" .expo/types/router.d.ts` prints a number ≥ `1` (check every 5 seconds, give up after 90 seconds).
  4. Stop the Metro process you started (`kill <PID>`), then confirm `lsof -i :8081` prints nothing.
  5. Run `pnpm type-check` and `pnpm lint`.
- Success criteria: route types include the new routes and the project type-checks.
- Verify: `grep -c "/sign-up" .expo/types/router.d.ts` ≥ 1; `grep -c "/profile" .expo/types/router.d.ts` ≥ 1; `pnpm type-check` exits 0; `pnpm lint` exits 0; `lsof -i :8081` prints nothing.

### Task 2.6 — Phase gate and commit

- Steps:
  1. Run `pnpm test`.
  2. Commit: `git add -A && git commit -m "feat(nav): add onboarding, auth and tab route guards"`.
- Verify: `pnpm test` exits 0; `git log -1 --pretty=%s` prints `feat(nav): add onboarding, auth and tab route guards`.

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
