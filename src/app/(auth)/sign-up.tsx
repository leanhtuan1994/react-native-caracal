import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Button } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { AuthScreen, SignUpForm } from '@/components/auth';
import { ButtonGlass } from '@/components/glass';
import { Text, View } from '@/components/ui';

const StyledIonicons = withUniwind(Ionicons);

export default function SignUpScreen() {
  const { t } = useTranslation();

  const goBack = () =>
    router.canGoBack() ? router.back() : router.replace('/login');

  return (
    <AuthScreen testID="sign-up-screen">
      <Button
        testID="sign-up-back"
        isIconOnly
        variant="secondary"
        background={<ButtonGlass />}
        accessibilityLabel={t('common.back')}
        className="self-start rounded-full"
        onPress={goBack}
      >
        <StyledIonicons
          name="chevron-back"
          size={20}
          className="text-foreground"
        />
      </Button>
      <View className="mt-6 mb-6 gap-2">
        <Text className="font-bold text-[32px] text-foreground">
          {t('auth.sign_up.title')}
        </Text>
        <Text className="text-base text-muted">
          {t('auth.sign_up.subtitle')}
        </Text>
      </View>
      <SignUpForm />
      <View className="flex-1" />
      <Text className="mt-8 text-center text-muted">
        {t('auth.sign_up.has_account')}{' '}
        <Text
          testID="sign-up-sign-in"
          className="font-semibold text-accent"
          onPress={() => router.replace('/login')}
        >
          {t('auth.sign_up.sign_in')}
        </Text>
      </Text>
    </AuthScreen>
  );
}
