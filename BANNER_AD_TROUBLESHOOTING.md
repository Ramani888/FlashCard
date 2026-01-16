# Banner Ad Troubleshooting Guide

This document provides guidance for troubleshooting the issue where banner ads work in the emulator but not on real devices.

## Common Issues and Solutions

### 1. Network Issues

- **Problem**: Banner ads require a stable internet connection. Real devices might have network issues.
- **Solution**: Ensure the device has a strong and stable internet connection. Try both Wi-Fi and mobile data.

### 2. Ad Unit ID Configuration

- **Problem**: Incorrect ad unit ID or format issues.
- **Solution**:
  - Verify the ad unit ID is correct: `ca-app-pub-9823475062473479/1036117247`
  - Make sure the ID is being used correctly in non-debug builds
  - Check that the ad unit is properly set up in the AdMob console

### 3. Ad Format Issues

- **Problem**: The banner ad size might not be supported on some devices.
- **Solution**:
  - Try using standard banner sizes like `BannerAdSize.BANNER` instead of adaptive banners
  - We've provided a BannerAdTester tool that lets you switch between sizes

### 4. AdMob Initialization Timing

- **Problem**: AdMob initialization might be occurring too early or too late.
- **Solution**:
  - We've updated the app to delay AdMob initialization slightly
  - The BannerAdTester provides a button to manually reinitialize AdMob

### 5. Policy Compliance Issues

- **Problem**: Your ads might be rejected due to policy violations.
- **Solution**:
  - We've configured your ads to be fully compliant with Families Policy
  - Use the BannerAdTester to check for error messages related to policy violations

## Using the Banner Ad Tester

We've created a special tool to help diagnose banner ad issues on real devices:

1. Navigate to Profile > Ad Inspector
2. Tap on "Banner Ad Troubleshooter"
3. The tester will show:
   - Debug information about your device
   - Controls to switch between test and real ad IDs
   - Controls to try different banner sizes
   - Error reporting for failed ad loads

## Additional Steps

If ads still don't show on real devices:

1. **Check AdMob Console**: Look for any policy violations or account issues
2. **Update Google Play Services**: Ensure the device has the latest Google Play Services
3. **Test with a Test Ad ID**: If test ads work but real ads don't, it might be an account issue
4. **Review Ad Fill Rate**: Some regions might have lower fill rates for banner ads

## Specific Device Solutions

### For Android 10+ Devices

- Check "Background data usage" permissions for the app
- Ensure "Restrict background data" is not enabled for the app

### For Android 12+ Devices

- Check if Ad ID permissions are properly configured
- Test with the new Ad ID format (AAID)

If you continue to experience issues after trying these solutions, please contact Google AdMob support with the error details from the BannerAdTester.
