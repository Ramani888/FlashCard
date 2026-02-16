import {configureStore, combineReducers} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import folderReducer from './slices/folderSlice';
import appReducer from './slices/appSlice';

// Legacy reducer for backward compatibility
import legacyReducer from './StateSlice';

const rootReducer = combineReducers({
  // New typed slices
  auth: authReducer,
  theme: themeReducer,
  folders: folderReducer,
  app: appReducer,
  // Legacy slice for backward compatibility
  myState: legacyReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: __DEV__,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
