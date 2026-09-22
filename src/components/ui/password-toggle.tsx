import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { withUniwind } from 'uniwind';

const StyledIonicons = withUniwind(Ionicons);

type PasswordToggleProps = {
  isVisible: boolean;
  onToggle: () => void;
  testID: string;
};

export function PasswordToggle({
  isVisible,
  onToggle,
  testID,
}: PasswordToggleProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      testID={testID}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={
        isVisible ? t('auth.hide_password') : t('auth.show_password')
      }
      className="size-11 items-center justify-center"
    >
      <StyledIonicons
        name={isVisible ? 'eye-off-outline' : 'eye-outline'}
        size={18}
        className="text-muted"
      />
    </Pressable>
  );
}
