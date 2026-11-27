import { useIsFocused } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { SharedTransitionBoundary } from 'react-native-reanimated';

export function FocusedTransitionBoundary({ children }: PropsWithChildren) {
  const isFocused = useIsFocused();
  return (
    <SharedTransitionBoundary isActive={isFocused}>
      {children}
    </SharedTransitionBoundary>
  );
}
