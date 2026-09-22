# Glass spike (Phase 3, Task 3.5)

- Simulator: iPhone 17 Pro Max, iOS 26.5 (UDID 780D0F4A-2D23-45C4-8B9A-D1286D2AD490), fresh install of `com.caracal.development`.
- `isLiquidGlassAvailable()`: unknown (`require` is not available in the `debugger-evaluate` context). The device runs iOS 26.5, so the native branch of `GlassLayer` is expected.
- Elements: `debugger-component-tree` lists `spike-button` (tap 0.50, 0.43), `spike-input` (0.50, 0.49) and `spike-surface` (`GlassSurface`, 0.50, 0.57). `describe` lists `spike-button` (0.909 × 0.050) and `spike-input` (0.909 × 0.050); the surface is a plain view, so the accessibility tree shows only its text "Glass surface" (0.814 × 0.019).
- Rounded corners, no square glass edges: **yes** (checked on a full-resolution crop of the left edges of all three).
- Press feedback on the button: **yes**. While a touch was held down, the button frame shrank from width 0.909 to 0.899 and the fill darkened; it returned to 0.909 on release.
- Screenshots: `reports/glass-spike.png` (idle, full resolution) and `reports/glass-spike-pressed.png` (while pressed).

## Observation for later phases

The input with `InputGlass` renders as an almost opaque white pill over the light ambient
background, while the button and surface read as translucent. This does not fail the spike
(clipping and feedback are fine), but check the look of `SearchField.Input` with `InputGlass`
on the Home screen in Phase 6, in both light and dark mode.
