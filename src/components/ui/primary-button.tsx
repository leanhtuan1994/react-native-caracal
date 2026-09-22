import { Button, cn } from 'heroui-native';
import type { ComponentProps } from 'react';
import type { ViewStyle } from 'react-native';

const PRIMARY_SHADOW: ViewStyle = {
  boxShadow:
    'inset 0 1px 1px rgba(255, 255, 255, 0.65), 0 10px 24px rgba(37, 185, 238, 0.35)',
};

type PrimaryButtonProps = ComponentProps<typeof Button>;

export function PrimaryButton({
  children,
  className,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      variant="primary"
      className={cn('h-[54px] rounded-full', className)}
      {...props}
      style={PRIMARY_SHADOW}
    >
      {typeof children === 'string' ? (
        <Button.Label className="font-semibold text-accent-foreground">
          {children}
        </Button.Label>
      ) : (
        children
      )}
    </Button>
  );
}
