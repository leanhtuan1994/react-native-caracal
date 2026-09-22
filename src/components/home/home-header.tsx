import Ionicons from '@expo/vector-icons/Ionicons';
import { Avatar, Button } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { ButtonGlass } from '@/components/glass';
import { Text, View } from '@/components/ui';
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
      <Avatar size="md" color="accent" alt={user?.fullName}>
        <Avatar.Fallback>{user?.initials}</Avatar.Fallback>
      </Avatar>
      <View className="flex-1">
        <Text className="text-sm text-muted">
          {t(getGreetingKey(new Date().getHours()))}
        </Text>
        <Text className="font-bold text-lg text-foreground">
          {user?.fullName}
        </Text>
      </View>
      <Button
        testID="home-notifications"
        isIconOnly
        variant="secondary"
        background={<ButtonGlass />}
        accessibilityLabel={t('home.notifications')}
        className="rounded-full"
        onPress={showComingSoon}
      >
        <StyledIonicons
          name="notifications-outline"
          size={20}
          className="text-foreground"
        />
      </Button>
    </View>
  );
}
