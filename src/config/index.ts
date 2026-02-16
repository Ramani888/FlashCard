import {API_BASE_URL} from '@env';

/**
 * Environment configuration with fallback values
 */
const Config = {
  // API Configuration
  API_BASE_URL: API_BASE_URL || 'https://biblestudycards.app/api',

  // App Configuration
  APP_NAME: 'FlashCard',
  APP_VERSION: '1.0.0',

  // Timeouts (in milliseconds)
  API_TIMEOUT: 30000,
  RETRY_DELAY: 1000,
  MAX_RETRIES: 3,

  // Cache Configuration
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes

  // Feature Flags
  FEATURES: {
    ENABLE_ADS: true,
    ENABLE_IN_APP_PURCHASES: true,
    ENABLE_OFFLINE_MODE: true,
    ENABLE_ANALYTICS: true,
    ENABLE_CRASH_REPORTING: true,
  },

  // Storage Keys
  STORAGE_KEYS: {
    USER: 'user',
    TOKEN: 'token',
    THEME: 'theme',
    LANGUAGE: 'Language',
    ONBOARDING_COMPLETE: 'onboarding_complete',
    SUBSCRIPTION: 'subscription',
  },

  // Ad Unit IDs (Replace with actual IDs in production)
  ADS: {
    BANNER_ID: '__BANNER_AD_ID__',
    INTERSTITIAL_ID: '__INTERSTITIAL_AD_ID__',
    REWARDED_ID: '__REWARDED_AD_ID__',
  },
};

export default Config;
