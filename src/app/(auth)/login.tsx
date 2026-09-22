import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui';

export default function LoginScreen() {
  const { t } = useTranslation();
  return <Text testID="login-screen">{t('auth.login.title')}</Text>;
}
