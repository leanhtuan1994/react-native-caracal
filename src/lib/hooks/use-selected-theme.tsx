import React from 'react';
import { useMMKVString } from 'react-native-mmkv';
import { Uniwind } from 'uniwind';

import { type ThemeName, useAppTheme } from '../contexts/app-theme-context';
import { storage } from '../storage';

const SELECTED_THEME = 'SELECTED_THEME';

const THEME_NAMES: ThemeName[] = ['light', 'dark', 'system'];

export function loadSelectedTheme(): void {
  const value = storage.getString(SELECTED_THEME);
  if (value && THEME_NAMES.includes(value as ThemeName)) {
    Uniwind.setTheme(value as ThemeName);
  }
}

/**
 * this hooks should only be used while selecting the theme
 * This hooks will return the selected theme which is stored in MMKV
 * selectedTheme should be one of the following values 'light', 'dark'
 * don't use this hooks if you want to use it to style your component based on the theme use useAppTheme from uniwind instead
 *
 */
export const useSelectedTheme = () => {
  const { setTheme } = useAppTheme();

  const [theme, _setTheme] = useMMKVString(SELECTED_THEME, storage);

  const setSelectedTheme = React.useCallback(
    (t: ThemeName) => {
      setTheme(t);
      _setTheme(t);
    },
    [setTheme, _setTheme]
  );

  const selectedTheme = (theme ?? 'system') as ThemeName;
  return { selectedTheme, setSelectedTheme } as const;
};
