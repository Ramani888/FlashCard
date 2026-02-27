module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-redux|@reduxjs/toolkit|@rneui|react-native-size-matters|react-native-popup-menu)/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/', 'testUtils', 'App.test.tsx'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{js,ts}',
    '!src/types/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/component/$1',
    '^@screens/(.*)$': '<rootDir>/src/screen/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@redux/(.*)$': '<rootDir>/src/redux/$1',
    '^@api/(.*)$': '<rootDir>/src/Api/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  testTimeout: 10000,
  verbose: true,
};
