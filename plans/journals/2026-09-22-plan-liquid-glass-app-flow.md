---
title: Plan liquid glass app flow
date: 2026-09-22
summary: 'Seven-phase handover plan for the designed onboarding, auth and tabs flow with HeroUI Native and iOS 26 liquid glass'
---

# Plan liquid glass app flow

## What happened

Planned the implementation of the Starter App Flow design (onboarding, sign in, create account, Home/Profile/Settings tabs) as `plans/260922-1048-liquid-glass-app-flow/`, a seven-phase `--advice` handover plan with mechanical Verify steps and a per-phase Failure Protocol.

Findings from scouting:

- heroui-native 1.0.5 is installed; 1.0.7+ adds a `background` prop and `GlassView` on Button, Input, Chip, Avatar and Checkbox, but Card, Surface and ListGroup have no such prop, so a `GlassSurface` wrapper is needed.
- `src/themes/sky.css` names Space Grotesk font families that were never loaded (Inter is loaded), so all text currently falls back to the system font.
- dummyjson `auth/login` rejects an email as username; `users/filter?key=email` resolves the username. `users/add` does not persist users.
- The `.maestro` flows reference screens that no longer exist.

## Decision

- The user chose to keep the Email field and to auto sign in with the public demo account after Create account; the glass approach is native iOS 26 glass with blur/translucent fallbacks and NativeTabs kept.
- The advisor recommended building the navigation skeleton before styling, spiking glass on one component first, avoiding live blur in feed cells, and hydrating auth synchronously; all were adopted.

## Next steps

Run `/ak:cook plans/260922-1048-liquid-glass-app-flow/plan.md --advice`. Open questions: whether Profile should show the demo identity after sign-up, and real URLs for Privacy, Terms and Website.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
