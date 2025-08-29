import React, {useEffect, useState} from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Platform,
  SafeAreaView,
  Button
} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  MobileAds,
} from 'react-native-google-mobile-ads';
import { initializeAds, familyFriendlyAdOptions } from './AdConfig';

/**
 * Debug component for testing banner ads on real devices
 */
const BannerAdTester = () => {
  const [initialized, setInitialized] = useState(false);
  const [adLoadError, setAdLoadError] = useState(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});
  
  // Your real banner ad ID
  const realAdUnitId = 'ca-app-pub-9823475062473479/1036117247';
  
  // Test ad ID
  const testAdUnitId = TestIds.BANNER;
  
  // The ad ID we're currently using
  const [adUnitId, setAdUnitId] = useState(realAdUnitId);
  const [adSize, setAdSize] = useState(BannerAdSize.BANNER);
  
  useEffect(() => {
    const getDeviceInfo = async () => {
      try {
        setDebugInfo({
          platform: Platform.OS,
          version: Platform.Version,
          isDebug: __DEV__,
          adUnitId: adUnitId,
          adSize: adSize,
        });
        
        // Initialize AdMob
        await initializeAds();
        setInitialized(true);
      } catch (error) {
        console.error('Error in initialization:', error);
        setDebugInfo(prev => ({
          ...prev,
          initError: error.message
        }));
      }
    };
    
    getDeviceInfo();
  }, [adUnitId, adSize]);
  
  const toggleAdId = () => {
    setAdUnitId(prev => 
      prev === realAdUnitId ? testAdUnitId : realAdUnitId
    );
    setAdLoaded(false);
    setAdLoadError(null);
  };
  
  const toggleAdSize = () => {
    setAdSize(prev => 
      prev === BannerAdSize.BANNER ? 
      BannerAdSize.LARGE_BANNER : 
      BannerAdSize.BANNER
    );
    setAdLoaded(false);
    setAdLoadError(null);
  };
  
  const reinitialize = async () => {
    try {
      setInitialized(false);
      await initializeAds();
      setInitialized(true);
      setAdLoaded(false);
      setAdLoadError(null);
    } catch (error) {
      console.error('Error in reinitialization:', error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Banner Ad Tester</Text>
        
        {/* Debug Information */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Debug Info:</Text>
          {Object.entries(debugInfo).map(([key, value]) => (
            <Text key={key} style={styles.infoText}>
              {key}: {JSON.stringify(value)}
            </Text>
          ))}
          <Text style={styles.infoText}>
            Initialized: {initialized ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.infoText}>
            Ad Loaded: {adLoaded ? 'Yes' : 'No'}
          </Text>
        </View>
        
        {/* Controls */}
        <View style={styles.controlsContainer}>
          <Text style={styles.sectionTitle}>Controls:</Text>
          <View style={styles.buttonRow}>
            <Button 
              title={`Use ${adUnitId === realAdUnitId ? 'Test' : 'Real'} Ad ID`} 
              onPress={toggleAdId} 
            />
          </View>
          <View style={styles.buttonRow}>
            <Button 
              title={`Use ${adSize === BannerAdSize.BANNER ? 'Large' : 'Standard'} Size`} 
              onPress={toggleAdSize} 
            />
          </View>
          <View style={styles.buttonRow}>
            <Button 
              title="Reinitialize AdMob" 
              onPress={reinitialize} 
            />
          </View>
        </View>
        
        {/* Error Display */}
        {adLoadError && (
          <View style={styles.errorContainer}>
            <Text style={styles.sectionTitle}>Error:</Text>
            <Text style={styles.errorText}>{adLoadError}</Text>
          </View>
        )}
        
        {/* Ad Container */}
        <View style={styles.adContainer}>
          <Text style={styles.sectionTitle}>Banner Ad:</Text>
          {initialized && (
            <BannerAd
              unitId={adUnitId}
              size={adSize}
              requestOptions={{
                ...familyFriendlyAdOptions,
                httpTimeoutMillis: 15000,
              }}
              onAdLoaded={() => {
                console.log('Banner ad loaded successfully.');
                setAdLoaded(true);
                setAdLoadError(null);
              }}
              onAdFailedToLoad={(error) => {
                console.error('Banner ad failed to load:', error);
                setAdLoaded(false);
                setAdLoadError(error.message || 'Unknown error');
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  controlsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  buttonRow: {
    marginVertical: 8,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  adContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    alignItems: 'center',
  },
});

export default BannerAdTester;
