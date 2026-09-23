---
phase: 6
title: 'App screens: home, profile, settings'
status: done
priority: P1
effort: '1.5d'
dependencies: [2, 3, 4]
---

# Phase 6: App screens

## Goal

The three tabs match the design canvas (bottom row: "Home tab", "Profile tab",
"Settings tab", "Home tab — dark theme") with live data: a searchable, tag-filterable,
posts feed from local mock data; the signed-in user's profile; and working language, theme and logout
settings.

## Design reference

- **Home**: header row (Avatar with initials, greeting + full name, round glass bell button); glass search capsule (52px tall, 17px text, search icon, clear button, mic button); horizontal tag chips ("All" selected dark, others glass); "Latest posts" + "See all"; post cards (tags uppercase, title, 2-line body, likes and views pills). Tab bar floats over the list.
- **Profile**: large title; glass identity card (72px avatar, name, @username, "Edit profile" glass button); "Account" group (Full name, Username, Email rows with values); "Security" group (Change password with chevron, Sign out in red).
- **Settings**: large title; "General" group (Language row with current value and chevron; Theme row with a Light / Dark / System segmented control); "Support us" (Share, Rate, Support); "Links" (Privacy Policy, Terms of Service, Github, Website); "About" (App Name, Version); Logout button.

## Files to Create / Modify

- Create: `src/lib/hooks/use-debounced-value.ts` (+ `.test.ts`), `src/lib/greeting.ts` (+ `.test.ts`); modify `src/lib/hooks/index.tsx`, `src/lib/index.tsx`
- Create: `src/lib/auth/use-sign-out.ts`; modify `src/lib/auth/index.tsx` (re-export)
- Modify: `src/lib/contexts/app-theme-context.tsx`, `src/lib/hooks/use-selected-theme.tsx`, `src/app/_layout.tsx` (apply stored theme at start)
- Create: `src/components/glass/glass-list-section.tsx`; modify `src/components/glass/index.ts`
- Create: `src/components/home/home-header.tsx`, `post-search.tsx`, `tag-filter.tsx`, `post-card.tsx`, `post-empty-state.tsx`, `index.ts`
- Create: `src/components/profile/profile-identity.tsx`, `account-section.tsx`, `security-section.tsx`, `index.ts`
- Create: `src/components/settings/general-section.tsx`, `theme-selector.tsx`, `support-section.tsx`, `links-section.tsx`, `about-section.tsx`, `index.ts`
- Modify: `src/app/(home)/index.tsx`, `src/app/(home)/profile.tsx`, `src/app/(home)/settings.tsx`

## Key facts

- Read docs first: `node ~/.claude/skills/heroui-native/scripts/get_component_docs.mjs SearchField Chip Avatar Card ListGroup Tabs Button`. Use only documented props.
- Feed cards use a flat translucent surface (`bg-surface/60`), **not** `GlassLayer` (decision D4).
- Grouped lists use `GlassListSection` (Task 6.3): a `GlassSurface` wrapping `ListGroup variant="transparent"`.
- Every screen puts `AmbientBackground` first and uses `contentInsetAdjustmentBehavior="automatic"` on its scroll container so content clears the native tab bar.
- Posts come from `MOCK_POSTS` with `filterPosts` / `getPostTags` in `@/lib/posts` (Phase 4). No network, no loading or error states, no paging.
- Coming-soon controls (decision D5) call `useComingSoon()` from Phase 5.
- Uniwind supports adaptive themes: `Uniwind.setTheme('system')` follows the device; `useUniwind().theme` then reports the resolved theme. Confirm the `setTheme` parameter type accepts `'system'` with `pnpm type-check` in Task 6.2.

## Tasks

### Task 6.1 — Small pure helpers (test first)

- Target files: `src/lib/greeting.ts` (export `getGreetingKey(hour: number)`), `src/lib/greeting.test.ts`, `src/lib/hooks/use-debounced-value.ts` (export `useDebouncedValue<T>(value: T, delayMs = 300)`), `src/lib/hooks/use-debounced-value.test.ts`.
- Steps:
  1. Tests first:
     - `getGreetingKey(5)` → `'home.greeting_morning'`, `getGreetingKey(11)` → `'home.greeting_morning'`, `getGreetingKey(12)` → `'home.greeting_afternoon'`, `getGreetingKey(17)` → `'home.greeting_afternoon'`, `getGreetingKey(18)` → `'home.greeting_evening'`, `getGreetingKey(2)` → `'home.greeting_evening'`.
     - `useDebouncedValue` with `jest.useFakeTimers()` and `renderHook`: value changes from `'a'` to `'ab'`; before 300 ms the result is still `'a'`; after `act(() => jest.advanceTimersByTime(300))` it is `'ab'`.
  2. Run `pnpm test greeting use-debounced-value` → must fail.
  3. Implement: morning for hours 5–11, afternoon 12–17, evening otherwise. `useDebouncedValue` uses `useState` + `useEffect` with `setTimeout`/`clearTimeout`.
  4. Export the hook from `src/lib/hooks/index.tsx`; export `greeting` from `src/lib/index.tsx`.
- Verify: step 2 exits non-zero (expected red); after step 3, `pnpm test greeting use-debounced-value` exits 0 with all tests passing.

### Task 6.2 — Theme preference supports System and persists

- Goal: Settings can choose Light, Dark or System, and the choice survives restarts.
- Target files: `src/lib/contexts/app-theme-context.tsx` (`ThemeName`), `src/lib/hooks/use-selected-theme.tsx`, `src/app/_layout.tsx`.
- Steps:
  1. Change `export type ThemeName = 'light' | 'dark';` to `export type ThemeName = 'light' | 'dark' | 'system';`. `setTheme` already forwards to `Uniwind.setTheme`.
  2. In `use-selected-theme.tsx`, export `loadSelectedTheme()` that reads `storage.getString('SELECTED_THEME')` and, when it is `'light'`, `'dark'` or `'system'`, calls `Uniwind.setTheme(value)`.
  3. In `src/app/_layout.tsx`, call `loadSelectedTheme();` at module scope right after `hydrateAuth();`.
- Verify: `pnpm type-check` exits 0 (proves `Uniwind.setTheme` accepts `'system'`); `grep -c "^loadSelectedTheme();" src/app/_layout.tsx` prints `1`.

### Task 6.3 — GlassListSection and sign-out hook

- Target files: `src/components/glass/glass-list-section.tsx`, `src/components/glass/index.ts`, `src/lib/auth/use-sign-out.ts`, `src/lib/auth/index.tsx`.
- Steps:
  1. `GlassListSection` props `PropsWithChildren<{ title: string; testID?: string }>`: a `View className="gap-2"` with an uppercase 13px muted title (`px-2`) and `<GlassSurface><ListGroup variant="transparent">{children}</ListGroup></GlassSurface>`.
  2. `useSignOut()`:

     ```ts
     import { useQueryClient } from '@tanstack/react-query';

     import { signOut } from './store'; // not './index': index re-exports this file

     export function useSignOut(): () => void {
       const queryClient = useQueryClient();
       return () => {
         signOut();
         queryClient.clear();
       };
     }
     ```

- Verify: `pnpm type-check` exits 0.

### Task 6.4 — Home components

- Target files: `src/components/home/*.tsx`, `src/components/home/index.ts`.
- Steps:
  1. `HomeHeader`: `useCurrentUser()` from `@/lib/auth` for the name; HeroUI `Avatar` (`size="md"`, `color="accent"`) with `Avatar.Fallback` showing `user.initials` (no image — local accounts have none); greeting `t(getGreetingKey(new Date().getHours()))`; full name `user.fullName`; `Button isIconOnly testID="home-notifications" variant="secondary" background={<ButtonGlass />} accessibilityLabel={t('home.notifications')}` with `notifications-outline` → `useComingSoon()`.
  2. `PostSearch` (`{ value: string; onChange: (text: string) => void }`): `SearchField value onChange` → `SearchField.Group` → `SearchField.SearchIcon`, `SearchField.Input testID="home-search-input" placeholder={t('home.search_placeholder')} className="h-[52px] text-[17px]" background={<InputGlass />}`, `SearchField.ClearButton`; plus a trailing `Button isIconOnly size="sm" variant="ghost" testID="home-voice-search" accessibilityLabel={t('home.voice_search')}` with `mic-outline` → `useComingSoon()`. If `pnpm type-check` rejects `background` on `SearchField.Input`, remove that prop and wrap the whole `SearchField` in `<GlassSurface className="rounded-full">` instead (this fallback is part of the plan, not an improvisation).
  3. `TagFilter` (`{ value?: string; onChange: (tag?: string) => void }`): tags = `getPostTags(MOCK_POSTS)`; horizontal `ScrollView` (`showsHorizontalScrollIndicator={false}`, `contentContainerClassName="gap-2"`) of pressable HeroUI `Chip`s: "All" (`testID="home-tag-all"`) then the first 6 tags (`testID={\`home-tag-${tag}\`}`). Selected chip `variant="primary"`; others `variant="secondary" background={<ChipGlass />}`. If `Chip`is not pressable per its doc, wrap each in`Pressable`with`accessibilityRole="button"`and`accessibilityState={{ selected }}`.
  4. `PostCard` (`{ post: Post }`): HeroUI `Card testID={\`post-card-${post.id}\`} className="rounded-3xl border border-white/70 bg-surface/60 dark:border-white/10"`; `Card.Body`with tags joined by` · `(uppercase 12px muted),`Card.Title`, `Card.Description numberOfLines={2}`; `Card.Footer` with two small pills (`heart-outline`+`post.likes.toLocaleString()`, `eye-outline`+`post.views.toLocaleString()`).
  5. `PostEmptyState`: centred muted text `t('home.empty')` with `testID="home-empty"`.
- Verify: `pnpm type-check` exits 0; `pnpm lint` exits 0; every file in `src/components/home/` is ≤ 80 lines: `wc -l src/components/home/*.tsx | awk '$2!="total" && $1>80' | wc -l` prints `0`.

### Task 6.5 — Home screen

- Target files: `src/app/(home)/index.tsx`.
- Steps:
  1. State: `const [search, setSearch] = useState('')`, `const [tag, setTag] = useState<string>()`, `const query = useDebouncedValue(search)`.
  2. `const data = filterPosts(MOCK_POSTS, { query, tag });` (React Compiler memoises; no `useMemo`).
  3. Render `AmbientBackground` then `FlashList` (`testID="home-feed"`, `contentInsetAdjustmentBehavior="automatic"`, `contentContainerClassName="px-5 pb-32"`, `ItemSeparatorComponent` = `View className="h-3"`) with `ListHeaderComponent` holding `HomeHeader`, `PostSearch`, `TagFilter`, and the "Latest posts" row with a pressable `t('home.see_all')` (`testID="home-see-all"`, `useComingSoon()`); `renderItem` → `PostCard`; `ListEmptyComponent` → `PostEmptyState`.
- Verify: `pnpm type-check` exits 0; `wc -l < "src/app/(home)/index.tsx"` ≤ 80.

### Task 6.6 — Profile screen

- Target files: `src/components/profile/*.tsx`, `src/app/(home)/profile.tsx`.
- Steps:
  1. `ProfileIdentity` (`{ user: UserProfile }`, type from `@/lib/auth`): `GlassSurface className="gap-4 p-5"`; row with `Avatar size="lg" color="accent"` (`Avatar.Fallback` with `user.initials`), name (20px bold) and `@username` (muted); `Button testID="profile-edit" variant="secondary" background={<ButtonGlass />}` → `useComingSoon()`.
  2. `AccountSection` (`{ user: UserProfile }`): `GlassListSection title={t('profile.account')}` with three `ListGroup.Item`s (full name, username, email). Each item: `ListGroup.ItemContent` → `ListGroup.ItemTitle`; `ListGroup.ItemSuffix` with the value as muted text (children override the default chevron).
  3. `SecuritySection`: items "Change password" (`testID="profile-change-password"`, default chevron, `useComingSoon()`) and "Sign out" (`testID="profile-sign-out"`, title in `text-danger`, `onPress={useSignOut()}`).
  4. Screen: `AmbientBackground`; `ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName="gap-5 px-5 pb-32"`; large title `t('profile.title')`; `useCurrentUser()` (synchronous, from MMKV) → render the three sections; if it returns `null` (session points to a missing account) call `useSignOut()` once and render nothing.
- Verify: `pnpm type-check` exits 0; files ≤ 80 lines (same `wc -l` check on `src/components/profile/*.tsx`) prints `0`.

### Task 6.7 — Settings screen

- Target files: `src/components/settings/*.tsx`, `src/app/(home)/settings.tsx`.
- Steps:
  1. `ThemeSelector`: `const { selectedTheme, setSelectedTheme } = useSelectedTheme()`; HeroUI `Tabs value={selectedTheme} onValueChange={(v) => setSelectedTheme(v as ThemeName)}` → `Tabs.List` → `Tabs.Indicator` + three `Tabs.Trigger`s (`light`, `dark`, `system`, testIDs `settings-theme-light|dark|system`) with `Tabs.Label` from `settings.theme.*`. No `Tabs.Content`.
  2. `GeneralSection`: `GlassListSection title={t('settings.generale')}`; Language item (`testID="settings-language"`, prefix `globe-outline`, suffix value `t('settings.english')` or `t('settings.vietnamese')`) toggling `setLanguage(language === 'vi' ? 'en' : 'vi')`; a Theme item whose content is the `moon-outline` icon + `t('settings.theme.title')` with `ThemeSelector` below it (`ListGroup.Item` with `className="flex-col items-stretch gap-3"` and `disabled` press feedback off, or a plain `View` with matching padding if `ListGroup.Item` cannot stack vertically per its doc).
  3. `SupportSection`: Share (`testID="settings-share"`, `Share.share({ message: t('welcome') })` from `react-native`), Rate (`settings-rate`), Support (`settings-support`) — the last two `useComingSoon()`.
  4. `LinksSection`: display-only rows Privacy (`settings-privacy`), Terms (`settings-terms`), Github (`settings-github`), Website (`settings-website`); each press calls `useComingSoon()`. No URLs and no `Linking` (decision D5).
  5. `AboutSection`: App Name → `Env.NAME`, Version → `Env.VERSION` (import `Env` from `@env`), values as muted suffix text.
  6. Screen: `AmbientBackground`; `ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName="gap-6 px-5 pb-32"`; large title `t('settings.title')`; the five sections; `Button testID="settings-logout" variant="danger-soft"` with `log-out-outline` + `t('settings.logout')` → `useSignOut()`.
- Verify: `pnpm type-check` exits 0; `pnpm lint` exits 0; `wc -l src/components/settings/*.tsx | awk '$2!="total" && $1>80' | wc -l` prints `0`.

### Task 6.8 — Simulator walkthrough (iOS 26, light and dark)

- Steps (use `argent-test-ui-flow`; coordinates from `describe` only):
  1. Start the app (`pnpm ios`, track the PID). The session from Phase 5 (account `test.user@example.com` / `secret1`) should still be signed in; if the app shows Onboarding or Sign in, create that account again through Create account.
  2. Home: `await-ui-element` for `post-card-1` (visible). Type `mother` into `home-search-input` → `await-ui-element` finds `post-card-1` within 5 s. Replace the text with `zzzqqq` → `await-ui-element` finds the text "No posts found." within 5 s. Clear search, tap `home-tag-history` → `describe` shows at least one `post-card-` element.
  3. Clear the tag filter (tap `home-tag-all`) and scroll the feed down 3 times (`gesture-swipe`); `describe` shows `post-card-12`.
  4. Profile tab: `describe` shows the texts `Test User`, `test.user` and `test.user@example.com`.
  5. Settings tab: tap `settings-theme-dark` → screenshot; tap `settings-theme-light`; tap `settings-language` → `describe` shows the tab label "Trang chủ"; tap it again → "Home".
  6. `restart-app` → Settings theme and language still match the last choice.
  7. Tap `settings-logout` → `describe` shows `login-email-input`. Screenshot the Sign in screen.
  8. Tap `login-submit` with empty fields, then type `emily@` / `123` and submit → `describe` shows "Invalid email format" and "Password must be at least 6 characters". Screenshot (Sign in — validation errors).
  9. Enter `test.user@example.com` / `wrong12` → `describe` shows "Email or password is incorrect.".
  10. Enter `test.user@example.com` / `secret1` → `await-ui-element` finds text "Home" within 5 s.
  11. Save screenshots of Home (light), Home (dark), Profile, Settings to `plans/260922-1048-liquid-glass-app-flow/reports/screens/`. Stop Metro.
- Verify: each step finds its named element or text; `ls plans/260922-1048-liquid-glass-app-flow/reports/screens | wc -l` prints ≥ `8`.

### Task 6.9 — Phase gate and commit

- Steps: `pnpm lint`, `pnpm type-check`, `pnpm test`; commit `git add -A && git commit -m "feat(app): build home, profile and settings tabs with liquid glass"`.
- Verify: all exit 0; `git log -1 --pretty=%s` prints `feat(app): build home, profile and settings tabs with liquid glass`.

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

- `PostCard` uses `post.likes` (the Phase 4 `Post` type has flat `likes`/`views`; the earlier `post.reactions.likes` text was wrong).
- The Home list header moved into `src/components/home/feed-header.tsx` to keep the screen small; Settings rows share `src/components/settings/settings-row.tsx`.
- Walkthrough fixes (each verified on the simulator, kongming consulted where a Verify step failed):
  - `PostCard` gets `accessible` so each post is one VoiceOver element and its `post-card-*` id reaches the iOS accessibility tree (needed by `describe`, `await-ui-element` and Maestro).
  - `NativeTabs.Trigger` gets an explicit translated `accessibilityLabel`; without it the tab bar's visible labels switched language but VoiceOver kept the first language.
  - The feed list and the tag row use `keyboardShouldPersistTaps="handled"`; before this, the first tap on the search clear button or a tag chip only dismissed the keyboard.
- The dev-client "Tools" button overlaps the Home bell button in debug builds only.
