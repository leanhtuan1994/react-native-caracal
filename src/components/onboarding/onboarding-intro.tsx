import { useTranslation } from 'react-i18next';

import { Text, View } from '@/components/ui';

import { PagerDots } from './pager-dots';

export function OnboardingIntro() {
  const { t } = useTranslation();

  return (
    <View className="mt-6 gap-3">
      <PagerDots count={3} activeIndex={0} />
      <Text className="font-semibold text-[13px] text-accent uppercase">
        {t('onboarding.eyebrow')}
      </Text>
      <Text className="font-bold text-[32px] leading-[38px] text-foreground">
        {t('onboarding.title')}
      </Text>
      <Text className="text-base text-muted">
        {t('onboarding.description')}
      </Text>
    </View>
  );
}
