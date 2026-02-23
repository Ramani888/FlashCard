/**
 * Test utilities for the FlashCard application
 * Provides common helpers for writing tests
 */
import React, {ReactElement} from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {configureStore, Reducer} from '@reduxjs/toolkit';
import {render, RenderOptions} from '@testing-library/react-native';
import authSlice from '../../src/redux/slices/authSlice';
import themeSlice from '../../src/redux/slices/themeSlice';
import folderSlice from '../../src/redux/slices/folderSlice';
import appSlice from '../../src/redux/slices/appSlice';

// Mock user data
export const mockUser = {
  _id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  token: 'mock-token-12345',
  profilePic: 'https://example.com/avatar.jpg',
  isSubscribed: true,
  subscriptionType: 'premium' as const,
};

// Mock folder data
export const mockFolder = {
  _id: 'folder-123',
  name: 'Test Folder',
  color: '#FF0000',
  userId: 'user-123',
  isHighlight: true,
  setsCount: 5,
};

// Mock set data
export const mockCardSet = {
  _id: 'set-123',
  name: 'Test Set',
  color: '#00FF00',
  folderId: 'folder-123',
  userId: 'user-123',
  isHighlight: false,
  cardsCount: 10,
};

// Mock card data
export const mockCard = {
  _id: 'card-123',
  front: 'What is React?',
  back: 'A JavaScript library for building user interfaces',
  setId: 'set-123',
  userId: 'user-123',
  type: 'text' as const,
  isBlurred: false,
  position: 1,
};

// Create a custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<{
    auth: ReturnType<typeof authSlice>;
    theme: ReturnType<typeof themeSlice>;
    folders: ReturnType<typeof folderSlice>;
    app: ReturnType<typeof appSlice>;
  }>;
  store?: any;
}

export const createTestStore = (preloadedState?: CustomRenderOptions['preloadedState']) => {
  return configureStore({
    reducer: {
      auth: authSlice as Reducer,
      theme: themeSlice as Reducer,
      folders: folderSlice as Reducer,
      app: appSlice as Reducer,
    },
    preloadedState,
  });
};

export const renderWithProviders = (
  ui: ReactElement,
  options: CustomRenderOptions = {},
) => {
  const {preloadedState, store: testStore = createTestStore(preloadedState), ...renderOptions} = options;
  
  function Wrapper({children}: {children: React.ReactNode}) {
    return (
      <Provider store={testStore}>
        <NavigationContainer>{children}</NavigationContainer>
      </Provider>
    );
  }

  return {
    store: testStore,
    ...render(ui, {wrapper: Wrapper, ...renderOptions}),
  };
};

// Wait utilities
export const waitForAsync = (ms = 0) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

export const flushPromises = () =>
  new Promise<void>(resolve => setImmediate(resolve));

// API mock helpers
export const createMockApiResponse = <T>(data: T, success = true) => ({
  success,
  message: success ? 'Success' : 'Error',
  data,
});

export const createMockError = (message = 'Something went wrong', code = 'UNKNOWN') => ({
  message,
  code,
  status: 500,
});

// Navigation mock
export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(),
  dispatch: jest.fn(),
  canGoBack: jest.fn().mockReturnValue(true),
  isFocused: jest.fn().mockReturnValue(true),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
});

export const createMockRoute = <T extends object>(params?: T) => ({
  key: 'test-route',
  name: 'TestScreen',
  params: params || {},
});

// Re-export testing library utilities
export * from '@testing-library/react-native';
export {renderWithProviders as render};
