import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { GlassListSection } from '@/components/glass';
import { Text, View } from '@/components/ui';
import { useSelectedLanguage } from '@/lib/i18n';

import { SettingsRow } from './settings-row';
import { ThemeSelector } from './theme-selector';

const StyledIonicons = withUniwind(Ionicons);

export function GeneralSection() {
  const { t } = useTranslation();
  const { language, setLanguage } = useSelectedLanguage();

  return (
    <GlassListSection title={t('settings.generale')}>
      <SettingsRow
        testID="settings-language"
        icon="globe-outline"
        title={t('settings.language')}
        value={
          language === 'vi' ? t('settings.vietnamese') : t('settings.english')
        }
        onPress={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
      />
      <View className="gap-3 px-4 py-3">
        <View className="flex-row items-center gap-3">
          <StyledIonicons
            name="moon-outline"
            size={20}
            className="text-foreground"
          />
          <Text className="text-foreground">{t('settings.theme.title')}</Text>
        </View>
        <ThemeSelector />
      </View>
    </GlassListSection>
  );
}
