import { Tabs } from 'heroui-native';
import { useTranslation } from 'react-i18next';

import type { ThemeName } from '@/lib/contexts/app-theme-context';
import { useSelectedTheme } from '@/lib/hooks';

const THEMES: ThemeName[] = ['light', 'dark', 'system'];

export function ThemeSelector() {
  const { t } = useTranslation();
  const { selectedTheme, setSelectedTheme } = useSelectedTheme();

  return (
    <Tabs
      value={selectedTheme}
      onValueChange={(value) => setSelectedTheme(value as ThemeName)}
    >
      <Tabs.List>
        <Tabs.Indicator />
        {THEMES.map((theme) => (
          <Tabs.Trigger
            key={theme}
            value={theme}
            testID={`settings-theme-${theme}`}
            className="flex-1"
          >
            <Tabs.Label>{t(`settings.theme.${theme}`)}</Tabs.Label>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
