/**
 * Storage Migration Utility
 * Migrates user data from AsyncStorage to Secure Storage
 * This is needed for users who logged in before the secure storage implementation
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import secureStorage from '../services/secureStorageService';
import Config from '../config';
import logger from './logger';
import {User} from '../types';

/**
 * Migrate user data from AsyncStorage to Secure Storage
 * This should be called once on app startup
 */
export const migrateUserDataToSecureStorage = async (): Promise<boolean> => {
  try {
    logger.info('[Migration] Checking for legacy user data...');
    
    // Check if data already exists in secure storage
    const secureUser = await secureStorage.getUserData<User>();
    if (secureUser) {
      logger.info('[Migration] User data already in secure storage, skipping migration');
      return true;
    }
    
    // Try to get user data from old AsyncStorage location
    const asyncUserData = await AsyncStorage.getItem(Config.STORAGE_KEYS.USER);
    
    if (!asyncUserData) {
      logger.info('[Migration] No legacy user data found in AsyncStorage');
      return true;
    }
    
    logger.info('[Migration] Found legacy user data, migrating...');
    
    const userData = JSON.parse(asyncUserData) as User;
    
    // Migrate to secure storage
    await secureStorage.setUserData(userData);
    
    // Migrate token if present
    if (userData.token) {
      await secureStorage.setAuthToken(userData.token);
    }
    
    logger.info('[Migration] User data migrated successfully');
    
    // Clean up old AsyncStorage data
    await AsyncStorage.removeItem(Config.STORAGE_KEYS.USER);
    logger.info('[Migration] Legacy data cleaned up');
    
    return true;
  } catch (error) {
    logger.error('[Migration] Failed to migrate user data:', error);
    return false;
  }
};

/**
 * Check if migration is needed
 */
export const needsMigration = async (): Promise<boolean> => {
  try {
    const secureUser = await secureStorage.getUserData();
    const asyncUser = await AsyncStorage.getItem(Config.STORAGE_KEYS.USER);
    
    // Migration is needed if there's data in AsyncStorage but not in secure storage
    return !secureUser && !!asyncUser;
  } catch (error) {
    logger.error('[Migration] Error checking migration status:', error);
    return false;
  }
};
