import '@testing-library/react-native';

// react-hook form setup for testing
// @ts-ignore
global.window = {};
// @ts-ignore
global.window = global;

// Mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => {
  /* eslint-disable @typescript-eslint/no-require-imports --
   * Jest mock factories are hoisted and must load dependencies lazily.
   */
  const React = require('react');
  const RN = require('react-native');
  /* eslint-enable @typescript-eslint/no-require-imports */

  class BottomSheetModalMock extends React.Component {
    present = jest.fn();
    dismiss = jest.fn();
    close = jest.fn();
    snapToIndex = jest.fn();
    snapToPosition = jest.fn();
    expand = jest.fn();
    collapse = jest.fn();

    render() {
      return React.createElement(
        RN.View,
        {
          testID: this.props.testID,
          style: { flex: 1 },
        },
        this.props.children
      );
    }
  }

  return {
    __esModule: true,
    BottomSheetModal: BottomSheetModalMock,
    BottomSheetModalProvider: ({ children }: any) => children,
    BottomSheetScrollView: RN.ScrollView,
    BottomSheetFlatList: RN.FlatList,
    BottomSheetView: RN.View,
    useBottomSheet: jest.fn(() => ({
      close: jest.fn(),
      expand: jest.fn(),
      collapse: jest.fn(),
      snapToIndex: jest.fn(),
    })),
    useBottomSheetScrollableCreator: jest.fn(() => RN.ScrollView),
  };
});

// jest-expo mocks only `react-native/asset-registry`, while expo-asset reads
// `AssetRegistry` from `react-native` (RN 0.88). Route both to the same mock so
// fonts registered by `@expo/vector-icons` resolve in tests.
jest.mock('react-native/src/private/assets/AssetRegistry', () => ({
  AssetRegistry: jest.requireMock('react-native/asset-registry'),
}));
