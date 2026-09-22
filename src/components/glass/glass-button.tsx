import { Button, cn } from 'heroui-native';
import type { ComponentProps } from 'react';

import { ButtonGlass } from './glass-backgrounds';

type GlassButtonProps = ComponentProps<typeof Button> & {
  labelClassName?: string;
};

export function GlassButton({
  children,
  className,
  labelClassName,
  ...props
}: GlassButtonProps) {
  return (
    <Button
      variant="secondary"
      background={<ButtonGlass />}
      className={cn('rounded-full', className)}
      {...props}
    >
      {typeof children === 'string' ? (
        <Button.Label
          className={cn('font-medium text-foreground', labelClassName)}
        >
          {children}
        </Button.Label>
      ) : (
        children
      )}
    </Button>
  );
}
