import React, {useState, useEffect, useCallback, memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {BannerAd, BannerAdSize, TestIds, MobileAds} from 'react-native-google-mobile-ads';

// Ad Unit ID - Use Test ID in development, real ID in production
const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-9823475062473479/1036117247';

// Memoized request options for child-friendly educational content
const REQUEST_OPTIONS = {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['education', 'learning', 'students', 'study'],
};

const AdBanner = memo(() => {
  const [isAdReady, setIsAdReady] = useState(false);

  useEffect(() => {
    // Ensure AdMob is initialized before showing ads
    MobileAds()
      .initialize()
      .then(() => {
        console.log('AdMob initialized, ready to show ads');
        setIsAdReady(true);
      })
      .catch(err => {
        console.log('AdMob init error:', err);
      });
  }, []);

  // Memoized callbacks
  const handleAdLoaded = useCallback(() => {
    console.log('Banner ad loaded successfully');
  }, []);

  const handleAdFailedToLoad = useCallback((error) => {
    console.log('Banner ad failed to load:', error.message);
  }, []);

  if (!isAdReady) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={REQUEST_OPTIONS}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdFailedToLoad}
      />
    </View>
  );
});

AdBanner.displayName = 'AdBanner';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

export default AdBanner;
