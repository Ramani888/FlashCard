import {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setState} from '../redux/StateSlice';

/**
 * Custom hook for managing theme toggle functionality
 * Handles AsyncStorage persistence and Redux state updates
 * @returns {Object} { theme, toggleTheme, isDarkMode }
 */
const useThemeToggle = () => {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState('Light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial theme from storage
  useEffect(() => {
    const loadInitialTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        const initialTheme = storedTheme && storedTheme !== 'null' 
          ? storedTheme 
          : 'Light';
        setTheme(initialTheme);
        setIsInitialized(true);
      } catch (error) {
        console.log('Error loading theme:', error);
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
        dispatch(setState({theme}));
      } catch (error) {
        console.log('Error saving theme:', error);
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

export default useThemeToggle;
