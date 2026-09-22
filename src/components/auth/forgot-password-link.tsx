import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui';
import { useComingSoon } from '@/lib/hooks';

export function ForgotPasswordLink() {
  const { t } = useTranslation();
  const showComingSoon = useComingSoon();

  return (
    <Text
      testID="login-forgot"
      className="font-medium text-sm text-link"
      onPress={showComingSoon}
    >
      {t('auth.login.forgot')}
    </Text>
  );
}
