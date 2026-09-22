import Ionicons from '@expo/vector-icons/Ionicons';
import { FieldError } from 'heroui-native';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

import { Text } from './text';

const StyledIonicons = withUniwind(Ionicons);

type FieldErrorMessageProps = { message: string; testID?: string };

export function FieldErrorMessage({ message, testID }: FieldErrorMessageProps) {
  return (
    <FieldError testID={testID} isInvalid className="pl-1">
      <View className="flex-row items-center gap-1.5">
        <StyledIonicons
          name="alert-circle-outline"
          size={14}
          className="text-danger"
        />
        <Text className="flex-1 text-[13px] text-danger">{message}</Text>
      </View>
    </FieldError>
  );
}
