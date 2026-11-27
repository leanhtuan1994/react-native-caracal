import { Image, Platform, StyleSheet } from 'react-native';
import Animated, { SharedTransition } from 'react-native-reanimated';

import { Text } from '@/components/ui/text';

const nativeTransition =
  Platform.OS === 'ios' || Platform.OS === 'android'
    ? {
        sharedTransitionTag: 'auth-brand-mark',
        sharedTransitionStyle: SharedTransition.duration(450),
      }
    : undefined;

export function BrandMark() {
  return (
    <Image
      source={require('../../../assets/icon.png')}
      className="size-[38px] rounded-xl"
      accessible={false}
    />
  );
}

export function AuthBrandMark({ showName = false }: { showName?: boolean }) {
  return (
    <Animated.View {...nativeTransition} style={styles.badge}>
      <BrandMark />
      {showName && (
        <Text className="pr-3 font-semibold text-base text-white">Caracal</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0D11',
    borderRadius: 12,
    overflow: 'hidden',
  },
});
