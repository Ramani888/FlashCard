import React from 'react';
import {View, Button, StyleSheet, Text, SafeAreaView} from 'react-native';
import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  TestIds,
  RewardedAd,
  RewardedAdEventType,
  MobileAds,
  AdsConsent,
  AdsConsentStatus,
  AdsConsentDebugGeography,
} from 'react-native-google-mobile-ads';
import { initializeAds, familyFriendlyAdOptions } from './AdConfig';
import { useNavigation } from '@react-navigation/native';
import { ScreenName } from '../../component/Screen';

/**
 * Ad Inspector Tool - Use to test your ads for API 35 compliance
 * Run this tool before submitting your app to ensure ads meet Family Policy
 */
const AdInspector = () => {
  const navigation = useNavigation();
  const showAdInspector = async () => {
    try {
      await MobileAds().openAdInspector();
      console.log('Ad Inspector opened successfully');
    } catch (error) {
      console.error('Error opening Ad Inspector:', error);
    }
  };

  const checkConsentStatus = async () => {
    try {
      // Check the current consent status
      const consentInfo = await AdsConsent.requestInfoUpdate({
        debugGeography: __DEV__ 
          ? AdsConsentDebugGeography.EEA 
          : AdsConsentDebugGeography.DISABLED,
        testDeviceIdentifiers: ['EMULATOR'],
      });

      console.log('Consent Status:', consentInfo.status);
      
      if (consentInfo.status === AdsConsentStatus.REQUIRED) {
        // Show the consent form if required
        const formResult = await AdsConsent.showForm({
          privacyPolicy: 'https://your-privacy-policy-url.com',
          withPersonalizedAds: true,
          withNonPersonalizedAds: true,
          withAdFree: false,
        });
        
        console.log('Consent Form Result:', formResult.status);
      }
    } catch (error) {
      console.error('Error checking consent status:', error);
    }
  };

  // Initialize ads with family-friendly settings
  React.useEffect(() => {
    initializeAds();
    checkConsentStatus();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ad Inspector Tool</Text>
      <Text style={styles.subtitle}>
        Use this tool to verify your ads comply with Family Policy for API 35
      </Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Open Ad Inspector"
          onPress={showAdInspector}
          color="#4285F4"
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Banner Ad Troubleshooter"
          onPress={() => navigation.navigate(ScreenName.bannerAdTester)}
          color="#EA4335"
        />
      </View>
      
      <Text style={styles.sectionTitle}>Sample Banner Ad</Text>
      <View style={styles.adContainer}>
        <BannerAd
          unitId={TestIds.BANNER}
          size={BannerAdSize.BANNER}
          requestOptions={familyFriendlyAdOptions}
        />
      </View>
      
      <Text style={styles.sectionTitle}>Testing Checklist</Text>
      <View style={styles.checklistContainer}>
        <Text style={styles.checkItem}>✓ Verify all ads are closeable after 5 seconds</Text>
        <Text style={styles.checkItem}>✓ Check that banner ads display correctly</Text>
        <Text style={styles.checkItem}>✓ Ensure rewarded video ads show skip button after 5s</Text>
        <Text style={styles.checkItem}>✓ Confirm all ad content is family-friendly (G rating)</Text>
        <Text style={styles.checkItem}>✓ Test ads on both emulator and real devices</Text>
      </View>
      
      <Text style={styles.note}>
        Note: For Google Play's Families Policy compliance, all interactive ads must
        be closeable after 5 seconds. Use this tool to verify compliance before submitting 
        your app update.
      </Text>
      <View style={styles.checklistContainer}>
        <Text style={styles.checkItem}>✓ Using certified ad SDK (Google AdMob)</Text>
        <Text style={styles.checkItem}>✓ AdMob SDK is up to date</Text>
        <Text style={styles.checkItem}>✓ Ads are closable within 5 seconds</Text>
        <Text style={styles.checkItem}>✓ Family-safe ads configured</Text>
        <Text style={styles.checkItem}>✓ Age-appropriate ad content</Text>
      </View>
      
      <Text style={styles.sectionTitle}>Common Ad Issues</Text>
      <View style={styles.checklistContainer}>
        <Text style={styles.noteItem}>
          <Text style={styles.boldText}>No Fill Errors:</Text> "No Fill" errors are normal and occur when AdMob 
          doesn't have ads to serve. This is not a bug and doesn't affect policy compliance.
        </Text>
        <Text style={styles.noteItem}>
          <Text style={styles.boldText}>Test Ads vs Real Ads:</Text> Test ads always have 100% fill rate, 
          but real ads may not appear every time due to inventory availability.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 12,
  },
  adContainer: {
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  checklistContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  checkItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    paddingLeft: 8,
  },
  note: {
    fontSize: 14,
    color: '#E53935',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#FFEBEE',
    borderRadius: 4,
  },
  noteItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default AdInspector;
