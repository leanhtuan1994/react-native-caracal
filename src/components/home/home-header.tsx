import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { GlassButton } from '@/components/glass';
import { GradientAvatar, Text, View } from '@/components/ui';
import { useCurrentUser } from '@/lib/auth';
import { getGreetingKey } from '@/lib/greeting';
import { useComingSoon } from '@/lib/hooks';

const StyledIonicons = withUniwind(Ionicons);

export function HomeHeader() {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const showComingSoon = useComingSoon();

  return (
    <View className="flex-row items-center gap-3">
      <GradientAvatar initials={user?.initials ?? ''} alt={user?.fullName} />
      <View className="flex-1 gap-0.5">
        <Text className="text-sm text-muted">
          {t(getGreetingKey(new Date().getHours()))}
        </Text>
        <Text className="font-bold text-xl tracking-tight text-foreground">
          {user?.fullName}
        </Text>
      </View>
      <GlassButton
        testID="home-notifications"
        isIconOnly
        accessibilityLabel={t('home.notifications')}
        className="size-11"
        onPress={showComingSoon}
      >
        <StyledIonicons
          name="notifications-outline"
          size={20}
          className="text-foreground"
        />
        <View className="absolute top-2.5 right-[11px] size-2 rounded-full border-2 border-white bg-[#e5484d] dark:border-[#1d2326] dark:bg-[#f0555b]" />
      </GlassButton>
    </View>
  );
}
