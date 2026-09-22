import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Button } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { AuthScreen, BrandMark } from '@/components/auth';
import { GlassButton } from '@/components/glass';
import { FeatureGrid, OnboardingIntro } from '@/components/onboarding';
import { PrimaryButton, Text, View } from '@/components/ui';
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
          <Text className="font-bold text-xl tracking-tight text-foreground">
            Caracal
          </Text>
        </View>
        <GlassButton
          testID="onboarding-skip"
          size="sm"
          className="h-10 px-4"
          labelClassName="text-[15px]"
          onPress={() => finish('/login')}
        >
          {t('onboarding.skip')}
        </GlassButton>
      </View>
      <View className="mt-6">
        <FeatureGrid />
      </View>
      <OnboardingIntro />
      <View className="flex-1" />
      <View className="mt-8 gap-3">
        <PrimaryButton
          testID="onboarding-get-started"
          onPress={() => finish('/sign-up')}
        >
          <Button.Label className="font-semibold text-accent-foreground">
            {t('onboarding.get_started')}
          </Button.Label>
          <StyledIonicons
            name="arrow-forward"
            size={18}
            className="text-accent-foreground"
          />
        </PrimaryButton>
        <GlassButton
          testID="onboarding-have-account"
          className="h-[54px]"
          labelClassName="font-semibold"
          onPress={() => finish('/login')}
        >
          {t('onboarding.have_account')}
        </GlassButton>
      </View>
    </AuthScreen>
  );
}
