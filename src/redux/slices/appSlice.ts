import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppState} from '../../types';

const initialState: AppState = {
  isOnline: true,
  isAppReady: false,
  language: 'en',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setAppReady: (state, action: PayloadAction<boolean>) => {
      state.isAppReady = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const {setOnlineStatus, setAppReady, setLanguage} = appSlice.actions;
export default appSlice.reducer;
