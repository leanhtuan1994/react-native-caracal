import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import {
  AuthScreen,
  BrandMark,
  LanguagePill,
  LoginForm,
} from '@/components/auth';
import { Text, View } from '@/components/ui';

export default function LoginScreen() {
  const { t } = useTranslation();

  return (
    <AuthScreen testID="login-screen">
      <View className="flex-row items-center justify-between">
        <BrandMark />
        <LanguagePill testID="login-language" />
      </View>
      <View className="mt-8 mb-8 gap-2">
        <Text className="font-bold text-[32px] tracking-tight text-foreground">
          {t('auth.login.title')}
        </Text>
        <Text className="text-base text-muted">{t('auth.login.subtitle')}</Text>
      </View>
      <LoginForm />
      <View className="flex-1" />
      <Text className="mt-8 text-center text-[15px] text-muted">
        {t('auth.login.no_account')}{' '}
        <Text
          testID="login-create-account"
          className="font-semibold text-link"
          onPress={() => router.push('/sign-up')}
        >
          {t('auth.login.create_account')}
        </Text>
      </Text>
    </AuthScreen>
  );
}
