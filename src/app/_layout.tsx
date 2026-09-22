// Import  global CSS file
import '../../global.css';

// Import each weight by subpath, and take useFonts from expo-font directly.
// The package barrel pulls in every weight and italic it ships (18 files),
// and all of them end up in res/raw.
import { SpaceGrotesk_400Regular } from '@expo-google-fonts/space-grotesk/400Regular';
import { SpaceGrotesk_500Medium } from '@expo-google-fonts/space-grotesk/500Medium';
import { SpaceGrotesk_600SemiBold } from '@expo-google-fonts/space-grotesk/600SemiBold';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk/700Bold';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import React, { useCallback } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

import { APIProvider } from '@/api';
import { hydrateAuth, useAuth } from '@/lib/auth';
import { AppThemeProvider } from '@/lib/contexts/app-theme-context';
import { useIsFirstTime } from '@/lib/hooks';
import { getRouteGuards } from '@/lib/navigation/route-guards';

export { ErrorBoundary } from 'expo-router';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// export const unstable_settings = {
//   initialRouteName: '(home)',
// };

hydrateAuth();

// Prevent the splash screen from auto-hiding before asset loading is complete.
//SplashScreen.preventAutoHideAsync();
// Set the animation options. This is optional.
//  SplashScreen.setOptions({
//     duration: 500,
//   fade: true,
// });

export default function RootLayout() {
  const status = useAuth((state) => state.status);
  const [isFirstTime] = useIsFirstTime();
  const guards = getRouteGuards({ isFirstTime, status });
  const [loaded] = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Medium': SpaceGrotesk_500Medium,
    'SpaceGrotesk-SemiBold': SpaceGrotesk_600SemiBold,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
  });

  if (!loaded) {
    return null;
  }

  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={guards.canSeeOnboarding}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={guards.canSeeAuth}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={guards.canSeeApp}>
          <Stack.Screen name="(home)" />
        </Stack.Protected>
      </Stack>
    </Providers>
  );
}

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contentWrapper = useCallback(
    (children: React.ReactNode) => (
      <KeyboardAvoidingView
        pointerEvents="box-none"
        behavior="padding"
        keyboardVerticalOffset={12}
        className="flex-1"
      >
        {children}
      </KeyboardAvoidingView>
    ),
    []
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <KeyboardProvider>
        <AppThemeProvider>
          <HeroUINativeProvider
            config={{
              toast: {
                contentWrapper,
              },
            }}
          >
            <APIProvider>
              <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
            </APIProvider>
          </HeroUINativeProvider>
        </AppThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
