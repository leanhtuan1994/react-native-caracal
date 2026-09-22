---
phase: 1
title: 'Foundation: deps, fonts, radius, translations'
status: pending
priority: P1
effort: '3h'
dependencies: []
---

# Phase 1: Foundation

## Goal

The app runs on heroui-native 1.0.10 (which has the `background` prop and `GlassView`), renders
Space Grotesk, uses rounded radius tokens, and has every translation key later phases need.

## Files to Create / Modify

- Modify: `package.json`, `pnpm-lock.yaml` (via pnpm / expo install only)
- Modify: `src/app/_layout.tsx` (font loading only)
- Modify: `src/themes/sky.css` (`--radius`)
- Modify: `src/translations/en.json`, `src/translations/vi.json`

## Tasks

### Task 1.0 — Create the feature branch

- Goal: work happens off `main`.
- Target files: none.
- Steps:
  1. Run `git checkout -b feat/liquid-glass-app-flow`.
- Success criteria: current branch is `feat/liquid-glass-app-flow`.
- Verify: `git branch --show-current` prints exactly `feat/liquid-glass-app-flow`.

### Task 1.1 — Upgrade heroui-native to 1.0.10

- Goal: `background` props, `Button.Background` / `Input.Background` parts and `GlassView` exist.
- Target files: `package.json`.
- Steps:
  1. Run `pnpm add heroui-native@1.0.10`.
  2. Run `pnpm type-check`.
- Success criteria: dependency is pinned to 1.0.10 and the project still type-checks.
- Verify: `grep -c '"heroui-native": "1.0.10"' package.json` prints `1`, and `pnpm type-check` exits 0.

### Task 1.2 — Record the GlassView and background contracts

- Goal: later phases use the real prop names, not guesses (GlassView has no docs page).
- Target files: create `plans/260922-1048-liquid-glass-app-flow/reports/heroui-glass-contract.md`.
- Steps:
  1. Run `node -e "console.log(require.resolve('heroui-native/package.json'))"` to get the package folder.
  2. In that folder, search the type declarations: `grep -rn "GlassView" <folder>/lib/typescript | head -40` and `grep -rn "fallbackColor\|intensity" <folder>/lib/typescript | head -40`.
  3. Also check the exports: `node -e "const h=require('heroui-native');console.log(['GlassView','useIsGlassTheme','SearchField','ListGroup','Surface','Skeleton','useToast'].map(k=>k+':'+typeof h[k]).join('\n'))"`.
  4. Write the report: exact `GlassView` props (name, type), which of `GlassView`, `SearchField`, `ListGroup`, `Surface`, `Skeleton`, `useToast` are exported, and the `background` prop type on `Button`, `Input`, `Chip`, `Avatar`, `Checkbox`.
- Success criteria: the report lists GlassView props and every export as `function` or `object`.
- Verify: `test -f plans/260922-1048-liquid-glass-app-flow/reports/heroui-glass-contract.md` exits 0, and the export probe prints no line ending in `:undefined`.
- Execution note: steps 2–3 cannot run here (plain Node cannot load RN source; a user hook blocks `node_modules` reads). On kongming's advice the export check ran as a throwaway Jest test and the props were confirmed with a throwaway `tsc` probe; both probes were deleted. See the report.

### Task 1.3 — Load Space Grotesk under the names sky.css uses

- Goal: `--font-normal/medium/semibold/bold` in `src/themes/sky.css` (`SpaceGrotesk-Regular`, `SpaceGrotesk-Medium`, `SpaceGrotesk-SemiBold`, `SpaceGrotesk-Bold`) resolve to loaded fonts.
- Target files: `src/app/_layout.tsx` (imports and the `useFonts` call in `RootLayout`), `package.json`.
- Steps:
  1. Run `npx expo install @expo-google-fonts/space-grotesk`.
  2. Confirm the subpath exists: `node -e "require.resolve('@expo-google-fonts/space-grotesk/400Regular')"` exits 0.
  3. In `src/app/_layout.tsx`, replace the four `@expo-google-fonts/inter/*` imports with:
     ```tsx
     import { SpaceGrotesk_400Regular } from '@expo-google-fonts/space-grotesk/400Regular';
     import { SpaceGrotesk_500Medium } from '@expo-google-fonts/space-grotesk/500Medium';
     import { SpaceGrotesk_600SemiBold } from '@expo-google-fonts/space-grotesk/600SemiBold';
     import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk/700Bold';
     ```
  4. Replace the `useFonts({...})` argument with the remap (keys must match sky.css exactly):
     ```tsx
     const [loaded] = useFonts({
       'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
       'SpaceGrotesk-Medium': SpaceGrotesk_500Medium,
       'SpaceGrotesk-SemiBold': SpaceGrotesk_600SemiBold,
       'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
     });
     ```
  5. Keep the existing comment about importing weights by subpath.
  6. Run `grep -rn "expo-google-fonts/inter" src app.config.ts`. If it prints nothing, run `pnpm remove @expo-google-fonts/inter`.
- Success criteria: no Inter imports remain; the four font keys equal the sky.css names.
- Verify: `grep -c "SpaceGrotesk-" src/app/_layout.tsx` prints `4`; `grep -rn "expo-google-fonts/inter" src | wc -l` prints `0`; `pnpm type-check` exits 0.

### Task 1.4 — Raise the radius token

- Goal: HeroUI components render with the rounded glass shape from the design.
- Target files: `src/themes/sky.css` (every `--radius: 0.1rem;` line).
- Steps:
  1. Run `grep -n -- "--radius:" src/themes/sky.css` and note each line.
  2. Change every `--radius: 0.1rem;` to `--radius: 1rem;` (light and dark blocks).
- Success criteria: no `0.1rem` radius remains.
- Verify: `grep -c -- "--radius: 0.1rem" src/themes/sky.css` prints `0` and `grep -c -- "--radius: 1rem" src/themes/sky.css` prints a number ≥ `1`.

### Task 1.5 — Add all translation keys

- Goal: every string used in phases 2–6 exists in English and Vietnamese.
- Target files: `src/translations/en.json`, `src/translations/vi.json`.
- Steps:
  1. Keep every existing key. Merge the objects below into each file (merge into the existing `onboarding` and `settings` objects; add the other top-level objects).
  2. Keep keys sorted alphabetically at every level (the translation linter enforces it).
  3. Run `pnpm lint:translations` (it auto-fixes sort order), then re-run it to confirm it is clean.

  English additions for `src/translations/en.json`:

  ```json
  {
    "auth": {
      "email": "Email",
      "email_placeholder": "you@example.com",
      "login": {
        "create_account": "Create an account",
        "error": "Email or password is incorrect.",
        "forgot": "Forgot password?",
        "no_account": "New to Caracal?",
        "submit": "Sign in",
        "subtitle": "Sign in to continue to Caracal.",
        "title": "Welcome back"
      },
      "password": "Password",
      "password_placeholder": "At least 6 characters",
      "sign_up": {
        "and": "and",
        "confirm_password": "Confirm password",
        "confirm_placeholder": "Repeat your password",
        "email_taken": "An account with this email already exists.",
        "error": "Could not create your account. Please try again.",
        "full_name": "Full name",
        "full_name_placeholder": "Emily Johnson",
        "has_account": "Already have an account?",
        "password_hint": "At least 6 characters.",
        "password_placeholder": "Create a password",
        "sign_in": "Sign in",
        "submit": "Create account",
        "subtitle": "It takes less than a minute.",
        "terms_prefix": "I agree to the",
        "title": "Create account"
      },
      "validation": {
        "email_invalid": "Invalid email format",
        "email_required": "Email is required",
        "name_required": "Full name is required",
        "password_min": "Password must be at least 6 characters",
        "password_mismatch": "Passwords do not match",
        "password_required": "Password is required",
        "terms_required": "Please accept the terms to continue"
      }
    },
    "common": {
      "back": "Back",
      "coming_soon": "Coming soon",
      "language_short": "EN"
    },
    "home": {
      "all": "All",
      "empty": "No posts found.",
      "greeting_afternoon": "Good afternoon",
      "greeting_evening": "Good evening",
      "greeting_morning": "Good morning",
      "latest": "Latest posts",
      "notifications": "Notifications",
      "search_placeholder": "Search posts",
      "see_all": "See all",
      "voice_search": "Voice search"
    },
    "onboarding": {
      "description": "Routing, theming, data fetching and secure storage are wired up — start building features instead of setup.",
      "eyebrow": "Welcome to Caracal",
      "features": {
        "heroui_desc": "Styled with Uniwind",
        "heroui_title": "HeroUI Native",
        "query_desc": "Typed data fetching",
        "query_title": "React Query",
        "router_desc": "Typed, file-based routes",
        "router_title": "Expo Router",
        "storage_desc": "Fast, persisted state",
        "storage_title": "Zustand + MMKV"
      },
      "get_started": "Get started",
      "have_account": "I already have an account",
      "skip": "Skip",
      "title": "Everything your app needs, from day one."
    },
    "profile": {
      "account": "Account",
      "change_password": "Change password",
      "edit": "Edit profile",
      "email": "Email",
      "full_name": "Full name",
      "security": "Security",
      "sign_out": "Sign out",
      "title": "Profile",
      "username": "Username"
    },
    "tabs": {
      "home": "Home",
      "profile": "Profile",
      "settings": "Settings"
    }
  }
  ```

  Vietnamese additions for `src/translations/vi.json` (same keys):

  ```json
  {
    "auth": {
      "email": "Email",
      "email_placeholder": "ban@vidu.com",
      "login": {
        "create_account": "Tạo tài khoản",
        "error": "Email hoặc mật khẩu không đúng.",
        "forgot": "Quên mật khẩu?",
        "no_account": "Mới dùng Caracal?",
        "submit": "Đăng nhập",
        "subtitle": "Đăng nhập để tiếp tục với Caracal.",
        "title": "Chào mừng trở lại"
      },
      "password": "Mật khẩu",
      "password_placeholder": "Ít nhất 6 ký tự",
      "sign_up": {
        "and": "và",
        "confirm_password": "Xác nhận mật khẩu",
        "confirm_placeholder": "Nhập lại mật khẩu",
        "email_taken": "Email này đã có tài khoản.",
        "error": "Không thể tạo tài khoản. Vui lòng thử lại.",
        "full_name": "Họ và tên",
        "full_name_placeholder": "Nguyễn Văn A",
        "has_account": "Đã có tài khoản?",
        "password_hint": "Ít nhất 6 ký tự.",
        "password_placeholder": "Tạo mật khẩu",
        "sign_in": "Đăng nhập",
        "submit": "Tạo tài khoản",
        "subtitle": "Chỉ mất chưa đến một phút.",
        "terms_prefix": "Tôi đồng ý với",
        "title": "Tạo tài khoản"
      },
      "validation": {
        "email_invalid": "Email không hợp lệ",
        "email_required": "Vui lòng nhập email",
        "name_required": "Vui lòng nhập họ và tên",
        "password_min": "Mật khẩu phải có ít nhất 6 ký tự",
        "password_mismatch": "Mật khẩu không khớp",
        "password_required": "Vui lòng nhập mật khẩu",
        "terms_required": "Vui lòng đồng ý điều khoản để tiếp tục"
      }
    },
    "common": {
      "back": "Quay lại",
      "coming_soon": "Sắp ra mắt",
      "language_short": "VI"
    },
    "home": {
      "all": "Tất cả",
      "empty": "Không có bài viết nào.",
      "greeting_afternoon": "Chào buổi chiều",
      "greeting_evening": "Chào buổi tối",
      "greeting_morning": "Chào buổi sáng",
      "latest": "Bài viết mới nhất",
      "notifications": "Thông báo",
      "search_placeholder": "Tìm bài viết",
      "see_all": "Xem tất cả",
      "voice_search": "Tìm bằng giọng nói"
    },
    "onboarding": {
      "description": "Điều hướng, giao diện, tải dữ liệu và lưu trữ an toàn đã được cài sẵn — hãy tập trung xây tính năng.",
      "eyebrow": "Chào mừng đến với Caracal",
      "features": {
        "heroui_desc": "Tạo kiểu bằng Uniwind",
        "heroui_title": "HeroUI Native",
        "query_desc": "Tải dữ liệu có kiểu",
        "query_title": "React Query",
        "router_desc": "Điều hướng theo file, có kiểu",
        "router_title": "Expo Router",
        "storage_desc": "Trạng thái nhanh, được lưu lại",
        "storage_title": "Zustand + MMKV"
      },
      "get_started": "Bắt đầu",
      "have_account": "Tôi đã có tài khoản",
      "skip": "Bỏ qua",
      "title": "Mọi thứ ứng dụng cần, ngay từ ngày đầu."
    },
    "profile": {
      "account": "Tài khoản",
      "change_password": "Đổi mật khẩu",
      "edit": "Sửa hồ sơ",
      "email": "Email",
      "full_name": "Họ và tên",
      "security": "Bảo mật",
      "sign_out": "Đăng xuất",
      "title": "Hồ sơ",
      "username": "Tên đăng nhập"
    },
    "tabs": {
      "home": "Trang chủ",
      "profile": "Hồ sơ",
      "settings": "Cài đặt"
    }
  }
  ```

- Success criteria: both files parse, keep old keys, and contain the new keys.
- Verify: `pnpm lint:translations` exits 0; `node -e "const e=require('./src/translations/en.json'),v=require('./src/translations/vi.json');const k=o=>Object.entries(o).flatMap(([a,b])=>typeof b==='object'?k(b).map(x=>a+'.'+x):[a]);const a=k(e).sort().join(),b=k(v).sort().join();console.log(a===b?'KEYS_MATCH':'KEYS_DIFFER')"` prints `KEYS_MATCH`; `pnpm type-check` exits 0.

### Task 1.6 — Phase gate and commit

- Goal: the foundation is green and committed.
- Steps:
  1. Run `pnpm lint` and `pnpm test`.
  2. Commit: `git add -A && git commit -m "chore: upgrade heroui-native, load space grotesk, add flow translations"`.
- Success criteria: lint and tests pass; commit exists.
- Verify: `pnpm lint` exits 0; `pnpm test` exits 0; `git log -1 --pretty=%s` prints `chore: upgrade heroui-native, load space grotesk, add flow translations`.

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
