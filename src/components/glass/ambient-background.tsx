import { View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { useAppTheme } from '@/lib/contexts/app-theme-context';

const BLOBS = {
  azure: { color: '#25B9EE', light: 0.4, dark: 0.3 },
  violet: { color: '#818CF8', light: 0.32, dark: 0.26 },
  teal: { color: '#2DD4BF', light: 0.3, dark: 0.2 },
} as const;

const AREA = {
  azure: { cx: '0%', cy: '0%', rx: '90%', ry: '45%' },
  violet: { cx: '100%', cy: '45%', rx: '70%', ry: '40%' },
  teal: { cx: '20%', cy: '100%', rx: '90%', ry: '40%' },
} as const;

function renderStops(name: keyof typeof BLOBS, isDark: boolean) {
  const { color, light, dark } = BLOBS[name];
  const opacity = isDark ? dark : light;
  return [
    <Stop key="0" offset="0" stopColor={color} stopOpacity={opacity} />,
    <Stop key="1" offset="1" stopColor={color} stopOpacity={0} />,
  ];
}

export function AmbientBackground() {
  const { isDark } = useAppTheme();

  return (
    <View pointerEvents="none" className="absolute inset-0 bg-background">
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id="ambient-azure" {...AREA.azure}>
            {renderStops('azure', isDark)}
          </RadialGradient>
          <RadialGradient id="ambient-violet" {...AREA.violet}>
            {renderStops('violet', isDark)}
          </RadialGradient>
          <RadialGradient id="ambient-teal" {...AREA.teal}>
            {renderStops('teal', isDark)}
          </RadialGradient>
        </Defs>
        {Object.keys(BLOBS).map((name) => (
          <Rect
            key={name}
            width="100%"
            height="100%"
            fill={`url(#ambient-${name})`}
          />
        ))}
      </Svg>
    </View>
  );
}
