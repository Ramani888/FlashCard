# Interstitial Video Ad Setup - Complete Configuration Guide

## ✅ Implementation Complete

A full-screen interstitial video ad has been implemented that shows when users launch the app. The ad can display video content and allows the user to close after approximately 5 seconds (Google's standard policy).

## 📋 What Was Implemented

### 1. **Created Interstitial Video Ad Component**
- **File**: `src/screen/ads/InterstitialAds.js`
- **Type**: Custom React Hook (`useAppLaunchInterstitial`)
- **Ad Format**: Interstitial (supports both video and static ads)
- **Features**:
  - Automatically loads and shows ad on app launch
  - Shows full-screen video ad after ~2 seconds of app startup
  - Close button appears after ~5 seconds (Google's policy)
  - Supports video content automatically
  - Proper error handling and cleanup
  - Memory leak prevention
  - Uses Test Video Ads in development mode

### 2. **Integrated into App.js**
- **File**: `App.js`
- Hook automatically triggers on app launch
- No user interaction required - video ad shows automatically

### 3. **Updated Configuration**
- **File**: `src/config/index.ts`
- Added `INTERSTITIAL_ID` to ad configuration

## 🎯 How It Works

1. **App Launch**: User opens the app
2. **Ad Loading**: Video ad starts loading after 2 seconds (to ensure app is ready)
3. **Ad Display**: Full-screen video ad shows automatically when loaded
4. **Video Plays**: Ad video plays (typically 5-30 seconds)
5. **Close Button**: Appears after ~5 seconds (Google standard)
6. **User Action**: User closes ad and continues to app

## 🧪 Testing

### Development Mode (Currently Active)
The app is currently using **Google Test Video Ads** which will show immediately:

```bash
# Run on Android
npm run android

# Run on iOS
npx pod-install
npm run ios
```

You should see:
- App launches normally
- Test video ad appears after ~2 seconds
- Video plays automatically
- Close button appears after ~5 seconds
- Console logs show ad lifecycle events

## 🚀 Production Setup

### Step 1: Create Interstitial Ad Unit in AdMob

1. Go to [AdMob Console](https://apps.admob.google.com/)
2. Select your app: **FlashCard** (App ID: `ca-app-pub-9823475062473479~1036117247`)
3. Click **"Ad units"** → **"Add ad unit"**
4. Select **"Interstitial"**
5. Configure settings:
   - **Name**: "App Launch Video Ad" (or your preference)
   - **Advanced settings**: Enable video ads if needed
6. Click **"Create ad unit"**
7. **Copy the Ad Unit ID** (format: `ca-app-pub-XXXXXXXX/XXXXXXXXXX`)

### Step 2: Update the Ad Unit ID

Update the production ad unit ID in:

**File**: `src/screen/ads/InterstitialAds.js`

```javascript
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL_VIDEO
  : 'ca-app-pub-9823475062473479/YOUR_INTERSTITIAL_AD_UNIT_ID'; // Replace with your actual interstitial ad unit ID
```

Replace `YOUR_INTERSTITIAL_AD_UNIT_ID` with the Ad Unit ID you copied from AdMob.

### Step 3: Test Production Ads

1. **Build release version**:
   ```bash
   # Android
   cd android && ./gradlew assembleRelease
   
   # iOS
   # Build in Xcode with Release scheme
   ```

2. **Install and test** on a real device (not emulator)
3. **Verify** real ads show up (not test ads)

## ⚙️ Configuration Options

### Adjust Loading Delay

If you want the ad to load faster or slower, modify the timeout in `InterstitialAds.js`:

```javascript
const timer = setTimeout(() => {
  loadAppOpenAd();
}, 2000); // Change this value (milliseconds)
```

### Disable Interstitial Video Ad

To temporarily disable the ad, comment out the hook call in `App.js`:

```javascript
// useAppLaunchInterstitial(); // Temporarily disabled
```

### Ad Frequency Control

To prevent showing the ad on every app launch, you can implement frequency capping:

```javascript
// Add to useAppLaunchInterstitial hook
const LAST_AD_SHOWN_KEY = 'last_interstitial_ad';
const AD_COOLDOWN = 4 * 60 * 60 * 1000; // 4 hours

// Check before loading ad
const shouldShowAd = async () => {
  const lastShown = await AsyncStorage.getItem(LAST_AD_SHOWN_KEY);
  if (!lastShown) return true;
  const timeSince = Date.now() - parseInt(lastShown);
  return timeSince > AD_COOLDOWN;
};
```

## 📊 Console Logs (Debugging)

When running the app, you'll see these logs:

```
✅ AdMob Initialized with Family Policy settings
✅ Loading interstitial video ad...
✅ Interstitial video ad loaded
✅ Showing interstitial video ad...
✅ Interstitial video ad shown - close button will appear after ~5 seconds
✅ Interstitial video ad closed
```

If you see errors, check:
- Internet connection
- AdMob account status
- Ad unit ID is correct (for production)
- Google Play Services is up to date (Android)

## 🎨 Ad Appearance

**Interstitial Video Ads**:
- Full-screen takeover
- Video content plays automatically
- Sound enabled by default (user can mute)
- Close button after ~5 seconds
- Smooth transitions
- Supports both portrait and landscape

## 📱 Platform Support

- ✅ **Android**: Fully supported
- ✅ **iOS**: Fully supported
- ✅ **Test Mode**: Working
- 🔄 **Production Mode**: Update ad unit ID to enable

## ⚠️ Important Notes

1. **Revenue**: Interstitial video ads typically have high eCPM (earnings per thousand impressions)
2. **User Experience**: Don't show too frequently (consider frequency capping)
3. **Google Policy**: Close button appears after ~5 seconds automatically (cannot be changed)
4. **Testing**: Always test on real devices, not emulators
5. **Fill Rate**: Video ads may have lower fill rate; static ads will show as fallback
6. **Sound**: Video ads play with sound enabled by default

## 🔧 Troubleshooting

### Ad Not Showing

1. **Check console logs** for errors
2. **Verify internet connection**
3. **Ensure AdMob is initialized** (check logs)
4. **Wait 2 seconds** after app launch (loading delay)

### Test Ad Not Appearing

1. **Verify** `__DEV__` is true in development
2. **Check** react-native-google-mobile-ads is installed
3. **Restart** Metro bundler

### Production Ad Not Appearing

1. **Verify** ad unit ID is correct
2. **Check** AdMob account status
3. **Ensure** app is registered in AdMob
4. **Allow** 24-48 hours for new ad units to activate

## 📚 Additional Resources

- [React Native Google Mobile Ads Documentation](https://docs.page/invertase/react-native-google-mobile-ads)
- [AdMob Interstitial Ads Guide](https://support.google.com/admob/answer/6066980)
- [Google Mobile Ads Best Practices](https://support.google.com/admob/answer/6128877)

## 🎉 Benefits of Interstitial Video Ads

- ✅ Monetize app launches effectively
- ✅ High user engagement with video content
- ✅ Higher eCPM rates compared to banner ads
- ✅ Supports both video and static content
- ✅ Works alongside other ad formats
- ✅ Better fill rates with video + static fallback

---

**Status**: ✅ Implementation Complete  
**Next Step**: Create Interstitial Ad unit in AdMob and update the ad unit ID for production  
**Ad Type**: Interstitial Video (supports video and static content)
