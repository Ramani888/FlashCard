import {useEffect, useRef, useCallback} from 'react';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Ad Unit ID - Use Test ID in development, real ID in production
// Interstitial ads support both static and video content
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL_VIDEO
  : 'ca-app-pub-9823475062473479/4712871516'; // Production interstitial ad unit ID

/**
 * Custom hook for managing interstitial video ads on app launch
 * Shows full-screen video ad when app opens
 * User can close after 5 seconds (Google's standard policy)
 * Note: Close button appears automatically after ~5 seconds
 */
export const useAppLaunchInterstitial = () => {
  const interstitialAdRef = useRef(null);
  const listenersRef = useRef([]);
  const isLoadedRef = useRef(false);
  const hasShownRef = useRef(false);

  // Clean up function
  const cleanup = useCallback(() => {
    // Remove all listeners
    listenersRef.current.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        console.log('Error unsubscribing:', error);
      }
    });
    listenersRef.current = [];

    interstitialAdRef.current = null;
    isLoadedRef.current = false;
  }, []);

  // Load interstitial video ad
  const loadInterstitialAd = useCallback(() => {
    try {
      console.log('Loading interstitial video ad...');

      const interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
        // Request non-personalized ads only (privacy-friendly)
        requestNonPersonalizedAdsOnly: true,
        
        // Additional keywords for educational content
        keywords: ['education', 'learning', 'students', 'study'],
      });

      // Listen for ad loaded
      const unsubscribeLoaded = interstitialAd.addAdEventListener(
        AdEventType.LOADED,
        () => {
          console.log('Interstitial video ad loaded');
          isLoadedRef.current = true;
          interstitialAdRef.current = interstitialAd;

          // Auto-show ad after successful load if not shown yet
          if (!hasShownRef.current) {
            showInterstitialAd();
          }
        },
      );

      // Listen for ad opened/shown
      const unsubscribeOpened = interstitialAd.addAdEventListener(
        AdEventType.OPENED,
        () => {
          console.log('Interstitial video ad shown - close button will appear after ~5 seconds');
          hasShownRef.current = true;
        },
      );

      // Listen for ad closed
      const unsubscribeClosed = interstitialAd.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          console.log('Interstitial video ad closed');
          cleanup();
        },
      );

      // Listen for errors
      const unsubscribeError = interstitialAd.addAdEventListener(
        AdEventType.ERROR,
        error => {
          console.log('Interstitial video ad error:', error.message);
          cleanup();
        },
      );

      listenersRef.current = [
        unsubscribeLoaded,
        unsubscribeOpened,
        unsubscribeClosed,
        unsubscribeError,
      ];

      interstitialAd.load();
    } catch (error) {
      console.error('Failed to create interstitial video ad:', error);
    }
  }, [cleanup]);

  // Show interstitial video ad
  const showInterstitialAd = useCallback(() => {
    if (isLoadedRef.current && interstitialAdRef.current) {
      try {
        console.log('Showing interstitial video ad...');
        interstitialAdRef.current.show();
      } catch (error) {
        console.error('Failed to show interstitial video ad:', error);
        cleanup();
      }
    } else {
      console.log('Interstitial video ad not ready yet');
    }
  }, [cleanup]);

  // Initialize and load ad on mount
  useEffect(() => {
    // Delay loading to ensure app is fully mounted
    const timer = setTimeout(() => {
      loadInterstitialAd();
    }, 2000); // Load after 2 seconds to ensure app is ready

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [loadInterstitialAd, cleanup]);

  return {
    showInterstitialAd,
  };
};

export default useAppLaunchInterstitial;
