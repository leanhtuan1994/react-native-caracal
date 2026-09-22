import { ListGroup } from 'heroui-native';
import { useTranslation } from 'react-i18next';

import { GlassListSection } from '@/components/glass';
import { Text } from '@/components/ui';
import type { UserProfile } from '@/lib/auth';

function AccountRow({ title, value }: { title: string; value: string }) {
  return (
    <ListGroup.Item disabled>
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
      <AccountRow title={t('profile.full_name')} value={user.fullName} />
      <AccountRow title={t('profile.username')} value={user.username} />
      <AccountRow title={t('profile.email')} value={user.email} />
    </GlassListSection>
  );
}
