import { useTranslation } from 'react-i18next';
import { Share } from 'react-native';

import { GlassListSection } from '@/components/glass';
import { useComingSoon } from '@/lib/hooks';

import { SettingsRow } from './settings-row';

export function SupportSection() {
  const { t } = useTranslation();
  const showComingSoon = useComingSoon();

  return (
    <GlassListSection title={t('settings.support_us')}>
      <SettingsRow
        testID="settings-share"
        icon="share-outline"
        title={t('settings.share')}
        onPress={() => Share.share({ message: t('welcome') })}
      />
      <SettingsRow
        testID="settings-rate"
        icon="star-outline"
        title={t('settings.rate')}
        onPress={showComingSoon}
      />
      <SettingsRow
        testID="settings-support"
        icon="heart-outline"
        title={t('settings.support')}
        onPress={showComingSoon}
      />
    </GlassListSection>
  );
}
