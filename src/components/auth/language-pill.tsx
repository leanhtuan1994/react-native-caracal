import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { ButtonGlass } from '@/components/glass';
import { useSelectedLanguage } from '@/lib/i18n';

const StyledIonicons = withUniwind(Ionicons);

export function LanguagePill({ testID }: { testID: string }) {
  const { t } = useTranslation();
  const { language, setLanguage } = useSelectedLanguage();

  return (
    <Button
      testID={testID}
      size="sm"
      variant="secondary"
      background={<ButtonGlass />}
      accessibilityLabel={t('settings.language')}
      onPress={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
    >
      <StyledIonicons
        name="globe-outline"
        size={16}
        className="text-foreground"
      />
      <Button.Label>{t('common.language_short')}</Button.Label>
    </Button>
  );
}
