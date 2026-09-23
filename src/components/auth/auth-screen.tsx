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
        contentContainerClassName="grow px-6 pb-10"
        contentContainerStyle={{ paddingTop: insets.top + 16 }}
      >
        {children}
      </StyledScrollView>
    </View>
  );
}
