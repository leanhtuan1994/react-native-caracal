import { ListGroup } from 'heroui-native';
import type { PropsWithChildren } from 'react';

import { Text, View } from '@/components/ui';

import { GlassSurface } from './glass-surface';

type GlassListSectionProps = PropsWithChildren<{
  title: string;
  testID?: string;
}>;

export function GlassListSection({
  children,
  title,
  testID,
}: GlassListSectionProps) {
  return (
    <View testID={testID} className="gap-2">
      <Text className="px-2 font-medium text-[13px] text-muted uppercase">
        {title}
      </Text>
      <GlassSurface>
        <ListGroup variant="transparent">{children}</ListGroup>
      </GlassSurface>
    </View>
  );
}
