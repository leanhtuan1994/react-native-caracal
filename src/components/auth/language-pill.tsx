import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { GlassButton } from '@/components/glass';
import { useSelectedLanguage } from '@/lib/i18n';

const StyledIonicons = withUniwind(Ionicons);

export function LanguagePill({ testID }: { testID: string }) {
  const { t } = useTranslation();
  const { language, setLanguage } = useSelectedLanguage();

  return (
    <GlassButton
      testID={testID}
      size="sm"
      className="h-10 gap-1.5 px-3.5"
      accessibilityLabel={t('settings.language')}
      onPress={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
    >
      <StyledIonicons
        name="globe-outline"
        size={16}
        className="text-foreground"
      />
      <Button.Label className="font-medium text-sm text-foreground">
        {t('common.language_short')}
      </Button.Label>
    </GlassButton>
  );
}
