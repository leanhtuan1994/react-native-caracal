import { renderHook } from '@testing-library/react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useScrollTopPadding } from './use-scroll-top-padding';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

function mockTopInset(top: number) {
  jest
    .mocked(useSafeAreaInsets)
    .mockReturnValue({ top, right: 0, bottom: 0, left: 0 });
}

describe('useScrollTopPadding on iOS', () => {
  it('adds a gap when the top inset is 0 (iPhone Duo)', async () => {
    mockTopInset(0);
    const { result } = await renderHook(() => useScrollTopPadding());
    expect(result.current).toBe(16);
  });

  it('tops up a short inset to the minimum gap', async () => {
    mockTopInset(10);
    const { result } = await renderHook(() => useScrollTopPadding());
    expect(result.current).toBe(6);
  });

  it('adds nothing below a notch or Dynamic Island', async () => {
    mockTopInset(59);
    const { result } = await renderHook(() => useScrollTopPadding());
    expect(result.current).toBe(0);
  });
});
