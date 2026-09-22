import {
  Description,
  FieldError,
  Input,
  InputGroup,
  Label,
  TextField,
} from 'heroui-native';
import { useState } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { TextInputProps } from 'react-native';
import { View } from 'react-native';

import { PasswordToggle } from './password-toggle';

type ControlledInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  testID: string;
  placeholder?: string;
  description?: string;
  isPassword?: boolean;
  labelAccessory?: React.ReactNode;
} & Pick<
  TextInputProps,
  'keyboardType' | 'autoComplete' | 'autoCapitalize' | 'textContentType'
>;

export function ControlledInput<T extends FieldValues>(
  props: ControlledInputProps<T>
) {
  const { control, name, label, description, isPassword, labelAccessory } =
    props;
  const { t } = useTranslation();
  const { field, fieldState } = useController({ control, name });
  const [isVisible, setIsVisible] = useState(false);
  const error = fieldState.error?.message;
  const inputProps = {
    testID: props.testID,
    value: field.value ?? '',
    onChangeText: field.onChange,
    onBlur: field.onBlur,
    placeholder: props.placeholder,
    keyboardType: props.keyboardType,
    autoComplete: props.autoComplete,
    autoCapitalize: props.autoCapitalize,
    textContentType: props.textContentType,
  };

  return (
    <TextField isInvalid={!!error}>
      <View className="flex-row items-center justify-between">
        <Label>{label}</Label>
        {labelAccessory}
      </View>
      {isPassword ? (
        <InputGroup>
          <InputGroup.Input {...inputProps} secureTextEntry={!isVisible} />
          <InputGroup.Suffix>
            <PasswordToggle
              testID={`${props.testID}-toggle`}
              isVisible={isVisible}
              onToggle={() => setIsVisible((value) => !value)}
            />
          </InputGroup.Suffix>
        </InputGroup>
      ) : (
        <Input {...inputProps} />
      )}
      {description && !error ? <Description>{description}</Description> : null}
      {error ? <FieldError>{t(error as never)}</FieldError> : null}
    </TextField>
  );
}
