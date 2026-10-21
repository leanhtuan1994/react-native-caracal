import { useIsFocused } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';

import { useAppTheme } from '@/lib/contexts/app-theme-context';

type Props = { hidden?: boolean };

export const FocusAwareStatusBar = ({ hidden = false }: Props) => {
  const isFocused = useIsFocused();
  const { currentTheme } = useAppTheme();

  if (Platform.OS === 'web') return null;

  return isFocused ? (
    <StatusBar
      style={currentTheme === 'light' ? 'dark' : 'light'}
      hidden={hidden}
    />
  ) : null;
};
