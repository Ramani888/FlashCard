/**
 * Secure Storage Service
 * Uses encrypted storage for sensitive data like auth tokens
 * Falls back to AsyncStorage for non-sensitive data
 */
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config';

interface StorageService {
  // Secure storage methods (encrypted)
  setSecureItem: (key: string, value: string) => Promise<void>;
  getSecureItem: (key: string) => Promise<string | null>;
  removeSecureItem: (key: string) => Promise<void>;
  clearSecureStorage: () => Promise<void>;

  // Regular storage methods (for non-sensitive data)
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

class SecureStorageServiceImpl implements StorageService {
  // ========== SECURE STORAGE (Encrypted) ==========

  /**
   * Store sensitive data securely (encrypted)
   * Use for tokens, passwords, API keys, etc.
   */
  async setSecureItem(key: string, value: string): Promise<void> {
    try {
      console.log(`[SecureStorage] Setting secure item: ${key}`);
      await EncryptedStorage.setItem(key, value);
      console.log(`[SecureStorage] Secure item set successfully: ${key}`);
    } catch (error) {
      console.error(`[SecureStorage] Error setting secure item ${key}:`, error);
      throw new Error('Failed to store secure data');
    }
  }

  /**
   * Retrieve sensitive data from secure storage
   */
  async getSecureItem(key: string): Promise<string | null> {
    try {
      console.log(`[SecureStorage] Getting secure item: ${key}`);
      const value = await EncryptedStorage.getItem(key);
      if (value) {
        console.log(`[SecureStorage] Secure item retrieved: ${key}`);
      } else {
        console.log(`[SecureStorage] Secure item not found: ${key}`);
      }
      return value;
    } catch (error) {
      console.error(`[SecureStorage] Error getting secure item ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove sensitive data from secure storage
   */
  async removeSecureItem(key: string): Promise<void> {
    try {
      await EncryptedStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing secure item ${key}:`, error);
      throw new Error('Failed to remove secure data');
    }
  }

  /**
   * Clear all encrypted storage
   * Use with caution - logs out user
   */
  async clearSecureStorage(): Promise<void> {
    try {
      await EncryptedStorage.clear();
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      throw new Error('Failed to clear secure storage');
    }
  }

  // ========== REGULAR STORAGE (Not Encrypted) ==========
  // Use for non-sensitive data like preferences, cache, etc.

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw new Error('Failed to store data');
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw new Error('Failed to remove data');
    }
  }

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error('Failed to clear storage');
    }
  }

  // ========== CONVENIENCE METHODS ==========

  /**
   * Store auth token securely
   */
  async setAuthToken(token: string): Promise<void> {
    await this.setSecureItem(Config.STORAGE_KEYS.TOKEN, token);
  }

  /**
   * Get auth token
   */
  async getAuthToken(): Promise<string | null> {
    return await this.getSecureItem(Config.STORAGE_KEYS.TOKEN);
  }

  /**
   * Store user data (contains sensitive info)
   */
  async setUserData(userData: object): Promise<void> {
    console.log('[SecureStorage] Storing user data...');
    await this.setSecureItem(
      Config.STORAGE_KEYS.USER,
      JSON.stringify(userData),
    );
    console.log('[SecureStorage] User data stored successfully');
  }

  /**
   * Get user data
   */
  async getUserData<T = object>(): Promise<T | null> {
    console.log('[SecureStorage] Retrieving user data...');
    const data = await this.getSecureItem(Config.STORAGE_KEYS.USER);
    if (data) {
      try {
        const parsed = JSON.parse(data) as T;
        console.log('[SecureStorage] User data retrieved successfully');
        return parsed;
      } catch (error) {
        console.error('[SecureStorage] Error parsing user data:', error);
        return null;
      }
    }
    console.log('[SecureStorage] No user data found');
    return null;
  }

  /**
   * Complete logout - clear all sensitive data
   */
  async logout(): Promise<void> {
    try {
      await this.clearSecureStorage();
      // Optionally clear non-secure storage too
      // await this.clearAll();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    return token !== null;
  }
}

// Export singleton instance
const secureStorage = new SecureStorageServiceImpl();
export default secureStorage;
