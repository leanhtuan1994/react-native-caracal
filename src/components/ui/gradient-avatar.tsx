import { LinearGradient } from 'expo-linear-gradient';
import { Avatar, cn } from 'heroui-native';
import { StyleSheet } from 'react-native';

import { Text } from './text';

type GradientAvatarProps = {
  initials: string;
  alt?: string;
  isLarge?: boolean;
};

export function GradientAvatar({
  initials,
  alt,
  isLarge,
}: GradientAvatarProps) {
  return (
    <Avatar
      alt={alt}
      size={isLarge ? 'lg' : 'md'}
      className={isLarge ? 'size-[72px]' : 'size-11'}
      background={
        <Avatar.Background>
          <LinearGradient
            colors={['#5fd0f7', '#25b9ee']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Avatar.Background>
      }
    >
      <Avatar.Fallback>
        <Text
          className={cn(
            'font-bold text-[#0b1b22]',
            isLarge ? 'text-[26px]' : 'text-base'
          )}
        >
          {initials}
        </Text>
      </Avatar.Fallback>
    </Avatar>
  );
}
