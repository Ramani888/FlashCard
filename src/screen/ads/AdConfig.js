import { MobileAds, AdsConsent, AdsConsentStatus } from 'react-native-google-mobile-ads';

/**
 * Initialize AdMob with child-directed and educational app settings
 * This configuration is COPPA compliant and suitable for educational apps
 * Call this when your app starts
 */
export const initializeAds = async () => {
  try {
    // Configure AdMob for educational/child-directed content
    await MobileAds().setRequestConfiguration({
      // Maximum ad content rating - G for General Audiences (family-friendly)
      maxAdContentRating: 'G',
      
      // Tag for child-directed treatment (COPPA compliance)
      tagForChildDirectedTreatment: true,
      
      // Tag for under age of consent (GDPR compliance for children)
      tagForUnderAgeOfConsent: true,
    });

    // Initialize AdMob
    await MobileAds().initialize();
    
    console.log('AdMob initialized successfully with child-directed settings');
    console.log('- Max content rating: G (General Audiences)');
    console.log('- Child-directed treatment: ENABLED');
    console.log('- Under age consent: ENABLED');
    
    return true;
  } catch (error) {
    console.error('Failed to initialize AdMob:', error);
    return false;
  }
};
