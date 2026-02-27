/**
 * Auth Context Provider
 * Initializes auth state from storage on app start and provides auth context
 */
import React, {createContext, useContext, useEffect, ReactNode} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {loadStoredUser, signOut} from '../redux/slices/authSlice';
import {User} from '../types';
import {isTokenExpired} from '../utils/jwtUtils';
import logger from '../utils/logger';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const dispatch = useAppDispatch();
  const {user, token, isAuthenticated, isLoading} = useAppSelector(
    state => state.auth,
  );

  // Load stored user on mount
  useEffect(() => {
    dispatch(loadStoredUser());
  }, [dispatch]);

  // Check token expiry when app comes to foreground or periodically
  useEffect(() => {
    // Function to validate token and logout if expired
    const validateToken = async () => {
      if (isAuthenticated && token) {
        if (isTokenExpired(token)) {
          logger.info('Token expired while app running. Logging out.');
          dispatch(signOut());
        }
      }
    };

    // Check immediately
    validateToken();

    // Check when app state changes (e.g., coming back from background)
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          validateToken();
        }
      },
    );

    // Also check periodically every hour
    const intervalId = setInterval(
      validateToken,
      60 * 60 * 1000, // 1 hour
    );

    return () => {
      subscription.remove();
      clearInterval(intervalId);
    };
  }, [isAuthenticated, token, dispatch]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    userId: user?._id || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access auth context
 * Use this for quick access to user/token in components
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
