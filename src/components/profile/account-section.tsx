import { ListGroup } from 'heroui-native';
import { useTranslation } from 'react-i18next';

import { GlassListSection } from '@/components/glass';
import { Text } from '@/components/ui';
import type { UserProfile } from '@/lib/auth';

type AccountRowProps = { testID: string; title: string; value: string };

function AccountRow({ testID, title, value }: AccountRowProps) {
  return (
    <ListGroup.Item testID={testID} disabled>
      <ListGroup.ItemContent>
        <ListGroup.ItemTitle>{title}</ListGroup.ItemTitle>
      </ListGroup.ItemContent>
      <ListGroup.ItemSuffix>
        <Text className="text-muted">{value}</Text>
      </ListGroup.ItemSuffix>
    </ListGroup.Item>
  );
}

export function AccountSection({ user }: { user: UserProfile }) {
  const { t } = useTranslation();

  return (
    <GlassListSection title={t('profile.account')}>
      <AccountRow
        testID="profile-full-name"
        title={t('profile.full_name')}
        value={user.fullName}
      />
      <AccountRow
        testID="profile-username"
        title={t('profile.username')}
        value={user.username}
      />
      <AccountRow
        testID="profile-email"
        title={t('profile.email')}
        value={user.email}
      />
    </GlassListSection>
  );
}
