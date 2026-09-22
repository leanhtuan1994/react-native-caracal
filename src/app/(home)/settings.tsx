import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { AmbientBackground } from '@/components/glass';
import {
  AboutSection,
  GeneralSection,
  LinksSection,
  SupportSection,
} from '@/components/settings';
import { ScrollView, Text, View } from '@/components/ui';
import { useSignOut } from '@/lib/auth';

const StyledIonicons = withUniwind(Ionicons);

export default function SettingsScreen() {
  const { t } = useTranslation();
  const signOut = useSignOut();

  return (
    <View className="flex-1">
      <AmbientBackground />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="gap-6 px-5 pb-32"
      >
        <Text className="font-bold text-[34px] text-foreground">
          {t('settings.title')}
        </Text>
        <GeneralSection />
        <SupportSection />
        <LinksSection />
        <AboutSection />
        <Button
          testID="settings-logout"
          variant="danger-soft"
          onPress={signOut}
        >
          <StyledIonicons
            name="log-out-outline"
            size={18}
            className="text-danger"
          />
          <Button.Label>{t('settings.logout')}</Button.Label>
        </Button>
      </ScrollView>
    </View>
  );
}
