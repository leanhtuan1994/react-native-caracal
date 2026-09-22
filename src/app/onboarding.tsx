import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Button } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { AuthScreen, BrandMark } from '@/components/auth';
import { ButtonGlass } from '@/components/glass';
import { FeatureGrid, OnboardingIntro } from '@/components/onboarding';
import { Text, View } from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';

const StyledIonicons = withUniwind(Ionicons);

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const [, setIsFirstTime] = useIsFirstTime();

  const finish = (route: '/sign-up' | '/login') => {
    setIsFirstTime(false);
    router.replace(route);
  };

  return (
    <AuthScreen testID="onboarding-screen">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5">
          <BrandMark />
          <Text className="font-bold text-lg text-foreground">Caracal</Text>
        </View>
        <Button
          testID="onboarding-skip"
          size="sm"
          variant="secondary"
          background={<ButtonGlass />}
          onPress={() => finish('/login')}
        >
          {t('onboarding.skip')}
        </Button>
      </View>
      <View className="mt-6">
        <FeatureGrid />
      </View>
      <OnboardingIntro />
      <View className="flex-1" />
      <View className="mt-8 gap-3">
        <Button
          testID="onboarding-get-started"
          variant="primary"
          onPress={() => finish('/sign-up')}
        >
          <Button.Label>{t('onboarding.get_started')}</Button.Label>
          <StyledIonicons
            name="arrow-forward"
            size={18}
            className="text-accent-foreground"
          />
        </Button>
        <Button
          testID="onboarding-have-account"
          variant="secondary"
          background={<ButtonGlass />}
          onPress={() => finish('/login')}
        >
          {t('onboarding.have_account')}
        </Button>
      </View>
    </AuthScreen>
  );
}
