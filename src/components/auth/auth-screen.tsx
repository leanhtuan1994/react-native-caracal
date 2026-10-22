import type { PropsWithChildren } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

import { AmbientBackground } from '@/components/glass';
import { View } from '@/components/ui';

const StyledScrollView = withUniwind(KeyboardAwareScrollView);

type AuthScreenProps = PropsWithChildren<{ testID: string }>;

export function AuthScreen({ children, testID }: AuthScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View testID={testID} className="flex-1">
      <AmbientBackground />
      <StyledScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="grow pb-10"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingLeft: insets.left + 24,
          paddingRight: insets.right + 24,
        }}
      >
        <View className="w-full max-w-xl grow self-center">{children}</View>
      </StyledScrollView>
    </View>
  );
}
