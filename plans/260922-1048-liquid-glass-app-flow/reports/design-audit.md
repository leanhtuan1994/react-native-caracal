# Design audit: app vs "Starter App Flow" canvas

Date: 2026-09-22. Source: canvas https://claude.ai/artifact/MKsEuGPtzMUcKDUcib3ThE (artboards Main, Login,
LoginErrors, SignUp, Home, HomeDark, Profile, Settings), compared with `src/themes/sky.css`, the
components on `feat/liquid-glass-app-flow`, and the QA screenshots in `reports/screens/`.

## 1. Color tokens (root cause of most visible differences)

| Role               | Design (light / dark)                     | App today (light / dark)        | Where it shows                                                                          |
| ------------------ | ----------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------- |
| Background         | `#eef3f6` / `#07090b`                     | `#f2f6f8` / `#040607`           | every screen (close)                                                                    |
| Text               | `#16191b` / `#fcfcfc`                     | `#16191a` / near-white          | ok                                                                                      |
| Secondary text     | `#4f5961` / `#a6afb4`                     | `--muted` `#6c7376` / `#9aa1a4` | light mode is too pale: subtitles, card bodies, section headers                         |
| Link / accent text | `#00709c` / `#5fd0f7`                     | `text-accent` `#00cbff`         | eyebrow, "Forgot password?", "See all", "Create an account", terms links look neon cyan |
| Primary fill       | `#25b9ee` at 90% with dark text `#0b1b22` | `--accent` `#00cbff`            | primary buttons are too saturated                                                       |
| Danger             | `#b3222a` / `#f0555b`                     | `#ff3448` / `#dc3847`           | error text and Sign out are too bright in light mode                                    |

## 2. Components

**Buttons**

- Secondary glass buttons (Skip, "I already have an account", Edit profile, language pill, back button) use dark text `#16191b` in the design; HeroUI `secondary` renders them with accent-colored text.
- Primary buttons: 54 px tall pill with an inner top highlight and a blue glow (`0 10px 24px rgba(37,185,238,0.35)`); the app uses the default HeroUI height and no glow.
- Logout (Settings) is a glass pill with red text and icon; the app uses HeroUI `danger-soft` (pink fill).

**Inputs**

- Design: rounded rectangle, radius 16 (not a pill), 52 px (48 px on Create account), fill `rgba(255,255,255,0.6)` with a white hairline border. App: fully pill-shaped white field.
- Sign in fields have leading icons (mail, lock); the app has none. Create account fields have no eye toggle in the design; the app adds one to both password fields.
- Focus: 2 px `#25b9ee` border plus a 4 px soft ring.
- Error: 2 px `#d12f36` border, pink fill `rgba(255,245,245,0.85)`, red icon, and a message in `#b3222a` 13 px with an alert-circle icon. The app uses HeroUI's default invalid state and no icon.

**Search (Home)**: one 52 px glass pill with the mic button inside it on the right. The app renders a white field with the mic as a separate button outside.

**Tag chips**: 36 px tall. Selected "All" is a dark `#16191b` pill with white text (white pill with dark text in dark mode). Unselected chips are white glass with dark text 14/500. The app shows the selected chip in accent cyan and unselected chips with cyan text.

**Avatars** (Home 44 px, Profile 72 px): gradient `#5fd0f7 → #25b9ee`, dark bold initials. The app shows HeroUI's grey avatar with cyan initials.

**Bell**: 44 px glass circle with a red unread dot `#e5484d`; the app has no dot.

**Post card**: radius 24, padding 18, tags 12/500 uppercase with 0.04em tracking, title 17/600, body 14 `#4f5961`, stat pills 28 px on white 60% with a white border and text `#3f4850`. The app's pills use the grey `default` fill. Counts should read "4,884" in English; the app formats with the device locale ("4.884").

**Checkbox (Create account)**: 20 px square checkbox tinted `#0a8fc2`; the app uses HeroUI's round checkbox.

**Onboarding**: the feature panel is `#0e1316` with blue and violet glows (radius 30, 280 px tall); tiles are radius 20 on white 8% with a 14% white border, icons `#5fd0f7`, descriptions `#b3bcc1`. The app uses a flat dark panel with no glows. Eyebrow: 13/600, 0.08em tracking, `#00709c`. Wordmark: 20/700.

**Grouped lists (Profile, Settings)**: 52 px rows, 15 px labels, values in `#4f5961`, dividers inset 18 px at `rgba(22,25,27,0.08)`. Security and Settings rows have leading stroke icons (lock, log-out, globe, share, star, heart, shield, document, GitHub, globe). Section headers are 13/600 with 0.06em tracking. The app's security rows have no icons, and headers use the paler muted color.

**Theme segmented control**: track `rgba(22,25,27,0.06)`, radius 22, padding 4; selected segment white 90% with a soft shadow, 38 px tall, 14/600.

**Titles**: Profile and Settings large titles are 30/700 with −0.025em tracking; the app uses 34 px.

## 3. Intentional differences (accepted plan decisions)

- Tab bar: the design draws a custom floating glass tab bar. The plan keeps `NativeTabs` (D3), so iOS draws its own glass bar. Its active tint can still use `#00709c` (today it is the system blue).
- Feed cards: the design uses live blur; the plan uses a flat translucent surface for scrolling performance (D4).
- Content: About shows `Env.NAME` ("CaracalApp") where the design shows "Caracal"; the profile shows the signed-in account instead of Emily Johnson.

## Resolution (2026-09-22)

Everything in sections 1 and 2 was fixed and checked on the iPhone 17 Pro Max simulator (iOS 26.5, light and dark); the new screenshots replace the old ones in `reports/screens/`.

- Tokens in `src/themes/sky.css` now use the design hexes; `global.css` maps `--link` to a `text-link` utility.
- New shared parts: `GlassButton` (glass pill, dark label), `PrimaryButton` (54 px, glow), `GradientAvatar`, `FieldErrorMessage` (icon + message), `InputPrefixIcon`, `PanelGlow`.
- `ControlledInput`: 52 px rounded-16 fields, optional leading icon, optional eye toggle (off on Create account, 48 px there), design error state, labels stay dark when invalid.
- Search is one glass pill with the mic inside; chips, post card pills, locale-aware numbers, bell dot, onboarding glows, square checkbox, grouped-list dividers and icons, 30 px titles, glass Logout, segmented theme control, and the tab bar tint (`#00709c` / `#5fd0f7`).
- Section 3 items stay as decided (NativeTabs, flat feed cards, real account data, `Env.NAME`).
