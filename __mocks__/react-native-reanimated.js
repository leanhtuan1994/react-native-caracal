const React = require('react');
const { View, Text, Image, ScrollView, Pressable } = require('react-native');

const mockSharedValue = (initial) => {
  const sharedValue = {
    value: initial,
    get: () => sharedValue.value,
    set: (next) => {
      sharedValue.value =
        typeof next === 'function' ? next(sharedValue.value) : next;
    },
    modify: (modifier) => {
      sharedValue.value = modifier(sharedValue.value);
    },
  };
  return sharedValue;
};

const Reanimated = {
  default: {
    Value: jest.fn(),
    event: jest.fn(),
    add: jest.fn(),
    eq: jest.fn(),
    set: jest.fn(),
    cond: jest.fn(),
    interpolate: jest.fn(),
    interpolateNode: jest.fn(),
    Extrapolate: { CLAMP: jest.fn() },
    Transition: {
      Together: 'Together',
      Out: 'Out',
      In: 'In',
    },
    View,
    Text,
    Image,
    ScrollView,
    Pressable,
    createAnimatedComponent: (Component) => Component,
    useSharedValue: jest.fn((value) => mockSharedValue(value)),
    useAnimatedStyle: jest.fn((callback) => callback()),
    useAnimatedGestureHandler: jest.fn(() => ({})),
    useAnimatedScrollHandler: jest.fn(() => ({})),
    useAnimatedRef: jest.fn(() => ({ current: null })),
    useDerivedValue: jest.fn((callback) => mockSharedValue(callback())),
    useAnimatedReaction: jest.fn(),
    useAnimatedProps: jest.fn(() => ({})),
    useReducedMotion: jest.fn(() => false),
    withTiming: jest.fn((value) => value),
    withSpring: jest.fn((value) => value),
    withDecay: jest.fn((value) => value),
    withDelay: jest.fn((_, value) => value),
    withSequence: jest.fn((...values) => values[0]),
    withRepeat: jest.fn((value) => value),
    cancelAnimation: jest.fn(),
    measure: jest.fn(),
    springify: jest.fn((config) => config),
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      quad: jest.fn(),
      cubic: jest.fn(),
      poly: jest.fn(),
      sin: jest.fn(),
      circle: jest.fn(),
      exp: jest.fn(),
      elastic: jest.fn(),
      back: jest.fn(),
      bounce: jest.fn(),
      bezier: jest.fn(),
      in: jest.fn(),
      out: jest.fn(),
      inOut: jest.fn(),
    },
    runOnJS: jest.fn((fn) => fn),
    runOnUI: jest.fn((fn) => fn),
    FadeIn: {
      duration: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
      easing: jest.fn().mockReturnThis(),
      springify: jest.fn().mockReturnThis(),
      withInitialValues: jest.fn().mockReturnThis(),
      mass: jest.fn().mockReturnThis(),
    },
    FadeOut: {
      duration: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
      easing: jest.fn().mockReturnThis(),
      springify: jest.fn().mockReturnThis(),
      withInitialValues: jest.fn().mockReturnThis(),
      mass: jest.fn().mockReturnThis(),
    },
    FadeInUp: {
      duration: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
      easing: jest.fn().mockReturnThis(),
      springify: jest.fn().mockReturnThis(),
      withInitialValues: jest.fn().mockReturnThis(),
      mass: jest.fn().mockReturnThis(),
    },
    FadeInDown: {
      duration: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
      easing: jest.fn().mockReturnThis(),
      springify: jest.fn().mockReturnThis(),
      withInitialValues: jest.fn().mockReturnThis(),
      mass: jest.fn().mockReturnThis(),
    },
    FadeOutUp: {
      duration: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
      easing: jest.fn().mockReturnThis(),
      springify: jest.fn().mockReturnThis(),
      withInitialValues: jest.fn().mockReturnThis(),
      mass: jest.fn().mockReturnThis(),
    },
    FadeOutDown: {
      duration: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
      easing: jest.fn().mockReturnThis(),
      springify: jest.fn().mockReturnThis(),
      withInitialValues: jest.fn().mockReturnThis(),
      mass: jest.fn().mockReturnThis(),
    },
    SlideInUp: {
      duration: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
      easing: jest.fn().mockReturnThis(),
      springify: jest.fn().mockReturnThis(),
      withInitialValues: jest.fn().mockReturnThis(),
      mass: jest.fn().mockReturnThis(),
    },
    SlideOutDown: {
      duration: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
      easing: jest.fn().mockReturnThis(),
      springify: jest.fn().mockReturnThis(),
      withInitialValues: jest.fn().mockReturnThis(),
      mass: jest.fn().mockReturnThis(),
    },
    Keyframe: jest.fn().mockImplementation((config) => ({
      duration: jest.fn().mockReturnThis(),
      delay: jest.fn().mockReturnThis(),
      withCallback: jest.fn().mockReturnThis(),
    })),
    Extrapolation: {
      CLAMP: 'clamp',
      EXTEND: 'extend',
      IDENTITY: 'identity',
    },
    LinearTransition: {
      springify: jest.fn(() => ({
        damping: jest.fn().mockReturnThis(),
        stiffness: jest.fn().mockReturnThis(),
        mass: jest.fn().mockReturnThis(),
      })),
    },
    FadingTransition: {
      springify: jest.fn(() => ({
        damping: jest.fn().mockReturnThis(),
        stiffness: jest.fn().mockReturnThis(),
        mass: jest.fn().mockReturnThis(),
      })),
    },
    configureReanimatedLogger: jest.fn(),
    ReanimatedLogLevel: {
      warn: 0,
      error: 1,
    },
  },
};

module.exports = {
  __esModule: true,
  ...Reanimated.default,
  default: Reanimated.default,
};
