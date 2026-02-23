# iOS Setup Guide for FlashCard App

## ✅ Completed Automated Fixes

The following files have been updated automatically:
- ✅ `ios/FlashCard/AppDelegate.mm` - Added Firebase, AdMob, and Splash Screen initialization
- ✅ `ios/FlashCard/Info.plist` - Added photo library & camera permissions, fixed architecture
- ✅ `app.json` - Added iOS AdMob configuration

---

## 🚨 CRITICAL: Manual Steps Required

### Step 1: Install CocoaPods Dependencies
```bash
cd ios
pod install
cd ..
```

### Step 2: Firebase Configuration (REQUIRED)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **⚙️ Settings** → **Project Settings**
4. Under **Your apps**, click **+ Add app** → **iOS**
5. Register iOS app:
   - **Bundle ID**: Check `ios/FlashCard.xcodeproj/project.pbxproj` for `PRODUCT_BUNDLE_IDENTIFIER`
   - **App nickname**: FlashCard iOS (optional)
6. Download `GoogleService-Info.plist`
7. **Add to Xcode**:
   - Open `ios/FlashCard.xcworkspace` in Xcode
   - Drag `GoogleService-Info.plist` into Xcode project navigator
   - Under `FlashCard` folder
   - ✅ Check "Copy items if needed"
   - ✅ Select "FlashCard" target

⚠️ **Without this file, Firestore will crash on iOS!**

---

### Step 3: Google AdMob iOS App ID (REQUIRED)

**Current Status**: Using test App ID in `Info.plist`

#### Get Your Real iOS App ID:
1. Go to [Google AdMob Console](https://apps.admob.com/)
2. Select your app or create new iOS app
3. Copy your **iOS App ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)

#### Update Files:
1. **Update `ios/FlashCard/Info.plist`** line 6:
   ```xml
   <key>GADApplicationIdentifier</key>
   <string>YOUR_REAL_IOS_APP_ID_HERE</string>
   ```

2. **Update `app.json`**:
   ```json
   "react-native-google-mobile-ads": {
     "android_app_id": "ca-app-pub-9823475062473479~5043844703",
     "ios_app_id": "YOUR_REAL_IOS_APP_ID_HERE"
   }
   ```

---

### Step 4: In-App Purchases Setup (For Subscriptions)

#### A. Enable StoreKit in Xcode
1. Open `ios/FlashCard.xcworkspace`
2. Select **FlashCard** project
3. Select **FlashCard** target
4. Go to **Signing & Capabilities** tab
5. Click **+ Capability**
6. Add **In-App Purchase**

#### B. App Store Connect Configuration
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Select your app (or create new app)
3. Go to **Features** → **In-App Purchases**
4. Create subscription groups and products matching your code
5. Submit for review

#### C. Test In-App Purchases
1. In App Store Connect: **Users and Access** → **Sandbox Testers**
2. Create test accounts
3. Use these accounts to test subscriptions

---

### Step 5: Xcode Project Configuration

#### Open Project:
```bash
open ios/FlashCard.xcworkspace  # Use .xcworkspace, NOT .xcodeproj!
```

#### Configure Signing:
1. Select **FlashCard** project
2. Select **FlashCard** target
3. **Signing & Capabilities** tab
4. Set **Team** (your Apple Developer account)
5. Set **Bundle Identifier** (must be unique)

#### Build Settings to Verify:
- **iOS Deployment Target**: 12.0 or higher (recommended 13.0+)
- **Architecture**: arm64 only ✅ (already configured)
- **Build Active Architecture Only**: NO (for Release)

---

### Step 6: Build and Run

#### Clean Build (Recommended for first iOS run):
```bash
# Clean all caches
npm run clean:all

# Or manually:
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
rm -rf node_modules
npm install
```

#### Build for iOS:
```bash
# Run on iOS simulator
npm run ios

# Or specific simulator
npx react-native run-ios --simulator="iPhone 15 Pro"

# Run on physical device
npx react-native run-ios --device="Your Device Name"
```

---

## 📱 Testing Checklist

- [ ] App launches without crashes
- [ ] Firebase Firestore reads/writes data
- [ ] Google Ads display correctly
- [ ] Image picker opens photo library
- [ ] Camera permission works (physical device only)
- [ ] In-App Purchases flow works
- [ ] Splash screen displays and hides
- [ ] All fonts render correctly

---

## 🐛 Common Issues & Solutions

### Issue: "No GoogleService-Info.plist found"
**Solution**: Complete Step 2 above. Make sure file is added to Xcode target.

### Issue: "Module 'Firebase' not found"
**Solution**: 
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Issue: "Could not find iPhone X simulator"
**Solution**: 
```bash
# List available simulators
xcrun simctl list devices

# Use available device name
npx react-native run-ios --simulator="iPhone 15"
```

### Issue: Build fails with "Signing requires a development team"
**Solution**: Open Xcode and configure signing (Step 5 above)

### Issue: "RNSplashScreen not found"
**Solution**: 
```bash
cd ios
pod install
cd ..
# Clean and rebuild
```

### Issue: AdMob shows "Invalid Ad Request"
**Solution**: 
1. Verify App ID in `Info.plist` matches AdMob console
2. For testing, use [AdMob test ads](https://developers.google.com/admob/ios/test-ads)
3. Wait 1-2 hours after creating new ad units

---

## 📚 Additional Resources

- [React Native iOS Setup](https://reactnative.dev/docs/environment-setup)
- [Firebase iOS Setup](https://firebase.google.com/docs/ios/setup)
- [Google Mobile Ads iOS](https://developers.google.com/admob/ios/quick-start)
- [React Native IAP iOS](https://github.com/dooboolab/react-native-iap#ios-installation)

---

## 🎯 Next Steps After Setup

1. Test thoroughly on simulator
2. Test on physical iOS device
3. Configure provisioning profiles for distribution
4. Update version numbers in Xcode
5. Prepare screenshots for App Store
6. Submit for App Store review

---

## 📞 Need Help?

If you encounter issues:
1. Check Xcode build logs for detailed errors
2. Verify all pods are installed: `cd ios && pod list`
3. Check React Native Metro bundler logs
4. Review Firebase and AdMob console for configuration issues

**Good luck with your iOS launch! 🚀**
