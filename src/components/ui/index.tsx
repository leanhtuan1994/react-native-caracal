import { SafeAreaView } from 'react-native-safe-area-context';
import Svg from 'react-native-svg';
import { withUniwind } from 'uniwind';

export * from './controlled-input';
export * from './focus-aware-status-bar';
export * from './image';
export * from './list';
export * from './modal';
export * from './password-toggle';
export * from './text';
export * from './utils';

// export base components from react-native
export {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

export const StyledSafeAreaView = withUniwind(SafeAreaView);
export const StyledSvg = withUniwind(Svg);
