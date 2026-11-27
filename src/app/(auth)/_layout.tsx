import { Stack } from 'expo-router';

import { FocusedTransitionBoundary } from '@/components/focused-transition-boundary';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false }}
      screenLayout={({ children }) => (
        <FocusedTransitionBoundary>{children}</FocusedTransitionBoundary>
      )}
    />
  );
}
