import { MobileAds, MaxAdContentRating } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

/**
 * Initialize and configure Ads for Family Policy compliance (API 35)
 * This must be called when your app starts
 */
export const initializeAds = async () => {
  try {
    await MobileAds().initialize();
    
    // Configure for family-friendly content per API 35 policy
    const requestConfig = {
      // Only add emulator as test device in debug mode
      testDeviceIdentifiers: __DEV__ ? ['EMULATOR'] : [],
      
      // COPPA compliance - required for child-directed apps
      tagForChildDirectedTreatment: true,
      
      // GDPR compliance - required for users under age of consent
      tagForUnderAgeOfConsent: true,
      
      // Set to G rating - most restrictive, suitable for all audiences
      maxAdContentRating: MaxAdContentRating.G,
    };
    
    await MobileAds().setRequestConfiguration(requestConfig);
    console.log('AdMob configured successfully for Families Policy compliance');
    return true;
  } catch (error) {
    console.error('Failed to initialize AdMob:', error);
    throw error; // Rethrow to allow caller to handle the error
  }
};

/**
 * Common ad request options for family-friendly content
 * Use these options in all ad requests to ensure compliance
 */
export const familyFriendlyAdOptions = {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['education', 'flashcards', 'learning', 'family-friendly'],
  tagForChildDirectedTreatment: true,
  tagForUnderAgeOfConsent: true,
  maxAdContentRating: 'G',
  immersiveMode: false, // Ensures ads are closable within 5 seconds
  
  // Additional settings to ensure compliance with "Families ad format requirements"
  // Explicitly ensure ads are closable after 5 seconds (Google Play requirement)
  allowSkipAfterSeconds: 5,
};

/**
 * Check if a device is in test mode
 */
export const isTestDevice = () => {
  return __DEV__ || Platform.OS === 'android' && Platform.Version < 30;
};

/**
 * Check if an ad unit ID is a test ID
 * This helps with debugging
 */
export const isTestId = (adUnitId) => {
  const testIds = [
    'ca-app-pub-3940256099942544/6300978111', // Banner
    'ca-app-pub-3940256099942544/1033173712', // Interstitial
    'ca-app-pub-3940256099942544/5224354917', // Rewarded
    'ca-app-pub-3940256099942544/5354046379', // Rewarded Interstitial
    'ca-app-pub-3940256099942544/2247696110', // Native Advanced
    'ca-app-pub-3940256099942544/3986624511', // App Open
  ];
  
  return testIds.includes(adUnitId);
};
