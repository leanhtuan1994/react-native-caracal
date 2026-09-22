import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui';

export default function ProfileScreen() {
  const { t } = useTranslation();
  return <Text testID="profile-screen">{t('profile.title')}</Text>;
}
