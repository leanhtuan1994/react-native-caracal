---
title: Cook liquid glass app flow
date: 2026-09-22
summary: Executed the 7-phase liquid glass plan with kongming supervision; all gates green except pre-existing expo patch drift.
---

# Cook liquid glass app flow

## What happened

Executed `plans/260922-1048-liquid-glass-app-flow` with `--advice` on `feat/liquid-glass-app-flow` (8 commits). Onboarding, local MMKV auth (salted SHA-256), route guards with `Stack.Protected`, glass primitives, Home/Profile/Settings tabs, 4 Maestro flows and docs. Every failed Verify went to kongming before any repair.

## Surprises worth remembering

- heroui-native 1.0.10 ships CSS that `prettier-plugin-tailwindcss` reads through `global.css`, so unrelated class lists got reordered.
- Jest: the Reanimated mock lacked Reanimated 4 `get`/`set` (HeroUI's toast provider needs them), and `react-native-mmkv` needs an in-memory mock because hooks import it directly.
- iOS accessibility: a plain HeroUI `Card` hides its testID (fixed with `accessible`); `NativeTabs` keeps first-language accessibility labels unless `accessibilityLabel` is passed; ScrollViews need `keyboardShouldPersistTaps="handled"` or the first tap only dismisses the keyboard.
- Simulator: the Vietnamese Telex keyboard rewrites typed text, and AutoFill shows password sheets. E2E ran on a spare simulator configured with the user's approval.
- Maestro with a dev-client build: `clearState` forgets the Metro server, so `utils/launch-app.yaml` reconnects through the `exp+caracalapp://expo-development-client` link. `eraseText` deletes from the tap point, so long values don't clear.

## Decision

`npx expo install --check` fails on 16 upstream patch releases that are identical on `main`. It was left for a separate `chore(deps)` change instead of widening this branch (kongming's advice).

## Next steps

- `chore(deps)`: run `npx expo install --fix`, rebuild, and rerun the E2E suite.
- Decide whether the Maestro suite should also run against release/CI builds.
- Close the plan once the dependency check is green.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
