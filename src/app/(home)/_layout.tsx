import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTranslation } from 'react-i18next';

import { useAppTheme } from '@/lib/contexts/app-theme-context';

export default function TabLayout() {
  const { t } = useTranslation();
  const { isDark } = useAppTheme();

  return (
    <NativeTabs tintColor={isDark ? '#5fd0f7' : '#00709c'}>
      <NativeTabs.Trigger name="index" accessibilityLabel={t('tabs.home')}>
        <NativeTabs.Trigger.Label>{t('tabs.home')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md="home"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile" accessibilityLabel={t('tabs.profile')}>
        <NativeTabs.Trigger.Label>{t('tabs.profile')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person', selected: 'person.fill' }}
          md="person"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="settings"
        accessibilityLabel={t('tabs.settings')}
      >
        <NativeTabs.Trigger.Icon sf="gear" md="settings" />
        <NativeTabs.Trigger.Label>
          {t('tabs.settings')}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
