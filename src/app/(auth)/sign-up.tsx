import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui';

export default function SignUpScreen() {
  const { t } = useTranslation();
  return <Text testID="sign-up-screen">{t('auth.sign_up.title')}</Text>;
}
