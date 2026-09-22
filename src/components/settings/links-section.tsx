import { useTranslation } from 'react-i18next';

import { GlassListSection } from '@/components/glass';
import { useComingSoon } from '@/lib/hooks';

import { SettingsRow } from './settings-row';

const LINKS = [
  { id: 'privacy', icon: 'shield-checkmark-outline' },
  { id: 'terms', icon: 'document-text-outline' },
  { id: 'github', icon: 'logo-github' },
  { id: 'website', icon: 'globe-outline' },
] as const;

export function LinksSection() {
  const { t } = useTranslation();
  const showComingSoon = useComingSoon();

  return (
    <GlassListSection title={t('settings.links')}>
      {LINKS.map(({ id, icon }) => (
        <SettingsRow
          key={id}
          testID={`settings-${id}`}
          icon={icon}
          title={t(`settings.${id}`)}
          onPress={showComingSoon}
        />
      ))}
    </GlassListSection>
  );
}
