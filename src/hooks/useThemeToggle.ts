/**
 * Custom hook for managing theme toggle functionality
 * Handles AsyncStorage persistence and Redux state updates
 */
import {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setTheme as setReduxTheme} from '../redux/slices/themeSlice';
import logger from '../utils/logger';

type ThemeType = 'Light' | 'Dark';

interface UseThemeToggleReturn {
  theme: ThemeType;
  toggleTheme: () => void;
  isDarkMode: boolean;
  isInitialized: boolean;
}

const useThemeToggle = (): UseThemeToggleReturn => {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState<ThemeType>('Light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial theme from storage
  useEffect(() => {
    const loadInitialTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        const initialTheme: ThemeType =
          storedTheme && storedTheme !== 'null'
            ? (storedTheme as ThemeType)
            : 'Light';
        setTheme(initialTheme);
        setIsInitialized(true);
      } catch (error) {
        logger.error('Error loading theme:', error);
        setTheme('Light');
        setIsInitialized(true);
      }
    };

    loadInitialTheme();
  }, []);

  // Persist theme changes and update Redux
  useEffect(() => {
    if (!isInitialized) return;

    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('theme', theme);
        dispatch(setReduxTheme(theme));
      } catch (error) {
        logger.error('Error saving theme:', error);
      }
    };

    saveTheme();
  }, [theme, isInitialized, dispatch]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'Light' ? 'Dark' : 'Light'));
  }, []);

  const isDarkMode = theme === 'Dark';

  return {
    theme,
    toggleTheme,
    isDarkMode,
    isInitialized,
  };
};

export {useThemeToggle};
export default useThemeToggle;
