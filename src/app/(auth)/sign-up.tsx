import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { AuthScreen, SignUpForm } from '@/components/auth';
import { GlassButton } from '@/components/glass';
import { Text, View } from '@/components/ui';

const StyledIonicons = withUniwind(Ionicons);

export default function SignUpScreen() {
  const { t } = useTranslation();

  const goBack = () =>
    router.canGoBack() ? router.back() : router.replace('/login');

  return (
    <AuthScreen testID="sign-up-screen">
      <GlassButton
        testID="sign-up-back"
        isIconOnly
        accessibilityLabel={t('common.back')}
        className="size-11 self-start"
        onPress={goBack}
      >
        <StyledIonicons
          name="chevron-back"
          size={20}
          className="text-foreground"
        />
      </GlassButton>
      <View className="my-[22px] gap-2">
        <Text className="font-bold text-[32px] tracking-tight text-foreground">
          {t('auth.sign_up.title')}
        </Text>
        <Text className="text-base text-muted">
          {t('auth.sign_up.subtitle')}
        </Text>
      </View>
      <SignUpForm />
      <View className="flex-1" />
      <Text className="mt-8 text-center text-[15px] text-muted">
        {t('auth.sign_up.has_account')}{' '}
        <Text
          testID="sign-up-sign-in"
          className="font-semibold text-link"
          onPress={() => router.replace('/login')}
        >
          {t('auth.sign_up.sign_in')}
        </Text>
      </Text>
    </AuthScreen>
  );
}
