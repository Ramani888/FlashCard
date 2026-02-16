/**
 * Unit tests for Language Service
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import languageService, {
  SUPPORTED_LANGUAGES,
} from '../../src/services/languageService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('../../src/language/strings', () => ({
  setLanguage: jest.fn(),
}));

describe('LanguageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('SUPPORTED_LANGUAGES', () => {
    it('should contain expected languages', () => {
      expect(SUPPORTED_LANGUAGES.length).toBeGreaterThan(0);
      expect(SUPPORTED_LANGUAGES.find(l => l.code === 'en')).toBeDefined();
      expect(SUPPORTED_LANGUAGES.find(l => l.code === 'es')).toBeDefined();
    });

    it('should have required properties for each language', () => {
      SUPPORTED_LANGUAGES.forEach(lang => {
        expect(lang).toHaveProperty('code');
        expect(lang).toHaveProperty('name');
        expect(lang).toHaveProperty('nativeName');
      });
    });
  });

  describe('getLanguageCode', () => {
    it('should return code for language name', () => {
      expect(languageService.getLanguageCode('English')).toBe('en');
      expect(languageService.getLanguageCode('Español')).toBe('es');
    });

    it('should return code as-is if already a code', () => {
      expect(languageService.getLanguageCode('en')).toBe('en');
      expect(languageService.getLanguageCode('es')).toBe('es');
    });

    it('should default to en for unknown languages', () => {
      expect(languageService.getLanguageCode('Unknown')).toBe('en');
    });
  });

  describe('getLanguageByCode', () => {
    it('should return language info for valid code', () => {
      const english = languageService.getLanguageByCode('en');
      expect(english).toBeDefined();
      expect(english?.name).toBe('English');
    });

    it('should return undefined for invalid code', () => {
      const result = languageService.getLanguageByCode('invalid');
      expect(result).toBeUndefined();
    });
  });

  describe('isLanguageSupported', () => {
    it('should return true for supported languages', () => {
      expect(languageService.isLanguageSupported('en')).toBe(true);
      expect(languageService.isLanguageSupported('es')).toBe(true);
    });

    it('should return false for unsupported languages', () => {
      expect(languageService.isLanguageSupported('xyz')).toBe(false);
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return all supported languages', () => {
      const languages = languageService.getSupportedLanguages();
      expect(languages).toEqual(SUPPORTED_LANGUAGES);
    });
  });

  describe('saveLanguage', () => {
    it('should save language to AsyncStorage', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const language = {code: 'es', name: 'Spanish', nativeName: 'Español'};
      await languageService.saveLanguage(language);

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
