import '@testing-library/react-native';

// react-hook form setup for testing
// @ts-ignore
global.window = {};
// @ts-ignore
global.window = global;

// jest-expo mocks only `react-native/asset-registry`, while expo-asset reads
// `AssetRegistry` from `react-native` (RN 0.88). Route both to the same mock so
// fonts registered by `@expo/vector-icons` resolve in tests.
jest.mock('react-native/src/private/assets/AssetRegistry', () => ({
  AssetRegistry: jest.requireMock('react-native/asset-registry'),
}));
