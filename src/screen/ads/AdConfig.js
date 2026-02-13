import { MobileAds } from 'react-native-google-mobile-ads';

/**
 * Initialize AdMob
 * Call this when your app starts
 */
export const initializeAds = async () => {
  try {
    await MobileAds().initialize();
    console.log('AdMob initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize AdMob:', error);
    return false;
  }
};
