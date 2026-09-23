import { ListGroup, Separator } from 'heroui-native';
import type { PropsWithChildren } from 'react';
import { Children, Fragment } from 'react';

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
  const rows = Children.toArray(children);

  return (
    <View testID={testID} className="gap-2">
      <Text className="px-2 font-semibold text-[13px] tracking-[0.8px] text-muted uppercase">
        {title}
      </Text>
      <GlassSurface className="p-0">
        <ListGroup variant="transparent">
          {rows.map((row, index) => (
            <Fragment key={index}>
              {index > 0 ? (
                <Separator className="ml-[18px] bg-foreground/10" />
              ) : null}
              {row}
            </Fragment>
          ))}
        </ListGroup>
      </GlassSurface>
    </View>
  );
}
