import { ListGroup } from 'heroui-native';
import { useTranslation } from 'react-i18next';

import { GlassListSection } from '@/components/glass';
import { Text } from '@/components/ui';
import { useSignOut } from '@/lib/auth';
import { useComingSoon } from '@/lib/hooks';

export function SecuritySection() {
  const { t } = useTranslation();
  const showComingSoon = useComingSoon();
  const signOut = useSignOut();

  return (
    <GlassListSection title={t('profile.security')}>
      <ListGroup.Item testID="profile-change-password" onPress={showComingSoon}>
        <ListGroup.ItemContent>
          <ListGroup.ItemTitle>
            {t('profile.change_password')}
          </ListGroup.ItemTitle>
        </ListGroup.ItemContent>
        <ListGroup.ItemSuffix />
      </ListGroup.Item>
      <ListGroup.Item testID="profile-sign-out" onPress={signOut}>
        <ListGroup.ItemContent>
          <Text className="font-medium text-danger">
            {t('profile.sign_out')}
          </Text>
        </ListGroup.ItemContent>
      </ListGroup.Item>
    </GlassListSection>
  );
}
