# Families Policy Compliance for API Level 35

This document outlines the changes made to ensure our app complies with Google Play's Families Policy Requirements for API level 35 (enforced starting August 2024).

## Changes Implemented

1. **Updated AdMob SDK to Compatible Version**

   - Using `react-native-google-mobile-ads@14.7.1`
   - Note: The latest version (15.x) has compatibility issues with our app setup
   - The 14.7.1 version includes sufficient compliance features for API 35

2. **Configured Family-Safe Ads**

   - Created centralized ad configuration in `src/screen/ads/AdConfig.js`
   - Implemented proper content rating limits (G rating)
   - Set up proper COPPA compliance flags
   - Set up proper GDPR compliance flags
   - Set ad targeting for family-friendly content only

3. **Made Ads Closable Within 5 Seconds**

   - Set `immersiveMode: false` for rewarded ads
   - Ensured all ad formats can be dismissed easily

4. **Added Ad Inspector Tool**
   - Created an Ad Inspector screen for testing ads before release
   - Accessible from the Profile screen (new "Ad Inspector" tab)
   - Provides a simple way to verify compliance

## Testing Before Submission

Before submitting your app to Google Play, follow these steps:

1. Run the app in development mode
2. Navigate to Profile > Ad Inspector
3. Click "Open Ad Inspector" to verify ad implementation
4. Check that all ads meet family policy requirements
5. Verify ads are closable within 5 seconds
6. Test on a device with API level 35 or above

## Troubleshooting

### Build Issues

If you encounter build issues related to the AdMob SDK:

1. **SDK Version Compatibility**: The app is configured to use `react-native-google-mobile-ads@14.7.1`. Using newer versions (15.x+) may cause build failures due to Kotlin version incompatibilities.

2. **Installation Errors**: If you see `INSTALL_FAILED_UPDATE_INCOMPATIBLE` errors, this means the previous app installation was signed with a different key. Uninstall the app from the emulator/device first:

   ```
   cd android
   .\gradlew uninstallDebug
   ```

3. **Kotlin Errors**: The warnings about Kotlin plugin being loaded multiple times can be ignored for debug builds.

### Ad Display Issues

If ads are not showing correctly:

1. Make sure you're connected to the internet
2. Check the logcat for any AdMob related errors
3. Verify that the ad unit IDs are correctly configured
4. Ensure that test devices are properly set up for testing

## Google Play Console Configuration

When uploading your app to Google Play, ensure you properly declare your ads:

1. Navigate to your app in Google Play Console
2. Go to "Content Rating" section
3. Accurately declare all implemented ad formats
4. Select "Yes" when asked if your app shows ads
5. Select "Family-friendly ads only" when asked about ad content

## Additional Resources

- [Google Play Families Policy](https://support.google.com/googleplay/android-developer/answer/9893335)
- [AdMob Family Policy Guide](https://support.google.com/admob/answer/9683184)
- [API Level 35 Changes](https://developer.android.com/about/versions/15/summary)
