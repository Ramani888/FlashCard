import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useRef,
} from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-9823475062473479/5214348018';

const VideoAds = forwardRef(({updateCredit, onAdStatusChange}, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingAd, setIsLoadingAd] = useState(true);
  const rewardedAdRef = useRef(null);
  const listenersRef = useRef([]);

  // Notify parent about ad status changes
  useEffect(() => {
    if (onAdStatusChange) {
      onAdStatusChange(isLoaded, isLoadingAd);
    }
  }, [isLoaded, isLoadingAd, onAdStatusChange]);

  // Load a new ad
  const loadAd = useCallback(() => {
    // Clean up previous listeners
    listenersRef.current.forEach(unsubscribe => unsubscribe());
    listenersRef.current = [];

    setIsLoadingAd(true);
    setIsLoaded(false);

    const rewarded = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    // Listen for ad loaded
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        console.log('Rewarded ad loaded');
        setIsLoaded(true);
        setIsLoadingAd(false);
        rewardedAdRef.current = rewarded;
      },
    );

    // Listen for reward earned
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward:', reward);
        updateCredit(2, 'credited');
      },
    );

    // Listen for ad closed - preload next ad silently
    const unsubscribeClosed = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('Rewarded ad closed, preloading next ad...');
        // Preload next ad silently in background
        loadAd();
      },
    );

    // Listen for errors - retry silently
    const unsubscribeError = rewarded.addAdEventListener(
      AdEventType.ERROR,
      error => {
        console.log('Rewarded ad error:', error.message);
        setIsLoaded(false);
        setIsLoadingAd(false);
        // Retry loading after 5 seconds silently
        setTimeout(() => loadAd(), 5000);
      },
    );

    listenersRef.current = [
      unsubscribeLoaded,
      unsubscribeEarned,
      unsubscribeClosed,
      unsubscribeError,
    ];

    rewarded.load();
  }, [updateCredit]);

  // Initial load when component mounts
  useEffect(() => {
    loadAd();

    return () => {
      listenersRef.current.forEach(unsubscribe => unsubscribe());
    };
  }, [loadAd]);

  // Show ad function - only shows if loaded
  const showAd = useCallback(() => {
    if (isLoaded && rewardedAdRef.current) {
      rewardedAdRef.current.show();
      setIsLoaded(false);
      setIsLoadingAd(true);
      return true;
    }
    return false;
  }, [isLoaded]);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    showAd,
    isLoaded: () => isLoaded,
    isLoadingAd: () => isLoadingAd,
  }));

  // No visible UI needed for video ads
  return null;
});

export default VideoAds;

// Removed unused styles
