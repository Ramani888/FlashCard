/**
 * Unit tests for Storage Service
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import storageService from '../../src/services/storageService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  getAllKeys: jest.fn(),
}));

describe('StorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should retrieve and parse stored value', async () => {
      const mockData = {name: 'Test', id: 1};
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockData),
      );

      const result = await storageService.get('testKey');

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('testKey');
      expect(result).toEqual(mockData);
    });

    it('should return null for non-existent key', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await storageService.get('nonExistent');

      expect(result).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error'),
      );

      const result = await storageService.get('testKey');

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should stringify and store value', async () => {
      const mockData = {name: 'Test', id: 1};
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await storageService.set('testKey', mockData);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'testKey',
        JSON.stringify(mockData),
      );
      expect(result).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Storage error'),
      );

      const result = await storageService.set('testKey', {});

      expect(result).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove item from storage', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      const result = await storageService.remove('testKey');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('testKey');
      expect(result).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(
        new Error('Storage error'),
      );

      const result = await storageService.remove('testKey');

      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all storage', async () => {
      (AsyncStorage.clear as jest.Mock).mockResolvedValue(undefined);

      const result = await storageService.clear();

      expect(AsyncStorage.clear).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('getMultiple', () => {
    it('should retrieve multiple items', async () => {
      const mockPairs: [string, string][] = [
        ['key1', JSON.stringify({value: 1})],
        ['key2', JSON.stringify({value: 2})],
      ];
      (AsyncStorage.multiGet as jest.Mock).mockResolvedValue(mockPairs);

      const result = await storageService.getMultiple(['key1', 'key2']);

      expect(result).toEqual({
        key1: {value: 1},
        key2: {value: 2},
      });
    });
  });

  describe('setMultiple', () => {
    it('should set multiple items', async () => {
      (AsyncStorage.multiSet as jest.Mock).mockResolvedValue(undefined);

      const items = {
        key1: {value: 1},
        key2: {value: 2},
      };

      const result = await storageService.setMultiple(items);

      expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
        ['key1', JSON.stringify({value: 1})],
        ['key2', JSON.stringify({value: 2})],
      ]);
      expect(result).toBe(true);
    });
  });
});
