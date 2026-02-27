import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {AuthState, User} from '../../types';
import apiService from '../../services/apiService';
import secureStorage from '../../services/secureStorageService';
import Api from '../../Api/EndPoint';
import {isTokenExpired} from '../../utils/jwtUtils';
import logger from '../../utils/logger';
import {migrateUserDataToSecureStorage} from '../../utils/storageMigration';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start as true to wait for initial auth check
  error: null,
};

// Async thunks
export const loadStoredUser = createAsyncThunk(
  'auth/loadStoredUser',
  async (_, {rejectWithValue}) => {
    try {
      logger.info('Starting loadStoredUser...');
      
      // First, attempt migration from old AsyncStorage
      await migrateUserDataToSecureStorage();
      
      const user = await secureStorage.getUserData<User>();
      
      if (!user) {
        logger.info('No user data found in storage');
        return null;
      }
      
      if (!user.token) {
        logger.info('User data found but no token');
        return null;
      }
      
      logger.info('User data loaded, checking token expiry...');
      
      // Check if token is expired
      if (isTokenExpired(user.token)) {
        logger.info('Token expired. Clearing stored credentials.');
        // Token is expired, clear storage and force logout
        await secureStorage.logout();
        apiService.setAuthToken(null);
        return null;
      }
      
      // Token is valid, update apiService with the token for authenticated requests
      logger.info('Token valid. Setting in apiService and authenticating user.');
      apiService.setAuthToken(user.token);
      return {user, token: user.token};
    } catch (error) {
      logger.error('Failed to load stored user:', error);
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
      logger.info('Signing in...');
      logger.info('Credentials:', {email: credentials.email, passwordLength: credentials.password?.length});
      
      const response = await apiService.post(Api.signIn, credentials);
      
      logger.info('Login API response:', {
        success: response.success,
        hasData: !!response.data,
        hasUser: !!(response as any).user,
        message: response.message
      });
      
      // Backend returns user data in 'user' field, not 'data' field
      if (response.success && (response as any).user) {
        const user = (response as any).user as User;
        
        if (!user.token) {
          logger.error('User data received but no token present');
          return rejectWithValue('Authentication failed: No token received');
        }
        
        logger.info('Sign in successful, storing user data...');
        
        // Store user data and token securely
        await secureStorage.setUserData(user);
        await secureStorage.setAuthToken(user.token);
        
        logger.info('User data stored in secure storage');
        
        // Update apiService with the token for authenticated requests
        apiService.setAuthToken(user.token);
        
        logger.info('Token set in apiService, sign in complete');
        return {user, token: user.token};
      }
      
      logger.error('Login failed:', response.message);
      return rejectWithValue(response.message || 'Sign in failed');
    } catch (error: unknown) {
      logger.error('Sign in error:', error);
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
  // Clear all secure storage on logout
  await secureStorage.logout();
  // Clear token from apiService
  apiService.setAuthToken(null);
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
        // Update secure storage
        await secureStorage.setUserData(updatedUser);
        // Update token in apiService if it changed
        if (updatedUser.token) {
          apiService.setAuthToken(updatedUser.token);
        }
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
      .addCase(signOut.pending, state => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signOut.rejected, state => {
        // Even if signOut fails, clear the state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
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
