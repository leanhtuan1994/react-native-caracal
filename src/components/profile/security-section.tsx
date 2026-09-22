import Ionicons from '@expo/vector-icons/Ionicons';
import { ListGroup } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { GlassListSection } from '@/components/glass';
import { SettingsRow } from '@/components/settings/settings-row';
import { Text } from '@/components/ui';
import { useSignOut } from '@/lib/auth';
import { useComingSoon } from '@/lib/hooks';

const StyledIonicons = withUniwind(Ionicons);

export function SecuritySection() {
  const { t } = useTranslation();
  const showComingSoon = useComingSoon();
  const signOut = useSignOut();

  return (
    <GlassListSection title={t('profile.security')}>
      <SettingsRow
        testID="profile-change-password"
        icon="key-outline"
        title={t('profile.change_password')}
        onPress={showComingSoon}
      />
      <ListGroup.Item
        testID="profile-sign-out"
        onPress={signOut}
        className="min-h-[52px]"
      >
        <ListGroup.ItemPrefix>
          <StyledIonicons
            name="log-out-outline"
            size={20}
            className="text-danger"
          />
        </ListGroup.ItemPrefix>
        <ListGroup.ItemContent>
          <Text className="font-medium text-[15px] text-danger">
            {t('profile.sign_out')}
          </Text>
        </ListGroup.ItemContent>
      </ListGroup.Item>
    </GlassListSection>
  );
}
