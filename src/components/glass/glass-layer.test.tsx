import { Platform } from 'react-native';

import { render, screen } from '@/lib/test-utils';

import { GlassLayer } from './glass-layer';

const mockLiquid = jest.fn(() => false);
jest.mock('expo-glass-effect', () => {
  const { View } = require('react-native');
  return {
    isLiquidGlassAvailable: () => mockLiquid(),
    GlassView: (props: object) => <View testID="native-glass" {...props} />,
  };
});

describe('GlassLayer', () => {
  afterEach(() => {
    Platform.OS = 'ios';
  });

  it('uses native glass when liquid glass is available on iOS', () => {
    Platform.OS = 'ios';
    mockLiquid.mockReturnValue(true);
    render(<GlassLayer />);
    expect(screen.getByTestId('native-glass')).toBeTruthy();
  });

  it('uses the translucent fallback on Android', () => {
    Platform.OS = 'android';
    mockLiquid.mockReturnValue(false);
    render(<GlassLayer />);
    expect(screen.getByTestId('glass-fallback')).toBeTruthy();
  });
});
