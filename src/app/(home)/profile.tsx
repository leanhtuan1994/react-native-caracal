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

export default function ProfileScreen() {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const signOut = useSignOut();
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
        contentContainerClassName="gap-5 px-5 pb-32"
      >
        <Text className="font-bold text-[34px] text-foreground">
          {t('profile.title')}
        </Text>
        <ProfileIdentity user={user} />
        <AccountSection user={user} />
        <SecuritySection />
      </ScrollView>
    </View>
  );
}
