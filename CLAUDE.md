# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a production-ready React Native starter kit built with Expo, TypeScript, and modern tooling. It's designed for building high-quality mobile applications with a focus on developer experience, performance, and code maintainability.

**Key Technologies:**

- Expo SDK 57 with Custom Dev Client and New Architecture (always on from SDK 55+)
- React Native 0.86.2 with React 19
- Expo Router (file-based routing with typed routes enabled)
- React Compiler (experimental) - enabled in app.config.ts
- Uniwind (TailwindCSS for React Native)
- HeroUI Native (UI component library)
- React Query (react-query-kit) for data fetching
- Zustand for global state management
- React Native MMKV for secure storage
- React Hook Form + Zod for form handling and validation
- Space Grotesk fonts (`@expo-google-fonts/space-grotesk`, registered as `SpaceGrotesk-*` to match `src/themes/sky.css`)

## Canonical Documentation (SOURCE OF TRUTH)

**CRITICAL:** This project uses specialized UI and styling libraries with official AI documentation. Always consult these when working with components and styling:

- **Uniwind Documentation:** https://docs.uniwind.dev/llms-full.txt
- **HeroUI Native Documentation:** https://v3.heroui.com/native/llms-full.txt

**Mandatory Rules:**

1. Use HeroUI Native components whenever possible - DO NOT recreate components already provided
2. Use Uniwind exclusively for styling (TailwindCSS-like syntax)
3. DO NOT use web-only HeroUI components (this is React Native)
4. Follow documented APIs only - do not hallucinate props or components
5. If conflict occurs: follow HeroUI Native component behavior + Uniwind styling conventions

## Package Manager

**CRITICAL:** This project uses `pnpm` exclusively. The `preinstall` script enforces this. Always use `pnpm` for installing dependencies.

For new packages: `npx expo install <package-name>` (which will use pnpm internally)

## Development Commands

**Start Development Server:**

```bash
pnpm start                    # Development environment
pnpm start:staging            # Staging environment
pnpm start:production         # Production environment
```

**Run on Devices:**

```bash
pnpm ios                      # iOS development
pnpm android                  # Android development
pnpm ios:staging              # iOS staging
pnpm android:staging          # Android staging
```

**Prebuild (generate native projects):**

```bash
pnpm prebuild                 # Development environment
pnpm prebuild:staging         # Staging environment
pnpm prebuild:production      # Production environment
```

**Quality Checks:**

```bash
pnpm lint                     # Run ESLint
pnpm type-check               # TypeScript type checking
pnpm lint:translations        # Validate translation files
pnpm test                     # Run Jest tests
pnpm test:watch               # Run tests in watch mode
pnpm check-all                # Run all checks (lint + type-check + translations + test)
```

**E2E Testing:**

```bash
pnpm install-maestro          # Install Maestro CLI
pnpm e2e-test                 # Run E2E tests with Maestro
```

**Utilities:**

```bash
pnpm doctor                   # Run expo-doctor for health checks
pnpm xcode                    # Open Xcode workspace
```

## Code Architecture

### Multi-Environment Configuration

The project supports three environments (development, staging, production) through an environment variable system:

1. **Environment Variables:** Managed via `env.js` and `.env.{APP_ENV}` files
2. **Environment Selection:** Set via `APP_ENV` environment variable (defaults to development)
3. **Client vs Build-time Variables:**
   - Client variables are exposed to the app via `@env` import
   - Build-time variables are only available during build process in `app.config.ts`
4. **Environment Validation:** Uses Zod schemas to validate required variables at build time

**Environment-specific app identifiers:**

- The `withEnvSuffix()` function in `env.js` appends environment suffix to bundle IDs
- Example: `com.caracal` becomes `com.caracal.staging` for staging
- Production builds use the base identifier without suffix
- This allows installing different environment builds side-by-side on the same device

When adding new environment variables:

- Add to the appropriate schema in `env.js` (client or buildTime)
- Add the variable to the corresponding object (\_clientEnv or \_buildTimeEnv)
- Create/update the variable in all `.env.*` files (`.env.development`, `.env.staging`, `.env.production`)

### File-Based Routing with Expo Router

The app uses Expo Router with typed routes (enabled in app.config.ts):

- **Routes are defined in `src/app/`** directory using file-system conventions
- `onboarding.tsx` is the first-launch screen
- `(auth)` folder holds the signed-out screens (`login`, `sign-up`)
- `(home)` folder holds the signed-in `NativeTabs` (`index`, `profile`, `settings`)
- The root `_layout.tsx` picks the visible group with `Stack.Protected` guards from `getRouteGuards` (`src/lib/navigation/route-guards.ts`); auth is hydrated synchronously at module scope
- `_layout.tsx` files define layout hierarchies
- Route parameters are type-safe via generated types
- Use typed navigation: `import { router } from 'expo-router'` and `router.push('/(home)/settings')`

### Liquid glass

Glass building blocks live in `src/components/glass`: `GlassLayer` (native iOS 26 glass, blur on older iOS, translucent view on Android), `GlassSurface`, `AmbientBackground`, `ButtonGlass` / `InputGlass` / `ChipGlass` (for HeroUI `background` props) and `GlassListSection`. Do not put live glass inside list cells; feed cards use a flat translucent surface. See `docs/content/docs/ui-and-theme/liquid-glass.mdx`.

### State Management Architecture

**Global State (Zustand):**

- Auth state managed in `src/lib/auth/store.ts` (re-exported from `@/lib/auth`); accounts are local, stored in MMKV with salted SHA-256 password hashes (`src/lib/auth/accounts.ts`)
- Uses Zustand's native selector API for focused subscriptions
- Session (`userId`) persistence via MMKV storage
- Hydration happens synchronously at module scope in `src/app/_layout.tsx`

**Zustand selector pattern:**

```tsx
// Create a standard Zustand store
const useStore = create<StoreState>()((set) => ({
  // your store implementation
}));

// Usage in components - select only what you need
const token = useStore((state) => state.token);
const signIn = useStore((state) => state.signIn);
```

Focused selectors prevent components from re-rendering for unrelated state changes.

**Server State (React Query):**

- API calls in `src/api/` directory
- Uses `react-query-kit` for strongly typed queries and mutations
- Axios client configured in `src/api/common/client.tsx` with baseURL from env
- API Provider wraps the app in `src/api/common/api-provider.tsx`

### Storage Layer

Uses react-native-mmkv for synchronous, secure key-value storage:

- Wrapper utilities in `src/lib/storage.tsx`
- `getItem<T>`, `setItem<T>`, `removeItem` provide type-safe JSON serialization
- Used for persisting local accounts, the session, user preferences, etc.

### Provider Hierarchy

The app wraps components in this provider order (see `src/app/_layout.tsx`):

1. GestureHandlerRootView (gesture support)
2. KeyboardProvider (keyboard handling)
3. AppThemeProvider (theme management with system/light/dark modes)
4. HeroUINativeProvider (UI component context)
5. APIProvider (React Query setup)
6. BottomSheetModalProvider (bottom sheet modals)

### Form Handling Pattern

Forms use react-hook-form + zod + react-native-keyboard-controller:

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { ControlledInput, View } from '@/components/ui';
import { Button } from 'heroui-native';

const schema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormType = z.infer<typeof schema>;

export const MyForm = ({ onSubmit }: { onSubmit: SubmitHandler<FormType> }) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={10}>
      <View className="flex-1 p-4">
        <ControlledInput
          control={control}
          name="email"
          label="Email"
          testID="email-input"
        />
        <ControlledInput
          control={control}
          name="password"
          label="Password"
          secureTextEntry
          testID="password-input"
        />
        <Button onPress={handleSubmit(onSubmit)}>Submit</Button>
      </View>
    </KeyboardAvoidingView>
  );
};
```

**Key points:**

- `ControlledInput` is a wrapper around HeroUI Native's TextField component
- Always add `testID` props for testing
- Use `KeyboardAvoidingView` from react-native-keyboard-controller (not React Native)
- Error messages are automatically displayed from validation

### Internationalization (i18n)

- Translation files in `src/translations/` (JSON format)
- i18next with react-i18next integration
- ESLint validates translation files (identical keys, sorted keys, valid syntax)
- Translations are type-safe via custom TypeScript definitions

### Accessing Environment Variables

Client-side environment variables are accessed via `@env`:

```tsx
import { Env } from '@env';

// Access variables
const apiUrl = Env.API_URL;
const appName = Env.NAME;
```

**Important:**

- `@env` resolves to `src/lib/env.js` which re-exports client env from root `env.js`
- Only client-side env vars defined in the `client` schema are accessible
- Build-time variables are only available in `app.config.ts`

### SVG Icon Pattern

When creating SVG icon components, follow this pattern:

```tsx
import * as React from 'react';
import Svg, { Path, type SvgProps } from 'react-native-svg';

export function IconName({
  color = 'currentColor',
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="..."
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
```

- Place icon components in `src/components/ui/icons/`
- Export from `src/components/ui/icons/index.ts`
- Default size should be 24
- Support color customization via prop

## Code Standards (from .cursor/rules)

### File Organization

```
src/
  ├── api/          # API layer: axios client, react-query hooks, types
  ├── app/          # Expo Router screens and navigation (_layout.tsx files)
  ├── components/   # Shared components
  │   └── ui/       # Core UI components (buttons, inputs, etc.)
  ├── lib/          # Utilities: auth, env, hooks, i18n, storage, test-utils, utils
  ├── translations/ # i18n JSON files
  └── types/        # Shared TypeScript types
```

### Naming Conventions

- **Files and directories:** kebab-case (e.g., `visa-form.tsx`)
- **Components:** PascalCase, named exports preferred
- **Maximum 80 lines per component** - break into smaller pieces if longer
- **Variables:** descriptive names with auxiliary verbs (isLoading, hasError)

### TypeScript

- Use TypeScript for all code
- Prefer `type` over `interface`
- Avoid `enum` - use const objects with `as const` assertion
- Use absolute imports: `@/...` (configured in tsconfig.json)
- Define explicit return types for functions
- Avoid try/catch blocks unless necessary to handle errors at that abstraction level

### React Patterns

- Use functional components only (no classes)
- Use `function` keyword for pure functions
- Props defined at top of component file
- Avoid unnecessary re-renders with `useMemo` and `useCallback`
- Keep components focused on single responsibility

### Styling

- Use Uniwind (TailwindCSS) for all styling with `className` prop
- Use built-in components from `@/components/ui` (Button, Input, Text, View, Image, etc.)
- Use defined colors and fonts from tailwind config
- Note: Animated.View doesn't support `className`, use `style` prop instead

### ESLint Rules

Key enforced rules (see eslint.config.mjs):

- `max-params`: Maximum 3 parameters per function
- `max-lines-per-function`: Maximum 70 lines
- `unicorn/filename-case`: Enforce kebab-case filenames
- `simple-import-sort/imports`: Auto-sort imports
- `unused-imports/no-unused-imports`: Remove unused imports
- `@typescript-eslint/consistent-type-imports`: Use `import type` syntax

### Testing

- Jest + React Native Testing Library
- Test files: `component-name.test.tsx` (same location as component)
- Only test utilities and complex components (skip simple presentational components)
- Test patterns and setup utilities in `src/lib/test-utils.tsx`

**Running tests:**

```bash
pnpm test                              # Run all tests
pnpm test:watch                        # Watch mode
pnpm test <file-pattern>               # Run specific test file(s)
pnpm test component-name -- --coverage # Run with coverage for specific file
```

**Test structure:**

- Use `setup()` from test-utils for rendering with providers
- Use `cleanup()` after each test
- Group tests by functionality (Rendering, Interactions, State Management)
- Always add `testID` props to components for reliable selection
- Avoid testing implementation details

### Git Commit Messages

Use conventional commit format with lowercase:

- `feat:` - new features
- `fix:` - bug fixes
- `perf:` - performance improvements
- `docs:` - documentation changes
- `style:` - formatting changes
- `refactor:` - code refactoring
- `test:` - adding tests
- `chore:` - maintenance tasks

Maximum 100 characters for summary line.

## Common Patterns and Best Practices

### Creating Components from Designs

When implementing UI from designs or images:

1. **Layout Analysis:**
   - Identify main layout structure
   - List key UI components needed
   - Check if components from `@/components/ui` or HeroUI Native can be reused
   - Note spacing, alignment patterns

2. **Implementation:**
   - Use Uniwind for styling with `className` prop
   - Reuse components from `@/components/ui`
   - Use placeholder images from `@assets/images/placeholder.png`
   - Remember: `Animated.View` doesn't support `className`, use `style` prop

3. **Example component structure:**

```tsx
import * as React from 'react';
import { Text, View, Image } from '@/components/ui';

type ComponentProps = {
  title: string;
};

export function Component({ title }: ComponentProps) {
  return (
    <View className="flex-row items-center p-4">
      <Image
        source={require('@assets/images/placeholder.png')}
        style={{ width: 24, height: 24 }}
        contentFit="contain"
      />
      <Text className="ml-2 text-lg">{title}</Text>
    </View>
  );
}
```

### Using UI Components

**Built-in components from `@/components/ui`:**

- `View`, `Text`, `Image` - Basic building blocks with Uniwind support
- `ControlledInput` - Form input with react-hook-form integration
- `FocusAwareStatusBar` - Status bar that updates based on screen focus

**HeroUI Native components** (import from `heroui-native`):

- `Button`, `TextField`, `Card`, `Checkbox`, `Switch`, `Tabs`, `Dialog`, `Popover`, `Select`, etc.
- Always check HeroUI Native documentation for available props
- These components already have built-in styling and accessibility

## Important Implementation Notes

1. **Avoid over-engineering:** Only make requested changes. Don't add extra features, refactoring, or "improvements" unless explicitly asked.

2. **No unnecessary abstractions:** Don't create helpers or utilities for one-time operations. Three similar lines are better than premature abstraction.

3. **Minimal error handling:** Only validate at system boundaries (user input, external APIs). Trust internal code and framework guarantees.

4. **Delete unused code completely:** No backwards-compatibility hacks like `_unused` variables, re-exports, or `// removed` comments.

5. **Read before modifying:** Always read a file before proposing changes. Understand existing patterns.

6. **Component size:** Keep components under 80 lines. Break down larger components.

7. **React Compiler enabled:** The project uses React Compiler (experimental), so avoid manual memoization unless profiling shows it's needed.

8. **New Architecture:** Always enabled on Expo SDK 55+ — there is no `newArchEnabled` flag and it cannot be disabled. Only add libraries that support it.

9. **Import from correct packages:**
   - Use `@/components/ui` for basic components (View, Text, Image, ControlledInput)
   - Use `heroui-native` for UI components (Button, TextField, Card, etc.)
   - Use `react-native-keyboard-controller` for KeyboardAvoidingView (NOT react-native)
   - Environment variables: `import { Env } from '@env'`
