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
      <Tabs.List
        className="rounded-[22px] bg-foreground/5 p-1"
        background={null}
      >
        <Tabs.Indicator className="rounded-full bg-white/90 dark:bg-white/15" />
        {THEMES.map((theme) => (
          <Tabs.Trigger
            key={theme}
            value={theme}
            testID={`settings-theme-${theme}`}
            className="h-[38px] flex-1"
          >
            <Tabs.Label className="font-semibold text-sm">
              {t(`settings.theme.${theme}`)}
            </Tabs.Label>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
