import { cn } from 'heroui-native';
import React from 'react';
import { Text as RNText } from 'react-native';

type TextProps = React.ComponentProps<typeof RNText>;

export function Text({ className, ...props }: TextProps) {
  return <RNText className={cn('font-normal', className)} {...props} />;
}
