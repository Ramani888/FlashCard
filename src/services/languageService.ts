/**
 * Centralized Language Service
 * Manages app localization and language switching
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from '../language/strings';
import Config from '../config';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
}

// Supported languages
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸'},
  {code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸'},
  {code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷'},
  {code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷'},
  {code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹'},
  {code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪'},
  {code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱'},
  {code: 'zh', name: 'Mandarin', nativeName: '普通话', flag: '🇨🇳'},
  {code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪'},
  {code: 'tl', name: 'Tagalog', nativeName: 'Tagalog', flag: '🇵🇭'},
  {code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳'},
];

// Language name to code mapping
const LANGUAGE_NAME_TO_CODE: Record<string, string> = {
  English: 'en',
  Español: 'es',
  Português: 'pt',
  Français: 'fr',
  Italiano: 'it',
  Deutsch: 'de',
  Polski: 'pl',
  普通话: 'zh',
  Kiswahili: 'sw',
  Tagalog: 'tl',
  हिंदी: 'hi',
};

class LanguageService {
  private currentLanguage: string = 'en';
  private isInitialized: boolean = false;

  /**
   * Initialize the language service
   * Loads saved language preference and applies it
   */
  async initialize(): Promise<string> {
    if (this.isInitialized) {
      return this.currentLanguage;
    }

    try {
      const savedLanguage = await AsyncStorage.getItem(
        Config.STORAGE_KEYS.LANGUAGE,
      );

      if (savedLanguage) {
        const parsed = JSON.parse(savedLanguage);
        const code = this.getLanguageCode(parsed?.name || parsed);
        this.setLanguage(code);
      } else {
        this.setLanguage('en');
      }

      this.isInitialized = true;
      return this.currentLanguage;
    } catch (error) {
      console.error('Failed to initialize language:', error);
      this.setLanguage('en');
      this.isInitialized = true;
      return 'en';
    }
  }

  /**
   * Get language code from language name
   */
  getLanguageCode(name: string): string {
    // If it's already a code, return it
    if (SUPPORTED_LANGUAGES.some(lang => lang.code === name)) {
      return name;
    }
    // Otherwise, look up by name
    return LANGUAGE_NAME_TO_CODE[name] || 'en';
  }

  /**
   * Get language info by code
   */
  getLanguageByCode(code: string): LanguageOption | undefined {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  }

  /**
   * Set the current language
   */
  setLanguage(code: string): void {
    if (SUPPORTED_LANGUAGES.some(lang => lang.code === code)) {
      this.currentLanguage = code;
      strings.setLanguage(code);
    } else {
      console.warn(`Unsupported language code: ${code}, falling back to English`);
      this.currentLanguage = 'en';
      strings.setLanguage('en');
    }
  }

  /**
   * Save language preference and apply it
   */
  async saveLanguage(language: LanguageOption): Promise<void> {
    try {
      await AsyncStorage.setItem(
        Config.STORAGE_KEYS.LANGUAGE,
        JSON.stringify(language),
      );
      this.setLanguage(language.code);
    } catch (error) {
      console.error('Failed to save language:', error);
      throw error;
    }
  }

  /**
   * Get current language code
   */
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Get current language info
   */
  getCurrentLanguageInfo(): LanguageOption | undefined {
    return this.getLanguageByCode(this.currentLanguage);
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): LanguageOption[] {
    return SUPPORTED_LANGUAGES;
  }

  /**
   * Check if a language is supported
   */
  isLanguageSupported(code: string): boolean {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
  }

  /**
   * Get localized string
   */
  getString(key: string): string {
    const value = (strings as unknown as Record<string, unknown>)[key];
    return typeof value === 'string' ? value : key;
  }
}

// Singleton instance
const languageService = new LanguageService();
export default languageService;
