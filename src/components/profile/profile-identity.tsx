import { useTranslation } from 'react-i18next';

import { GlassButton, GlassSurface } from '@/components/glass';
import { GradientAvatar, Text, View } from '@/components/ui';
import type { UserProfile } from '@/lib/auth';
import { useComingSoon } from '@/lib/hooks';

export function ProfileIdentity({ user }: { user: UserProfile }) {
  const { t } = useTranslation();
  const showComingSoon = useComingSoon();

  return (
    <GlassSurface className="gap-4 rounded-[28px] p-5">
      <View className="flex-row items-center gap-4">
        <GradientAvatar initials={user.initials} alt={user.fullName} isLarge />
        <View className="flex-1 gap-1">
          <Text className="font-bold text-xl text-foreground">
            {user.fullName}
          </Text>
          <Text className="text-sm text-muted">@{user.username}</Text>
        </View>
      </View>
      <GlassButton
        testID="profile-edit"
        className="h-[46px]"
        labelClassName="font-semibold text-[15px]"
        onPress={showComingSoon}
      >
        {t('profile.edit')}
      </GlassButton>
    </GlassSurface>
  );
}
