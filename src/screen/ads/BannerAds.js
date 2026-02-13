import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {BannerAd, BannerAdSize, TestIds, MobileAds} from 'react-native-google-mobile-ads';

// Ad Unit ID - Use Test ID in development, real ID in production
const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-9823475062473479/1036117247';

const AdBanner = () => {
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

  if (!isAdReady) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded successfully');
        }}
        onAdFailedToLoad={error => {
          console.log('Banner ad failed to load:', error.message);
        }}
      />
    </View>
  );
};

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
