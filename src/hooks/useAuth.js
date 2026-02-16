/**
 * Custom hook for authentication state management
 * Replaces global.user and global.token with proper React state
 */
import {useState, useEffect, useCallback, useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
};

/**
 * Hook to manage authenticated user state
 * @returns {Object} Auth state and methods
 */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from storage on mount
  useEffect(() => {
    loadStoredUser();
  }, []);

  // Load user from AsyncStorage
  const loadStoredUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(parsedUser?.token);
        setIsAuthenticated(true);
        // Keep global vars for backward compatibility
        global.user = parsedUser;
        global.token = parsedUser?.token;
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign in user
  const signIn = useCallback(async (userData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setUser(userData);
      setToken(userData?.token);
      setIsAuthenticated(true);
      // Keep global vars for backward compatibility
      global.user = userData;
      global.token = userData?.token;
      return true;
    } catch (error) {
      console.error('Error signing in:', error);
      return false;
    }
  }, []);

  // Sign out user
  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      // Clear global vars
      global.user = null;
      global.token = null;
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      return false;
    }
  }, []);

  // Update user profile
  const updateUser = useCallback(async (updatedData) => {
    try {
      const newUserData = {...user, ...updatedData};
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUserData));
      setUser(newUserData);
      // Update global var for backward compatibility
      global.user = newUserData;
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }, [user]);

  // Memoized return value
  return useMemo(() => ({
    user,
    token,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    updateUser,
    loadStoredUser,
  }), [user, token, isLoading, isAuthenticated, signIn, signOut, updateUser, loadStoredUser]);
};

export default useAuth;
