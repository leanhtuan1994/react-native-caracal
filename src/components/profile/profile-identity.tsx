import { Avatar, Button } from 'heroui-native';
import { useTranslation } from 'react-i18next';

import { ButtonGlass, GlassSurface } from '@/components/glass';
import { Text, View } from '@/components/ui';
import type { UserProfile } from '@/lib/auth';
import { useComingSoon } from '@/lib/hooks';

export function ProfileIdentity({ user }: { user: UserProfile }) {
  const { t } = useTranslation();
  const showComingSoon = useComingSoon();

  return (
    <GlassSurface className="gap-4 p-5">
      <View className="flex-row items-center gap-4">
        <Avatar size="lg" color="accent" alt={user.fullName}>
          <Avatar.Fallback>{user.initials}</Avatar.Fallback>
        </Avatar>
        <View className="flex-1">
          <Text className="font-bold text-xl text-foreground">
            {user.fullName}
          </Text>
          <Text className="text-muted">@{user.username}</Text>
        </View>
      </View>
      <Button
        testID="profile-edit"
        variant="secondary"
        background={<ButtonGlass />}
        onPress={showComingSoon}
      >
        {t('profile.edit')}
      </Button>
    </GlassSurface>
  );
}
