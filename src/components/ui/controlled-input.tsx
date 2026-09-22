import { cn, Description, InputGroup, Label, TextField } from 'heroui-native';
import { useState } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { TextInputProps } from 'react-native';
import { View } from 'react-native';

import { FieldErrorMessage } from './field-error-message';
import type { InputIconName } from './input-prefix-icon';
import { InputPrefixIcon } from './input-prefix-icon';
import { PasswordToggle } from './password-toggle';

type ControlledInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  testID: string;
  placeholder?: string;
  description?: string;
  isPassword?: boolean;
  showPasswordToggle?: boolean;
  icon?: InputIconName;
  fieldClassName?: string;
  labelAccessory?: React.ReactNode;
} & Pick<
  TextInputProps,
  'keyboardType' | 'autoComplete' | 'autoCapitalize' | 'textContentType'
>;

export function ControlledInput<T extends FieldValues>(
  props: ControlledInputProps<T>
) {
  const { t } = useTranslation();
  const { field, fieldState } = useController(props);
  const [isVisible, setIsVisible] = useState(false);
  const error = fieldState.error?.message;
  const { isPassword, showPasswordToggle = true, icon } = props;

  return (
    <TextField isInvalid={!!error}>
      <View className="flex-row items-center justify-between px-1">
        <Label isInvalid={false}>{props.label}</Label>
        {props.labelAccessory}
      </View>
      <InputGroup>
        {icon ? <InputPrefixIcon name={icon} isInvalid={!!error} /> : null}
        <InputGroup.Input
          testID={props.testID}
          value={field.value ?? ''}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          placeholder={props.placeholder}
          keyboardType={props.keyboardType}
          autoComplete={props.autoComplete}
          autoCapitalize={props.autoCapitalize}
          textContentType={props.textContentType}
          secureTextEntry={isPassword && !isVisible}
          className={cn(
            'h-[52px] rounded-2xl text-base',
            error && 'border-2 border-danger bg-danger/5',
            props.fieldClassName
          )}
        />
        {isPassword && showPasswordToggle ? (
          <PasswordToggle
            testID={`${props.testID}-toggle`}
            isVisible={isVisible}
            onToggle={() => setIsVisible((value) => !value)}
          />
        ) : null}
      </InputGroup>
      {props.description && !error ? (
        <Description className="px-1">{props.description}</Description>
      ) : null}
      {error ? <FieldErrorMessage message={t(error as never)} /> : null}
    </TextField>
  );
}
