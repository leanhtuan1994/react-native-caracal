import { Env } from '@env';
import { useTranslation } from 'react-i18next';

import { GlassListSection } from '@/components/glass';

import { SettingsRow } from './settings-row';

export function AboutSection() {
  const { t } = useTranslation();

  return (
    <GlassListSection title={t('settings.about')}>
      <SettingsRow title={t('settings.app_name')} value={Env.NAME} />
      <SettingsRow title={t('settings.version')} value={Env.VERSION} />
    </GlassListSection>
  );
}
