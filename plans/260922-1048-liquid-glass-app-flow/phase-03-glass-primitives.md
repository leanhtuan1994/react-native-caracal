---
phase: 3
title: 'Glass primitives and spike'
status: pending
priority: P1
effort: '5h'
dependencies: [1]
---

# Phase 3: Glass primitives and spike

## Goal

A small set of glass building blocks exists in `src/components/glass/`, and one spike on
the iOS 26 simulator proves that a glass layer inside a HeroUI `background` part clips to
the rounded shape and keeps press feedback, before any screen depends on it.

## Files to Create / Modify

- Create: `src/components/glass/glass-layer.tsx`
- Create: `src/components/glass/ambient-background.tsx`
- Create: `src/components/glass/glass-surface.tsx`
- Create: `src/components/glass/glass-backgrounds.tsx`
- Create: `src/components/glass/index.ts`
- Create: `src/components/glass/glass-layer.test.tsx`
- Temporary (reverted in Task 3.7): `src/app/onboarding.tsx`
- Create: `plans/260922-1048-liquid-glass-app-flow/reports/glass-spike.md`

## Key facts

- Read `plans/260922-1048-liquid-glass-app-flow/reports/heroui-glass-contract.md` (written in
  Task 1.2) before writing code. Use the exact `GlassView` prop names recorded there. If the
  report says `GlassView` has no `intensity` prop, use the prop it lists for blur strength.
- `expo-glass-effect` exports `GlassView` (props `glassEffectStyle: 'regular' | 'clear'`,
  `isInteractive`, `tintColor`) and `isLiquidGlassAvailable()`. It is already installed and
  already used in `src/components/theme-toggle.tsx`.
- HeroUI `background` props exist on `Button`, `Input`, `Chip`, `Avatar`, `Checkbox`
  (and `Tabs.List` via `Tabs.ListBackground`). `Card`, `Surface` and `ListGroup` have **no**
  `background` prop — that is a real API gap, not something to search for. For those, use
  `GlassSurface` (Task 3.3), which stacks a `GlassLayer` inside a transparent `Surface`.
- Do not also add a `bg-*` class on a HeroUI component that receives a glass `background`;
  the two layers fight.
- Feed cards (Phase 6) must not use `GlassLayer` (decision D4 in `plan.md`).

## Tasks

### Task 3.1 — GlassLayer with platform fallback (test first)

- Goal: one absolute-fill component that picks native glass, blur, or a translucent color.
- Target files: `src/components/glass/glass-layer.tsx` (export `GlassLayer`), `src/components/glass/glass-layer.test.tsx`.
- Steps:
  1. Write the test first. Mock both glass sources and `Platform`:

     ```tsx
     import { Platform } from 'react-native';

     import { render, screen } from '@/lib/test-utils';

     import { GlassLayer } from './glass-layer';

     const mockLiquid = jest.fn(() => false);
     jest.mock('expo-glass-effect', () => {
       const { View } = require('react-native');
       return {
         isLiquidGlassAvailable: () => mockLiquid(),
         GlassView: (props: object) => (
           <View testID="native-glass" {...props} />
         ),
       };
     });

     describe('GlassLayer', () => {
       afterEach(() => {
         Platform.OS = 'ios';
       });

       it('uses native glass when liquid glass is available on iOS', () => {
         Platform.OS = 'ios';
         mockLiquid.mockReturnValue(true);
         render(<GlassLayer />);
         expect(screen.getByTestId('native-glass')).toBeTruthy();
       });

       it('uses the translucent fallback on Android', () => {
         Platform.OS = 'android';
         mockLiquid.mockReturnValue(false);
         render(<GlassLayer />);
         expect(screen.getByTestId('glass-fallback')).toBeTruthy();
       });
     });
     ```

  2. Run `pnpm test glass-layer`; it must fail (module missing).
  3. Implement `glass-layer.tsx` (under 50 lines):
     - Props type `GlassLayerProps = { className?: string; isInteractive?: boolean }`.
     - `const StyledNativeGlass = withUniwind(NativeGlassView);` where `NativeGlassView` is `GlassView` from `expo-glass-effect`.
     - If `Platform.OS === 'ios' && isLiquidGlassAvailable()`: render `<StyledNativeGlass glassEffectStyle="regular" isInteractive={isInteractive} className={cn('absolute inset-0', className)} />`.
     - Else if `Platform.OS === 'ios'`: render HeroUI `GlassView` (import from `heroui-native`) with the blur-strength prop from the contract report set to `60` and `className={cn('absolute inset-0', className)}`.
     - Else: render `<View testID="glass-fallback" className={cn('absolute inset-0 bg-surface/70', className)} />`.
     - Import `cn` from `heroui-native`, `withUniwind` from `uniwind`.

- Success criteria: both tests pass.
- Verify: after step 2, `pnpm test glass-layer` exits non-zero (expected red). After step 3, `pnpm test glass-layer` exits 0 and prints `2 passed`.

### Task 3.2 — AmbientBackground

- Goal: the soft color blobs from the design sit behind every screen so glass has something to refract.
- Target files: `src/components/glass/ambient-background.tsx` (export `AmbientBackground`).
- Steps:
  1. Render `<View pointerEvents="none" className="absolute inset-0 bg-background">` containing an `Svg` (`width="100%" height="100%"`) from `react-native-svg`.
  2. Inside `<Defs>` define three `RadialGradient`s, each with two `Stop`s (offset `0` at the listed opacity, offset `1` at opacity `0`):
     | id | cx | cy | rx | ry | color | light opacity | dark opacity |
     |----|----|----|----|----|-------|---------------|--------------|
     | `ambient-azure` | `0%` | `0%` | `90%` | `45%` | `#25B9EE` | 0.40 | 0.30 |
     | `ambient-violet` | `100%` | `45%` | `70%` | `40%` | `#818CF8` | 0.32 | 0.26 |
     | `ambient-teal` | `20%` | `100%` | `90%` | `40%` | `#2DD4BF` | 0.30 | 0.20 |
  3. Render three `<Rect width="100%" height="100%" fill="url(#<id>)" />`.
  4. Read `isDark` from `useAppTheme()` (`@/lib/contexts/app-theme-context`) to pick the opacity column.
- Success criteria: component under 60 lines, no hard-coded background color (base comes from `bg-background`).
- Verify: `pnpm type-check` exits 0 and `grep -c "RadialGradient id=" src/components/glass/ambient-background.tsx` prints `3`.

### Task 3.3 — GlassSurface for Card/ListGroup-style containers

- Goal: a rounded glass container for components that lack a `background` prop.
- Target files: `src/components/glass/glass-surface.tsx` (export `GlassSurface`).
- Steps:
  1. Props: `PropsWithChildren<{ className?: string; testID?: string }>`.
  2. Render:
     ```tsx
     <Surface
       variant="transparent"
       testID={testID}
       className={cn(
         'overflow-hidden rounded-3xl border border-white/70 dark:border-white/10',
         className
       )}
     >
       <GlassLayer />
       {children}
     </Surface>
     ```
  3. Import `Surface` and `cn` from `heroui-native`.
- Success criteria: children render above the glass layer (glass is the first child).
- Verify: `pnpm type-check` exits 0.

### Task 3.4 — Background nodes for HeroUI components

- Goal: screens pass a ready glass node to HeroUI `background` props.
- Target files: `src/components/glass/glass-backgrounds.tsx`.
- Steps:
  1. Export three components, each returning the component's background part with a `GlassLayer` inside:
     ```tsx
     export function ButtonGlass() {
       return (
         <Button.Background>
           <GlassLayer isInteractive />
         </Button.Background>
       );
     }
     ```
     Same shape for `InputGlass` (`Input.Background`) and `ChipGlass` (`Chip.Background`). Use `isInteractive` only for Button and Chip.
  2. Create `src/components/glass/index.ts` exporting everything from the four component files (`glass-layer`, `ambient-background`, `glass-surface`, `glass-backgrounds`).
- Success criteria: all three exports compile.
- Verify: `pnpm type-check` exits 0 and `grep -c "^export function" src/components/glass/glass-backgrounds.tsx` prints `3`.

### Task 3.5 — Spike screen on the iOS 26 simulator

- Goal: prove clipping and press feedback before the rollout.
- Target files: `src/app/onboarding.tsx` (temporary content; Onboarding is the first screen on a fresh install, so no sign-in is needed).
- Steps:
  1. Replace the Onboarding screen body with: `AmbientBackground`; a `View className="flex-1 justify-center gap-4 px-5"` containing
     - `<Button testID="spike-button" variant="secondary" background={<ButtonGlass />}>Glass button</Button>`,
     - `<Input testID="spike-input" placeholder="Glass input" background={<InputGlass />} />`,
     - `<GlassSurface testID="spike-surface" className="p-5"><Text>Glass surface</Text></GlassSurface>`.
       (Spike copy is temporary and is deleted in Task 3.7, so hard-coded strings are allowed here only.)
  2. Follow the `argent-react-native-app-workflow` skill to build and run: `list-devices`, boot an iOS 26.x simulator, uninstall any previous build of the app so the install is fresh, then run `pnpm ios` (track the Metro process PID).
  3. Take a screenshot with `screenshot` and save it under `plans/260922-1048-liquid-glass-app-flow/reports/`.
  4. Run `describe` and find `spike-button`, `spike-input`, `spike-surface`.
  5. Tap `spike-button` with `gesture-tap` using the frame centre from `describe`.
  6. Connect the debugger (`debugger-connect`) and run `debugger-evaluate` on the expression `require('expo-glass-effect').isLiquidGlassAvailable()`; if `require` is not available in the evaluate context, record `unknown`.
  7. Write `reports/glass-spike.md` with: simulator iOS version, the `isLiquidGlassAvailable()` result, whether the corners of the button, input and surface look rounded with no square glass edges (yes/no), whether the button showed press feedback (yes/no), and the screenshot path.
- Success criteria: all three spike elements render with non-zero frames, glass stays inside rounded corners, the button reacts to the tap.
- Verify: `describe` output contains `spike-button`, `spike-input` and `spike-surface`, each with width > 0 and height > 0; `reports/glass-spike.md` exists and both yes/no answers are `yes`. If either answer is `no`, that is a Verify failure → Failure Protocol.

### Task 3.6 — Android fallback check (compile level)

- Goal: the Android branch cannot crash.
- Steps:
  1. Run `pnpm test glass-layer` again.
- Verify: exits 0 (the Android test case covers the fallback branch).

### Task 3.7 — Revert the spike and commit

- Goal: no spike code ships.
- Steps:
  1. Restore Onboarding: `git checkout -- src/app/onboarding.tsx`.
  2. Stop the Metro process started in Task 3.5 (`kill <PID>`); confirm `lsof -i :8081` prints nothing.
  3. Run `pnpm lint`, `pnpm type-check`, `pnpm test`.
  4. Commit: `git add -A && git commit -m "feat(ui): add liquid glass primitives"`.
- Verify: `git diff --stat HEAD~1 -- src/app/onboarding.tsx` prints nothing; lint, type-check and test exit 0; `git log -1 --pretty=%s` prints `feat(ui): add liquid glass primitives`.

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
