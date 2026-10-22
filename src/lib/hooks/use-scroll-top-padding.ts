import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// iOS scroll views already inset their content by the top safe area, so this
// only adds space where that inset is too short to clear the window edge. On
// the iPhone Duo the status bar sits on the side and the top inset is 0;
// iPhones with a notch or Dynamic Island get no extra padding.
const MIN_TOP_GAP = 16;

export function useScrollTopPadding(): number {
  const { top } = useSafeAreaInsets();
  return Platform.OS === 'ios' ? Math.max(0, MIN_TOP_GAP - top) : top;
}
