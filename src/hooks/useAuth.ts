/**
 * Custom hook for authentication state management
 * Provides login, logout, and user session management
 */
import {useCallback} from 'react';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  signIn,
  signOut,
  signUp,
  loadStoredUser,
  updateProfile,
  clearError,
} from '../redux/slices/authSlice';
import {User} from '../types';

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<boolean>;
  clearAuthError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();
  const {user, token, isAuthenticated, isLoading, error} = useAppSelector(
    state => state.auth,
  );

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const result = await dispatch(signIn({email, password})).unwrap();
        return !!result;
      } catch {
        return false;
      }
    },
    [dispatch],
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      name: string,
    ): Promise<boolean> => {
      try {
        const result = await dispatch(
          signUp({email, password, name}),
        ).unwrap();
        return !!result;
      } catch {
        return false;
      }
    },
    [dispatch],
  );

  const logout = useCallback(async (): Promise<void> => {
    await dispatch(signOut());
  }, [dispatch]);

  const loadUser = useCallback(async (): Promise<void> => {
    await dispatch(loadStoredUser());
  }, [dispatch]);

  const updateUserProfile = useCallback(
    async (data: Partial<User>): Promise<boolean> => {
      try {
        await dispatch(updateProfile(data)).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [dispatch],
  );

  const clearAuthError = useCallback((): void => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    loadUser,
    updateUserProfile,
    clearAuthError,
  };
};

export default useAuth;
