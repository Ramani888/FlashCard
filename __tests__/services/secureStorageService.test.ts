/**
 * Tests for secure storage service
 */
import secureStorage from '../../src/services/secureStorageService';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mocks are already set up in jest.setup.js
describe('Secure Storage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Secure Storage (Encrypted)', () => {
    describe('setSecureItem', () => {
      it('should store item in encrypted storage', async () => {
        await secureStorage.setSecureItem('token', 'test-token-123');
        expect(EncryptedStorage.setItem).toHaveBeenCalledWith('token', 'test-token-123');
      });

      it('should throw error on failure', async () => {
        (EncryptedStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
        
        await expect(secureStorage.setSecureItem('token', 'value')).rejects.toThrow('Failed to store secure data');
      });
    });

    describe('getSecureItem', () => {
      it('should retrieve item from encrypted storage', async () => {
        (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce('test-token-123');
        
        const result = await secureStorage.getSecureItem('token');
        expect(result).toBe('test-token-123');
        expect(EncryptedStorage.getItem).toHaveBeenCalledWith('token');
      });

      it('should return null if item not found', async () => {
        (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
        
        const result = await secureStorage.getSecureItem('nonexistent');
        expect(result).toBeNull();
      });

      it('should return null on error', async () => {
        (EncryptedStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
        
        const result = await secureStorage.getSecureItem('token');
        expect(result).toBeNull();
      });
    });

    describe('removeSecureItem', () => {
      it('should remove item from encrypted storage', async () => {
        await secureStorage.removeSecureItem('token');
        expect(EncryptedStorage.removeItem).toHaveBeenCalledWith('token');
      });

      it('should throw error on failure', async () => {
        (EncryptedStorage.removeItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
        
        await expect(secureStorage.removeSecureItem('token')).rejects.toThrow('Failed to remove secure data');
      });
    });

    describe('clearSecureStorage', () => {
      it('should clear all encrypted storage', async () => {
        await secureStorage.clearSecureStorage();
        expect(EncryptedStorage.clear).toHaveBeenCalled();
      });

      it('should throw error on failure', async () => {
        (EncryptedStorage.clear as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
        
        await expect(secureStorage.clearSecureStorage()).rejects.toThrow('Failed to clear secure storage');
      });
    });
  });

  describe('Regular Storage (Not Encrypted)', () => {
    describe('setItem', () => {
      it('should store item in AsyncStorage', async () => {
        await secureStorage.setItem('theme', 'dark');
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      });

      it('should throw error on failure', async () => {
        (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
        
        await expect(secureStorage.setItem('theme', 'dark')).rejects.toThrow('Failed to store data');
      });
    });

    describe('getItem', () => {
      it('should retrieve item from AsyncStorage', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('dark');
        
        const result = await secureStorage.getItem('theme');
        expect(result).toBe('dark');
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('theme');
      });

      it('should return null if item not found', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
        
        const result = await secureStorage.getItem('nonexistent');
        expect(result).toBeNull();
      });

      it('should return null on error', async () => {
        (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
        
        const result = await secureStorage.getItem('theme');
        expect(result).toBeNull();
      });
    });

    describe('removeItem', () => {
      it('should remove item from AsyncStorage', async () => {
        await secureStorage.removeItem('theme');
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('theme');
      });

      it('should throw error on failure', async () => {
        (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
        
        await expect(secureStorage.removeItem('theme')).rejects.toThrow('Failed to remove data');
      });
    });

    describe('clearAll', () => {
      it('should clear all AsyncStorage', async () => {
        await secureStorage.clearAll();
        expect(AsyncStorage.clear).toHaveBeenCalled();
      });

      it('should throw error on failure', async () => {
        (AsyncStorage.clear as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
        
        await expect(secureStorage.clearAll()).rejects.toThrow('Failed to clear storage');
      });
    });
  });

  describe('Convenience Methods', () => {
    describe('Auth Token', () => {
      it('should set auth token', async () => {
        await secureStorage.setAuthToken('token-123');
        expect(EncryptedStorage.setItem).toHaveBeenCalledWith('token', 'token-123');
      });

      it('should get auth token', async () => {
        (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce('token-123');
        
        const token = await secureStorage.getAuthToken();
        expect(token).toBe('token-123');
        expect(EncryptedStorage.getItem).toHaveBeenCalledWith('token');
      });
    });

    describe('User Data', () => {
      it('should set user data', async () => {
        const userData = {id: '1', name: 'Test User', email: 'test@example.com'};
        await secureStorage.setUserData(userData);
        
        expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
          'user',
          JSON.stringify(userData)
        );
      });

      it('should get user data', async () => {
        const userData = {id: '1', name: 'Test User', email: 'test@example.com'};
        (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(userData));
        
        const result = await secureStorage.getUserData();
        expect(result).toEqual(userData);
      });

      it('should return null for invalid JSON', async () => {
        (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce('invalid-json');
        
        const result = await secureStorage.getUserData();
        expect(result).toBeNull();
      });
    });

    describe('Logout', () => {
      it('should clear all secure data on logout', async () => {
        await secureStorage.logout();
        
        expect(EncryptedStorage.clear).toHaveBeenCalled();
      });

      it('should throw error if clearing fails', async () => {
        (EncryptedStorage.clear as jest.Mock).mockRejectedValueOnce(new Error('Clear error'));
        
        await expect(secureStorage.logout()).rejects.toThrow();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle EncryptedStorage errors gracefully', async () => {
      (EncryptedStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Encryption error'));
      
      const result = await secureStorage.getSecureItem('token');
      expect(result).toBeNull();
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
      
      const result = await secureStorage.getItem('theme');
      expect(result).toBeNull();
    });
  });
});
