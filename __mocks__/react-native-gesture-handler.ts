const { View } = require('react-native');
const mock = require('react-native-gesture-handler/jestSetup');

mock.GestureHandlerRootView = View;

// Mock State enum
mock.State = {
  UNDETERMINED: 0,
  FAILED: 1,
  BEGAN: 2,
  CANCELLED: 3,
  ACTIVE: 4,
  END: 5,
};

// Mock GestureDetector
mock.GestureDetector = ({ children }) => children;

// Mock Gesture API
const mockGesture = {
  onChange: jest.fn().mockReturnThis(),
  onStart: jest.fn().mockReturnThis(),
  onEnd: jest.fn().mockReturnThis(),
  onFinalize: jest.fn().mockReturnThis(),
  enabled: jest.fn().mockReturnThis(),
  shouldCancelWhenOutside: jest.fn().mockReturnThis(),
  simultaneousWithExternalGesture: jest.fn().mockReturnThis(),
  runOnJS: jest.fn().mockReturnThis(),
  withRef: jest.fn().mockReturnThis(),
  withTestId: jest.fn().mockReturnThis(),
};

mock.Gesture = {
  Pan: jest.fn(() => mockGesture),
  Tap: jest.fn(() => mockGesture),
  LongPress: jest.fn(() => mockGesture),
  Fling: jest.fn(() => mockGesture),
  Pinch: jest.fn(() => mockGesture),
  Rotation: jest.fn(() => mockGesture),
  Hover: jest.fn(() => mockGesture),
  Native: jest.fn(() => mockGesture),
  Race: jest.fn(() => mockGesture),
  Simultaneous: jest.fn(() => mockGesture),
  Exclusive: jest.fn(() => mockGesture),
};

module.exports = mock;
