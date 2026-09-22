import Ionicons from '@expo/vector-icons/Ionicons';
import { ListGroup } from 'heroui-native';
import type { ComponentProps } from 'react';
import { withUniwind } from 'uniwind';

import { Text } from '@/components/ui';

const StyledIonicons = withUniwind(Ionicons);

type SettingsRowProps = {
  testID?: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  title: string;
  value?: string;
  onPress?: () => void;
};

export function SettingsRow({
  testID,
  icon,
  title,
  value,
  onPress,
}: SettingsRowProps) {
  return (
    <ListGroup.Item testID={testID} onPress={onPress} disabled={!onPress}>
      {icon ? (
        <ListGroup.ItemPrefix>
          <StyledIonicons name={icon} size={20} className="text-foreground" />
        </ListGroup.ItemPrefix>
      ) : null}
      <ListGroup.ItemContent>
        <ListGroup.ItemTitle>{title}</ListGroup.ItemTitle>
      </ListGroup.ItemContent>
      {value ? <Text className="text-muted">{value}</Text> : null}
      {onPress ? <ListGroup.ItemSuffix /> : null}
    </ListGroup.Item>
  );
}
