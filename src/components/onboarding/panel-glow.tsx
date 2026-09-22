import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { View } from '@/components/ui';

export function PanelGlow() {
  return (
    <View pointerEvents="none" className="absolute inset-0">
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id="panel-azure" cx="15%" cy="10%" rx="70%" ry="70%">
            <Stop offset="0" stopColor="#25B9EE" stopOpacity={0.55} />
            <Stop offset="1" stopColor="#25B9EE" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="panel-violet" cx="90%" cy="90%" rx="60%" ry="60%">
            <Stop offset="0" stopColor="#818CF8" stopOpacity={0.5} />
            <Stop offset="1" stopColor="#818CF8" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#panel-azure)" />
        <Rect width="100%" height="100%" fill="url(#panel-violet)" />
      </Svg>
    </View>
  );
}
