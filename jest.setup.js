/**
 * Jest setup file
 * Configure mocks and global test utilities
 */
import 'react-native-gesture-handler/jestSetup';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock Encrypted Storage
jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn().mockResolvedValue({
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
  }),
  addEventListener: jest.fn(() => jest.fn()),
}));

// Mock Firebase
jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: () => ({
    collection: () => ({
      get: jest.fn().mockResolvedValue({
        docs: [],
      }),
    }),
  }),
}));

// Mock react-native-device-info
jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn().mockResolvedValue('1.0.0'),
  getBuildNumber: jest.fn().mockResolvedValue('1'),
  getUniqueId: jest.fn().mockResolvedValue('test-unique-id'),
}));

// Mock react-native-iap
jest.mock('react-native-iap', () => ({
  withIAPContext: (Component) => Component,
  useIAP: () => ({
    connected: true,
    products: [],
    subscriptions: [],
  }),
}));

// Mock Google Mobile Ads
jest.mock('react-native-google-mobile-ads', () => ({
  MobileAds: {
    initialize: jest.fn(() => Promise.resolve()),
    setRequestConfiguration: jest.fn(() => Promise.resolve()),
  },
  AdsConsent: {
    requestInfoUpdate: jest.fn(() => Promise.resolve()),
    getConsentStatus: jest.fn(() => Promise.resolve(1)),
  },
  AdsConsentStatus: {
    OBTAINED: 1,
    REQUIRED: 2,
    NOT_REQUIRED: 3,
    UNKNOWN: 0,
  },
  InterstitialAd: {
    createForAdRequest: jest.fn(() => ({
      load: jest.fn(),
      show: jest.fn(),
      addAdEventListener: jest.fn(() => jest.fn()),
    })),
  },
  RewardedAd: {
    createForAdRequest: jest.fn(() => ({
      load: jest.fn(),
      show: jest.fn(),
      addAdEventListener: jest.fn(() => jest.fn()),
    })),
  },
  BannerAd: jest.fn(() => null),
  BannerAdSize: {
    BANNER: 'BANNER',
    FULL_BANNER: 'FULL_BANNER',
    LARGE_BANNER: 'LARGE_BANNER',
  },
  TestIds: {
    BANNER: 'ca-app-pub-3940256099942544/6300978111',
    INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
    REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  },
}));

// Mock react-native-linear-gradient
jest.mock('react-native-linear-gradient', () => 'LinearGradient');

// Mock @rneui/themed
jest.mock('@rneui/themed', () => ({
  Avatar: 'Avatar',
  Button: 'Button',
  Input: 'Input',
  Text: 'Text',
}));

// Mock react-native-popup-menu
jest.mock('react-native-popup-menu', () => ({
  Menu: 'Menu',
  MenuTrigger: 'MenuTrigger',
  MenuOptions: 'MenuOptions',
  MenuOption: 'MenuOption',
  renderers: {},
}));

// Mock toggle-switch-react-native
jest.mock('toggle-switch-react-native', () => 'ToggleSwitch');

// Mock react-native-localization
jest.mock('react-native-localization', () => {
  const mockStrings = {
    setLanguage: jest.fn(),
    getLanguage: jest.fn(() => 'en'),
    getInterfaceLanguage: jest.fn(() => 'en'),
    formatString: jest.fn((str) => str),
  };
  return jest.fn(() => mockStrings);
});

// Mock react-native-indicators
jest.mock('react-native-indicators', () => ({
  UIActivityIndicator: 'UIActivityIndicator',
  BallIndicator: 'BallIndicator',
  BarIndicator: 'BarIndicator',
  DotIndicator: 'DotIndicator',
  MaterialIndicator: 'MaterialIndicator',
  PacmanIndicator: 'PacmanIndicator',
  PulseIndicator: 'PulseIndicator',
  SkypeIndicator: 'SkypeIndicator',
  WaveIndicator: 'WaveIndicator',
}));

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/AntDesign', () => 'AntDesign');
jest.mock('react-native-vector-icons/FontAwesome6', () => 'FontAwesome6');
jest.mock('react-native-vector-icons/Feather', () => 'Feather');
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
jest.mock('react-native-vector-icons/Entypo', () => 'Entypo');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useIsFocused: () => true,
  useFocusEffect: jest.fn(),
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock timers
jest.useFakeTimers();
