import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  MobileAds,
} from 'react-native-google-mobile-ads';

const AdBanner = () => {
  const [adLoadError, setAdLoadError] = useState(false);
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-9823475062473479/1036117247';

  useEffect(() => {
    MobileAds()
      .initialize()
      .then(() => {
        // Set AdMob configuration to comply with Families Policy
        const requestConfig = {
          testDeviceIdentifiers: ['EMULATOR', 'YOUR_DEVICE_ID'], // Add your test device ID
          tagForChildDirectedTreatment: true, // Ensures compliance with COPPA
          tagForUnderAgeOfConsent: true, // Ensures compliance with GDPR
          maxAdContentRating: 'G', // Strictest rating - only family-friendly content
        };
        MobileAds().setRequestConfiguration(requestConfig);
      });
  }, []);

  const retryAdLoad = (retries = 3) => {
    if (retries > 0) {
      console.log(`Retrying ad load... attempts left: ${retries}`);
      setTimeout(() => {
        setAdLoadError(false);
      }, 5000);
    } else {
      console.error('All retries for ad load failed.');
    }
  };

  return (
    <View style={styles.container}>
      {adLoadError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ad failed to load. Retrying...</Text>
        </View>
      ) : (
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          // onAdFailedToLoad={(error) => {
          //   console.error('Ad failed to load:', error.message);
          //   setAdLoadError(true);
          //   retryAdLoad();
          // }}
          onAdLoaded={() => {
            console.log('Ad loaded successfully.');
            setAdLoadError(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AdBanner;
