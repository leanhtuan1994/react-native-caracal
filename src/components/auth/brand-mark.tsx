import { useThemeColor } from 'heroui-native';
import Svg, { Path } from 'react-native-svg';

import { View } from '@/components/ui';

export function BrandMark() {
  const accent = useThemeColor('accent');

  return (
    <View className="size-[38px] items-center justify-center rounded-xl bg-foreground">
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 20 7 5l5 6 5-6 3 15z"
          stroke={accent}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
