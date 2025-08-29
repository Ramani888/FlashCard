import React, {useEffect} from 'react';
import {View, StyleSheet, Platform, Dimensions} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { initializeAds, familyFriendlyAdOptions } from './AdConfig';

const AdBanner = () => {
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-9823475062473479/1036117247';

  useEffect(() => {
    // Initialize ads with family-friendly configuration
    initializeAds().catch(error => {
      console.error('Error initializing ads:', error);
    });
    
    console.log('Banner Ad Unit ID:', adUnitId);
    console.log('Running on:', Platform.OS, Platform.Version);
  }, [adUnitId]);

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          ...familyFriendlyAdOptions,
          httpTimeoutMillis: 15000, // Increase timeout for slower connections
        }}
        onAdFailedToLoad={(error) => {
          // Just log the error but don't show any UI feedback
          console.error('Banner ad failed to load:', error);
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded successfully.');
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
  }
});

export default AdBanner;
