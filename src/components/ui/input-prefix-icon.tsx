import Ionicons from '@expo/vector-icons/Ionicons';
import { InputGroup } from 'heroui-native';
import type { ComponentProps } from 'react';
import { withUniwind } from 'uniwind';

const StyledIonicons = withUniwind(Ionicons);

export type InputIconName = ComponentProps<typeof Ionicons>['name'];

type InputPrefixIconProps = { name: InputIconName; isInvalid: boolean };

export function InputPrefixIcon({ name, isInvalid }: InputPrefixIconProps) {
  return (
    <InputGroup.Prefix isDecorative className="pl-4">
      <StyledIonicons
        name={name}
        size={20}
        className={isInvalid ? 'text-danger' : 'text-muted'}
      />
    </InputGroup.Prefix>
  );
}
