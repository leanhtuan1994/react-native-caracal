import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { GlassSurface } from '@/components/glass';
import { Text, View } from '@/components/ui';

const StyledIonicons = withUniwind(Ionicons);

const FEATURES = [
  { key: 'router', icon: 'folder-open-outline' },
  { key: 'heroui', icon: 'grid-outline' },
  { key: 'query', icon: 'sync-outline' },
  { key: 'storage', icon: 'server-outline' },
] as const;

export function FeatureGrid() {
  const { t } = useTranslation();

  return (
    <View className="flex-row flex-wrap justify-between gap-y-2.5 rounded-[30px] bg-foreground p-3.5 dark:bg-surface">
      {FEATURES.map(({ key, icon }) => (
        <GlassSurface
          key={key}
          className="h-[118px] w-[48%] justify-between border-white/15 p-3.5"
        >
          <StyledIonicons name={icon} size={22} className="text-accent" />
          <View className="gap-0.5">
            <Text className="font-semibold text-[15px] text-white">
              {t(`onboarding.features.${key}_title`)}
            </Text>
            <Text className="text-xs text-white/70">
              {t(`onboarding.features.${key}_desc`)}
            </Text>
          </View>
        </GlassSurface>
      ))}
    </View>
  );
}
