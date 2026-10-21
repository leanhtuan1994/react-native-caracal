import { act, renderHook } from '@testing-library/react-native';

import { useDebouncedValue } from './use-debounced-value';

describe('useDebouncedValue', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('updates only after the delay', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value),
      { initialProps: { value: 'a' } }
    );
    await rerender({ value: 'ab' });
    await act(() => jest.advanceTimersByTime(299));
    expect(result.current).toBe('a');
    await act(() => jest.advanceTimersByTime(1));
    expect(result.current).toBe('ab');
  });
});
