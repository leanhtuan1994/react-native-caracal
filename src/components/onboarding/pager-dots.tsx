import { cn } from 'heroui-native';

import { View } from '@/components/ui';

type PagerDotsProps = { count: number; activeIndex: number };

export function PagerDots({ count, activeIndex }: PagerDotsProps) {
  return (
    <View accessibilityElementsHidden className="flex-row items-center gap-1.5">
      {Array.from({ length: count }, (_, index) => (
        <View
          key={index}
          className={cn(
            'h-1.5 rounded-full',
            index === activeIndex
              ? 'w-6 bg-foreground'
              : 'w-1.5 bg-foreground/20'
          )}
        />
      ))}
    </View>
  );
}
