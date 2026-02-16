/**
 * Auth Context Provider
 * Initializes auth state from storage on app start and provides auth context
 */
import React, {createContext, useContext, useEffect, ReactNode} from 'react';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {loadStoredUser} from '../redux/slices/authSlice';
import {User} from '../types';

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
