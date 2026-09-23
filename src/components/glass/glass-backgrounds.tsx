import { Button, Chip, Input } from 'heroui-native';

import { GlassLayer } from './glass-layer';

export function ButtonGlass() {
  return (
    <Button.Background>
      <GlassLayer isInteractive />
    </Button.Background>
  );
}

export function InputGlass() {
  return (
    <Input.Background>
      <GlassLayer />
    </Input.Background>
  );
}

export function ChipGlass() {
  return (
    <Chip.Background>
      <GlassLayer isInteractive />
    </Chip.Background>
  );
}
