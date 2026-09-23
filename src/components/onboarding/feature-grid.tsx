import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { GlassSurface } from '@/components/glass';
import { Text, View } from '@/components/ui';

import { PanelGlow } from './panel-glow';

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
    <View className="h-[280px] flex-row flex-wrap justify-between gap-y-2.5 overflow-hidden rounded-[30px] bg-[#0e1316] p-3.5">
      <PanelGlow />
      {FEATURES.map(({ key, icon }) => (
        <GlassSurface
          key={key}
          className="h-[121px] w-[48.4%] justify-between rounded-[20px] border-white/15 bg-white/10 p-3.5"
        >
          <StyledIonicons name={icon} size={24} className="text-[#5fd0f7]" />
          <View className="gap-0.5">
            <Text className="font-semibold text-[15px] text-[#fcfcfc]">
              {t(`onboarding.features.${key}_title`)}
            </Text>
            <Text className="text-xs text-[#b3bcc1]">
              {t(`onboarding.features.${key}_desc`)}
            </Text>
          </View>
        </GlassSurface>
      ))}
    </View>
  );
}
