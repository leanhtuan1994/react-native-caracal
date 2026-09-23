import { cn, Surface } from 'heroui-native';
import type { PropsWithChildren } from 'react';

import { GlassLayer } from './glass-layer';

type GlassSurfaceProps = PropsWithChildren<{
  className?: string;
  testID?: string;
}>;

export function GlassSurface({
  children,
  className,
  testID,
}: GlassSurfaceProps) {
  return (
    <Surface
      variant="transparent"
      testID={testID}
      className={cn(
        'overflow-hidden rounded-3xl border border-white/70 dark:border-white/10',
        className
      )}
    >
      <GlassLayer />
      {children}
    </Surface>
  );
}
