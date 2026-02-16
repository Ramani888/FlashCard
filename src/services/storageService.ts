/**
 * Storage Service
 * Centralized service for handling AsyncStorage operations
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config';

class StorageService {
  /**
   * Get item from storage
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        return JSON.parse(value) as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return null;
    }
  }

  /**
   * Set item in storage
   */
  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
      return false;
    }
  }

  /**
   * Remove item from storage
   */
  async remove(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  }

  /**
   * Clear all storage
   */
  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Get multiple items
   */
  async getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result: Record<string, T | null> = {};
      pairs.forEach(([key, value]) => {
        result[key] = value ? (JSON.parse(value) as T) : null;
      });
      return result;
    } catch (error) {
      console.error('Error getting multiple items from storage:', error);
      return {};
    }
  }

  /**
   * Set multiple items
   */
  async setMultiple<T>(items: Record<string, T>): Promise<boolean> {
    try {
      const pairs: Array<[string, string]> = Object.entries(items).map(
        ([key, value]) => [key, JSON.stringify(value)],
      );
      await AsyncStorage.multiSet(pairs);
      return true;
    } catch (error) {
      console.error('Error setting multiple items in storage:', error);
      return false;
    }
  }

  /**
   * Get all keys
   */
  async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys from storage:', error);
      return [];
    }
  }

  // Convenience methods for common operations
  async getUser() {
    return this.get(Config.STORAGE_KEYS.USER);
  }

  async setUser<T>(user: T) {
    return this.set(Config.STORAGE_KEYS.USER, user);
  }

  async removeUser() {
    return this.remove(Config.STORAGE_KEYS.USER);
  }

  async getTheme() {
    return this.get<string>(Config.STORAGE_KEYS.THEME);
  }

  async setTheme(theme: string) {
    return this.set(Config.STORAGE_KEYS.THEME, theme);
  }

  async getLanguage() {
    return this.get(Config.STORAGE_KEYS.LANGUAGE);
  }

  async setLanguage<T>(language: T) {
    return this.set(Config.STORAGE_KEYS.LANGUAGE, language);
  }
}

// Singleton instance
const storageService = new StorageService();
export default storageService;
