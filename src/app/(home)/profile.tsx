import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { AmbientBackground } from '@/components/glass';
import {
  AccountSection,
  ProfileIdentity,
  SecuritySection,
} from '@/components/profile';
import { ScrollView, Text, View } from '@/components/ui';
import { useCurrentUser, useSignOut } from '@/lib/auth';
import { useScrollTopPadding } from '@/lib/hooks';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const signOut = useSignOut();
  const topPadding = useScrollTopPadding();
  const isMissingUser = !user;

  useEffect(() => {
    if (isMissingUser) signOut();
  }, [isMissingUser, signOut]);

  if (!user) return null;

  return (
    <View testID="profile-screen" className="flex-1">
      <AmbientBackground />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingTop: topPadding }}
        contentContainerClassName="w-full max-w-2xl gap-5 self-center pr-safe-offset-5 pb-32 pl-safe-offset-5"
      >
        <Text className="h-11 px-1 font-bold text-[30px] leading-[44px] tracking-tight text-foreground">
          {t('profile.title')}
        </Text>
        <ProfileIdentity user={user} />
        <AccountSection user={user} />
        <SecuritySection />
      </ScrollView>
    </View>
  );
}
