---
phase: 5
title: 'Auth screens: onboarding, sign in, create account'
status: done
priority: P1
effort: '1d'
dependencies: [2, 3, 4]
---

# Phase 5: Auth screens

## Goal

Onboarding, Sign in (including the validation-error state) and Create account match the
design canvas and work end to end with the local MMKV accounts from Phase 4: signing in or creating an account
lands on the Home tab, and the session survives an app restart.

## Design reference

Canvas https://claude.ai/artifact/MKsEuGPtzMUcKDUcib3ThE, top row: "Onboarding",
"Sign in", "Sign in — validation errors", "Create account". Layout per screen:

- **Onboarding**: brand mark + "Caracal" wordmark and a "Skip" glass pill (top row); a dark rounded panel with a 2×2 grid of glass tiles (Expo Router, HeroUI Native, React Query, Zustand + MMKV, each with icon, title, description); pager dots (first active); eyebrow, 32px title, description; bottom primary "Get started" and secondary glass "I already have an account".
- **Sign in**: brand mark + language pill (top row); "Welcome back" title + subtitle; a glass card holding Email field, Password field with show/hide eye and "Forgot password?" link on the label row, primary "Sign in"; footer "New to Caracal? Create an account".
- **Create account**: round glass back button; title + subtitle; glass card with Full name, Email, Password (+ hint), Confirm password, terms checkbox with inline links, primary "Create account"; footer "Already have an account? Sign in".

## Files to Create / Modify

- Create: `src/components/ui/controlled-input.tsx`, `src/components/ui/password-toggle.tsx`; modify `src/components/ui/index.tsx` (exports)
- Create: `src/lib/hooks/use-coming-soon.ts`; modify `src/lib/hooks/index.tsx`
- Create: `src/components/auth/schemas.ts`, `src/components/auth/auth-screen.tsx`, `src/components/auth/brand-mark.tsx`, `src/components/auth/language-pill.tsx`, `src/components/auth/login-form.tsx`, `src/components/auth/sign-up-form.tsx`, `src/components/auth/terms-checkbox.tsx`, `src/components/auth/index.ts`
- Create: `src/components/onboarding/feature-grid.tsx`, `src/components/onboarding/pager-dots.tsx`, `src/components/onboarding/index.ts`
- Create: `src/components/auth/login-form.test.tsx`, `src/components/auth/sign-up-form.test.tsx`
- Modify: `src/app/onboarding.tsx`, `src/app/(auth)/login.tsx`, `src/app/(auth)/sign-up.tsx`

## Key facts

- Before using a HeroUI component, read its doc: `node ~/.claude/skills/heroui-native/scripts/get_component_docs.mjs TextField Input InputGroup Label FieldError Button Checkbox Toast`. Use only props shown there.
- Icons: use `Ionicons` from `@expo/vector-icons/Ionicons` wrapped with `withUniwind` (same as `src/components/theme-toggle.tsx`). Names: `eye-outline`, `eye-off-outline`, `globe-outline`, `chevron-back`, `arrow-forward`, `folder-open-outline`, `grid-outline`, `sync-outline`, `server-outline`.
- Inputs sit inside a `GlassSurface` card, so inputs keep the default HeroUI field background (no `background` prop) — glass must not be stacked on glass.
- Glass pills/buttons (Skip, language pill, secondary buttons, back button): `Button variant="secondary" background={<ButtonGlass />}`. Primary buttons: `Button variant="primary"` with no glass.
- Zod messages are translation keys; render them with `t(message)`.
- Auth is local (decision D1): forms call `loginWithEmail(values)` / `signUpWithEmail(values)` from `@/lib/auth`. Both are async and throw `Error(AUTH_ERRORS.invalidCredentials)` / `Error(AUTH_ERRORS.emailTaken)`. Use react-hook-form's async `handleSubmit` and `formState.isSubmitting` for the pending state; do not add react-query for auth.
- After a successful call the store is signed in and the route guards (Phase 2) move the user to `(home)` automatically. Do not call `router.replace` after signing in.
- Every component file stays under 80 lines; split further if a file grows past that.
- Tests mock i18n with `jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))`, so assertions use translation keys.

## Tasks

### Task 5.1 — Coming-soon toast hook

- Target files: `src/lib/hooks/use-coming-soon.ts` (export `useComingSoon`), `src/lib/hooks/index.tsx`.
- Steps:
  1. Read the Toast doc (see Key facts) for the exact `useToast` return shape.
  2. Implement `useComingSoon(): () => void` that shows a toast with label `t('common.coming_soon')`.
  3. Export it from `src/lib/hooks/index.tsx`.
- Verify: `pnpm type-check` exits 0.

### Task 5.2 — ControlledInput and PasswordToggle

- Goal: one react-hook-form field built from HeroUI `TextField`, `Label`, `Input`/`InputGroup`, `Description`, `FieldError`.
- Target files: `src/components/ui/controlled-input.tsx` (export `ControlledInput`), `src/components/ui/password-toggle.tsx` (export `PasswordToggle`), `src/components/ui/index.tsx`.
- Steps:
  1. Props type:
     ```ts
     type ControlledInputProps<T extends FieldValues> = {
       control: Control<T>;
       name: Path<T>;
       label: string;
       testID: string;
       placeholder?: string;
       description?: string;
       isPassword?: boolean;
       labelAccessory?: React.ReactNode; // e.g. the "Forgot password?" link
     } & Pick<
       TextInputProps,
       'keyboardType' | 'autoComplete' | 'autoCapitalize' | 'textContentType'
     >;
     ```
  2. Use `useController({ control, name })`. Render `TextField isInvalid={!!fieldState.error}`; a row with `Label` and `labelAccessory`; then either `Input` (value, `onChangeText={field.onChange}`, `onBlur={field.onBlur}`, `testID`) or, when `isPassword`, `InputGroup` with `InputGroup.Input` (`secureTextEntry={!isVisible}`) and `InputGroup.Suffix` holding `PasswordToggle`.
  3. `PasswordToggle` props `{ isVisible: boolean; onToggle: () => void; testID: string }`; renders a `Pressable` (44×44 hit area) with `accessibilityRole="button"`, `accessibilityLabel` from `t('auth.password')`, and the `eye-outline` / `eye-off-outline` icon.
  4. Show `description` in `Description` when there is no error; show `t(fieldState.error.message)` in `FieldError`.
  5. Export both from `src/components/ui/index.tsx`.
- Success criteria: files under 80 lines each.
- Verify: `pnpm type-check` exits 0; `wc -l < src/components/ui/controlled-input.tsx` prints a number ≤ 80.

### Task 5.3 — Schemas (test first via the form tests in 5.6/5.7)

- Target files: `src/components/auth/schemas.ts` (exports `loginSchema`, `signUpSchema`, `LoginFormValues`, `SignUpFormValues`).
- Steps:
  1. Implement:

     ```ts
     import * as z from 'zod';

     const email = z
       .string()
       .min(1, 'auth.validation.email_required')
       .email('auth.validation.email_invalid');

     const password = z
       .string()
       .min(1, 'auth.validation.password_required')
       .min(6, 'auth.validation.password_min');

     export const loginSchema = z.object({ email, password });

     export const signUpSchema = z
       .object({
         fullName: z.string().trim().min(1, 'auth.validation.name_required'),
         email,
         password,
         confirmPassword: z
           .string()
           .min(1, 'auth.validation.password_required'),
         acceptTerms: z
           .boolean()
           .refine((value) => value, 'auth.validation.terms_required'),
       })
       .refine((values) => values.password === values.confirmPassword, {
         message: 'auth.validation.password_mismatch',
         path: ['confirmPassword'],
       });

     export type LoginFormValues = z.infer<typeof loginSchema>;
     export type SignUpFormValues = z.infer<typeof signUpSchema>;
     ```

- Verify: `pnpm type-check` exits 0.

### Task 5.4 — Shared auth pieces

- Target files: `src/components/auth/auth-screen.tsx`, `brand-mark.tsx`, `language-pill.tsx`, `terms-checkbox.tsx`, `src/components/onboarding/feature-grid.tsx`, `pager-dots.tsx`, the two `index.ts` barrels.
- Steps:
  1. `AuthScreen` (`PropsWithChildren<{ testID: string }>`): `AmbientBackground` behind a `KeyboardAwareScrollView` from `react-native-keyboard-controller` with `contentContainerClassName="grow px-6 pb-10"` and top padding from `useSafeAreaInsets().top + 16`; renders children.
  2. `BrandMark`: 38×38 `View className="size-[38px] items-center justify-center rounded-xl bg-foreground"` holding an `Svg` 22×22 with `Path d="M4 20 7 5l5 6 5-6 3 15z"` stroked in accent (read `useThemeColor('accent')` from `heroui-native`).
  3. `LanguagePill` (`testID` prop): `Button size="sm" variant="secondary" background={<ButtonGlass />}` showing a `globe-outline` icon and `t('common.language_short')`; on press call `setLanguage(language === 'vi' ? 'en' : 'vi')` from `useSelectedLanguage()` (`@/lib/i18n`). `accessibilityLabel` = `t('settings.language')`.
  4. `TermsCheckbox` (`{ control, testID }`): `Controller` for `acceptTerms` rendering HeroUI `Checkbox` (`isSelected`, `onSelectedChange`, `isInvalid`) plus text `t('auth.sign_up.terms_prefix')`, two tappable link texts (`t('settings.terms')`, `t('settings.privacy')`) joined by `t('auth.sign_up.and')` that call `useComingSoon()`, and `FieldError` with the translated error.
  5. `FeatureGrid`: dark rounded panel (`rounded-[30px] bg-foreground p-3.5`, dark mode keeps a dark panel via `dark:bg-surface`) with a 2×2 grid (`flex-row flex-wrap gap-2.5`, each tile `w-[48%]`) of `GlassSurface` tiles (`p-3.5 justify-between h-[118px] border-white/15`), each with an accent icon and title/description from `onboarding.features.*`.
  6. `PagerDots` (`{ count: number; activeIndex: number }`): active dot `w-6 h-1.5 rounded-full bg-foreground`, others `size-1.5 rounded-full bg-foreground/20`; `accessibilityElementsHidden`.
- Verify: `pnpm type-check` exits 0 and `pnpm lint` exits 0.

### Task 5.5 — Onboarding screen

- Target files: `src/app/onboarding.tsx`.
- Steps:
  1. Compose inside `AuthScreen testID="onboarding-screen"`: top row (`BrandMark` + "Caracal" text, `Button testID="onboarding-skip"` glass secondary `size="sm"` with `t('onboarding.skip')`); `FeatureGrid`; `PagerDots count={3} activeIndex={0}`; eyebrow (`text-accent-soft-foreground` or `text-accent` uppercase 13px), title (32px bold), description (muted); spacer `flex-1`; `Button testID="onboarding-get-started" variant="primary"` with `arrow-forward` icon; `Button testID="onboarding-have-account" variant="secondary" background={<ButtonGlass />}`.
  2. Handlers: Get started → `setIsFirstTime(false); router.replace('/sign-up')`. Skip and "I already have an account" → `setIsFirstTime(false); router.replace('/login')`.
- Verify: `pnpm type-check` exits 0; `grep -c "testID=\"onboarding-" src/app/onboarding.tsx` prints `4`.
- Execution note: the plan first said `3`, counting only the buttons; step 1 also requires the `onboarding-screen` container testID, so the correct count is 4 (kongming confirmed). The intro text moved to `src/components/onboarding/onboarding-intro.tsx` to keep the screen under 80 lines.

### Task 5.6 — Login form + screen (test first)

- Target files: `src/components/auth/login-form.tsx` (export `LoginForm`), `src/components/auth/login-form.test.tsx`, `src/app/(auth)/login.tsx`.
- Steps:
  1. Test first. Mock `react-i18next` (Key facts) and `@/lib/auth` with `loginWithEmail: mockLogin` (a `jest.fn()` resolving `undefined`), `AUTH_ERRORS: { invalidCredentials: 'invalid_credentials', emailTaken: 'email_taken' }`. Use `setup()` from `@/lib/test-utils`. Cases:
     - pressing `login-submit` with empty fields shows `auth.validation.email_required` and `auth.validation.password_required`;
     - typing `emily@` and `123` then submitting shows `auth.validation.email_invalid` and `auth.validation.password_min` (this is the "Sign in — validation errors" design state);
     - typing a valid email and `secret1` then submitting calls `mockLogin` with `{ email: 'emily@example.com', password: 'secret1' }`;
     - when `mockLogin` rejects with `new Error('invalid_credentials')`, submitting valid values shows `auth.login.error`.
  2. Run `pnpm test login-form` → must fail.
  3. Implement `LoginForm`: `useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })`; inside `GlassSurface className="gap-5 p-5"` render `ControlledInput` email (`testID="login-email-input"`, `keyboardType="email-address"`, `autoCapitalize="none"`, `autoComplete="email"`), `ControlledInput` password (`testID="login-password-input"`, `isPassword`, `labelAccessory` = pressable text `t('auth.login.forgot')` with `testID="login-forgot"` calling `useComingSoon()`), and `Button testID="login-submit" variant="primary" isDisabled={formState.isSubmitting}` → `handleSubmit(onSubmit)`. `onSubmit` is `async (values) => { try { await loginWithEmail(values); } catch { setError('root', { message: 'auth.login.error' }); } }`. Render the root error with `FieldError` (`testID="login-error"`) when present.
  4. `src/app/(auth)/login.tsx`: `AuthScreen testID="login-screen"`; top row `BrandMark` + `LanguagePill testID="login-language"`; title/subtitle; `LoginForm`; spacer; footer text with pressable `t('auth.login.create_account')` (`testID="login-create-account"`) → `router.push('/sign-up')`.
- Verify: step 2 exits non-zero (expected red). After step 3, `pnpm test login-form` exits 0 with 4 passing tests; `pnpm type-check` exits 0.

### Task 5.7 — Sign-up form + screen (test first)

- Target files: `src/components/auth/sign-up-form.tsx` (export `SignUpForm`), `src/components/auth/sign-up-form.test.tsx`, `src/app/(auth)/sign-up.tsx`.
- Steps:
  1. Test first with the same mocks (`signUpWithEmail: mockSignUp` instead of `loginWithEmail`). Cases:
     - different password and confirm → `auth.validation.password_mismatch`;
     - terms unchecked → `auth.validation.terms_required`;
     - all valid with terms checked → `mockSignUp` called with `{ fullName: 'Emily Johnson', email: 'e@x.com', password: 'secret1' }` (no `confirmPassword`, no `acceptTerms`);
     - when `mockSignUp` rejects with `new Error('email_taken')`, the email field shows `auth.sign_up.email_taken`.
  2. Run `pnpm test sign-up-form` → must fail.
  3. Implement `SignUpForm` in a `GlassSurface className="gap-4 p-5"`: `ControlledInput`s with testIDs `sign-up-name-input`, `sign-up-email-input`, `sign-up-password-input` (`isPassword`, `description={t('auth.sign_up.password_hint')}`), `sign-up-confirm-input` (`isPassword`); `TermsCheckbox testID="sign-up-terms"`; `Button testID="sign-up-submit" variant="primary" isDisabled={formState.isSubmitting}`. `onSubmit` maps to `{ fullName, email, password }` and awaits `signUpWithEmail(payload)`; on an error whose message is `AUTH_ERRORS.emailTaken` call `setError('email', { message: 'auth.sign_up.email_taken' })`, otherwise `setError('root', { message: 'auth.sign_up.error' })`.
  4. `src/app/(auth)/sign-up.tsx`: `AuthScreen testID="sign-up-screen"`; round glass back `Button isIconOnly testID="sign-up-back" accessibilityLabel={t('common.back')}` with `chevron-back` → `router.canGoBack() ? router.back() : router.replace('/login')`; title/subtitle; `SignUpForm`; footer with pressable `t('auth.sign_up.sign_in')` (`testID="sign-up-sign-in"`) → `router.replace('/login')`.
- Verify: step 2 exits non-zero (expected red). After step 3, `pnpm test sign-up-form` exits 0 with 4 passing tests; `pnpm type-check` exits 0.

### Task 5.8 — Simulator walkthrough (iOS 26)

- Goal: the real flow works and transitions do not flash.
- Steps (use the `argent-test-ui-flow` skill; take coordinates from `describe`, never from screenshots):
  1. `list-devices`; use the booted iOS 26 simulator (or boot one). Uninstall the app, then `pnpm ios` (track the Metro PID).
  2. Fresh launch: `describe` shows `onboarding-get-started`.
  3. Tap `onboarding-get-started` → `describe` shows `sign-up-submit`.
  4. Tap `sign-up-submit` with empty fields → `describe` shows the text "Full name is required".
  5. Fill name `Test User`, email `test.user@example.com`, password and confirm `secret1`, tick `sign-up-terms`, tap `sign-up-submit` → within 10 s (`await-ui-element` on text "Home") the tab bar is visible.
  6. `restart-app` → `describe` still shows the tab bar item "Home" (session persisted, no onboarding).
  7. Save screenshots of Onboarding (taken at step 2) and Create account (taken at step 4, showing the errors) into `plans/260922-1048-liquid-glass-app-flow/reports/screens/`. Sign in screenshots are taken in Phase 6 after Logout exists.
  8. Stop Metro (`kill <PID>`).
- Verify: steps 2, 3, 4, 5, 6 each find the named element or text; two screenshot files exist: `ls plans/260922-1048-liquid-glass-app-flow/reports/screens | wc -l` prints ≥ `2`.

### Task 5.9 — Phase gate and commit

- Steps: run `pnpm lint`, `pnpm type-check`, `pnpm test`; commit `git add -A && git commit -m "feat(auth): build onboarding, sign in and create account screens"`.
- Verify: all three exit 0; `git log -1 --pretty=%s` prints `feat(auth): build onboarding, sign in and create account screens`.

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

- Task 5.6 needed a global in-memory `__mocks__/react-native-mmkv.ts`: `src/lib/hooks` imports `react-native-mmkv` directly, and its native NitroModules do not exist in Jest (kongming's advice).
- Task 5.8 passed on iPhone 17 Pro Max (iOS 26.5): onboarding → Create account errors → account created → Home within 0.6 s → `restart-app` kept the session. Two simulator quirks matter for the Maestro flows in Phase 7: the simulator keyboard has a Vietnamese (Telex) input that rewrites typed text (use paste or an English-only keyboard), and iOS shows a "Use Strong Password?" sheet on the sign-up password field; closing it clears that field.
