import { router } from 'expo-router';
import { Button } from 'heroui-native';
import { useTranslation } from 'react-i18next';

import { View } from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const [, setIsFirstTime] = useIsFirstTime();

  const onGetStarted = () => {
    setIsFirstTime(false);
    router.replace('/sign-up');
  };

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Button testID="onboarding-get-started" onPress={onGetStarted}>
        {t('onboarding.get_started')}
      </Button>
    </View>
  );
}
