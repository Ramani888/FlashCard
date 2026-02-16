import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeState} from '../../types';
import Config from '../../config';

const initialState: ThemeState = {
  theme: 'Light',
  isDarkMode: false,
};

// Async thunk to load theme from storage
export const loadStoredTheme = createAsyncThunk(
  'theme/loadStoredTheme',
  async () => {
    try {
      const theme = await AsyncStorage.getItem(Config.STORAGE_KEYS.THEME);
      if (theme && (theme === 'Light' || theme === 'Dark')) {
        return theme as 'Light' | 'Dark';
      }
      return 'Light';
    } catch {
      return 'Light';
    }
  },
);

// Async thunk to save theme to storage
export const setThemeAsync = createAsyncThunk(
  'theme/setThemeAsync',
  async (theme: 'Light' | 'Dark') => {
    await AsyncStorage.setItem(Config.STORAGE_KEYS.THEME, theme);
    return theme;
  },
);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'Light' | 'Dark'>) => {
      state.theme = action.payload;
      state.isDarkMode = action.payload === 'Dark';
    },
    toggleTheme: state => {
      state.theme = state.theme === 'Light' ? 'Dark' : 'Light';
      state.isDarkMode = !state.isDarkMode;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadStoredTheme.fulfilled, (state, action) => {
        state.theme = action.payload;
        state.isDarkMode = action.payload === 'Dark';
      })
      .addCase(setThemeAsync.fulfilled, (state, action) => {
        state.theme = action.payload;
        state.isDarkMode = action.payload === 'Dark';
      });
  },
});

export const {setTheme, toggleTheme} = themeSlice.actions;
export default themeSlice.reducer;
