import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthState, User} from '../../types';
import Config from '../../config';
import apiService from '../../services/apiService';
import Api from '../../Api/EndPoint';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loadStoredUser = createAsyncThunk(
  'auth/loadStoredUser',
  async (_, {rejectWithValue}) => {
    try {
      const userData = await AsyncStorage.getItem(Config.STORAGE_KEYS.USER);
      if (userData) {
        const user = JSON.parse(userData) as User;
        return {user, token: user.token};
      }
      return null;
    } catch (error) {
      return rejectWithValue('Failed to load user data');
    }
  },
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (
    credentials: {email: string; password: string},
    {rejectWithValue},
  ) => {
    try {
      const response = await apiService.post(Api.signIn, credentials);
      if (response.success && response.data) {
        const user = response.data as User;
        await AsyncStorage.setItem(
          Config.STORAGE_KEYS.USER,
          JSON.stringify(user),
        );
        return {user, token: user.token};
      }
      return rejectWithValue(response.message || 'Sign in failed');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      return rejectWithValue(message);
    }
  },
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (
    userData: {email: string; password: string; name: string},
    {rejectWithValue},
  ) => {
    try {
      const response = await apiService.post(Api.signUp, userData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Sign up failed');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      return rejectWithValue(message);
    }
  },
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await AsyncStorage.removeItem(Config.STORAGE_KEYS.USER);
  await AsyncStorage.removeItem(Config.STORAGE_KEYS.TOKEN);
  return null;
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>, {getState, rejectWithValue}) => {
    try {
      const state = getState() as {auth: AuthState};
      const response = await apiService.put(Api.profile, profileData);
      if (response.success && response.data) {
        const updatedUser = {...state.auth.user, ...response.data} as User;
        await AsyncStorage.setItem(
          Config.STORAGE_KEYS.USER,
          JSON.stringify(updatedUser),
        );
        return updatedUser;
      }
      return rejectWithValue(response.message || 'Profile update failed');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Profile update failed';
      return rejectWithValue(message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{user: User | null; token: string | null}>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.user;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Load stored user
      .addCase(loadStoredUser.pending, state => {
        state.isLoading = true;
      })
      .addCase(loadStoredUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(loadStoredUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Sign in
      .addCase(signIn.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Sign up
      .addCase(signUp.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Sign out
      .addCase(signOut.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Update profile
      .addCase(updateProfile.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {setUser, setToken, clearError, logout} = authSlice.actions;
export default authSlice.reducer;
