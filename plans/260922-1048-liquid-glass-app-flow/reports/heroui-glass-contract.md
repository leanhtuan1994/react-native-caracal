# heroui-native 1.0.10 glass and background contract

Resolved version: `pnpm ls heroui-native` prints `heroui-native 1.0.10`.

## How this was verified

- Plain `node -e "require('heroui-native')"` cannot work: the package entry is RN/ESM source
  that pulls in `react-native-worklets`, which fails in Node with `ERR_MODULE_NOT_FOUND`.
  Exports were checked instead with a throwaway Jest test (jest-expo transforms
  `heroui-native`), then the probe was deleted.
- Local `node_modules` reads are blocked by a user hook, so prop declarations were read from
  the published 1.0.10 package (unpkg) and then confirmed with a throwaway `tsc` probe in
  `src/` (typed assignments to every prop below), which type-checked and was deleted.

## Exports (Jest probe output)

| Export            | typeof   |
| ----------------- | -------- |
| `GlassView`       | object   |
| `useIsGlassTheme` | function |
| `SearchField`     | object   |
| `ListGroup`       | object   |
| `Surface`         | object   |
| `Skeleton`        | function |
| `useToast`        | function |

## `GlassView` props (`GlassViewProps extends ViewProps`)

| Prop                 | Type           | Notes                                                                |
| -------------------- | -------------- | -------------------------------------------------------------------- |
| `intensity`          | `number`       | iOS blur strength 0–100, default 25. This is the blur-strength prop. |
| `tint`               | `ExpoBlurTint` | iOS blur tint; defaults from color scheme.                           |
| `fallbackColor`      | `ThemeColor`   | Opaque fallback on Android/web, default `'overlay'`.                 |
| `forceFallbackColor` | `boolean`      | Force the fallback everywhere, default `false`.                      |
| `className`          | `string`       |                                                                      |

## `background` prop

Type is `React.ReactNode` on `Button`, `Input`, `Chip`, `Avatar`, `Checkbox` and
`SearchField.Input` (it inherits from `InputProps`). `undefined` uses the theme default
(none outside the glass theme), a node replaces the layer, and `null` removes it.
`Button.Background`, `Input.Background` and `Chip.Background` exist as sub-parts.

## Other facts for later phases

- `Chip` extends `PressableProps`, so it takes `onPress` directly.
