# Security Setup Guide

## Quick Start

### 1. Install Dependencies

First time setup:
```bash
npm install
cd ios && pod install && cd ..
```

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and add your actual values:
```env
API_BASE_URL=https://your-api-url.com/api

# Get these from Google AdMob Console
ADMOB_ANDROID_APP_ID=ca-app-pub-xxxxxxxxxxxxx~xxxxxxxxxx
ADMOB_IOS_APP_ID=ca-app-pub-xxxxxxxxxxxxx~xxxxxxxxxx
ADMOB_BANNER_ID=ca-app-pub-xxxxxxxxxxxxx/xxxxxxxxxx
ADMOB_INTERSTITIAL_ID=ca-app-pub-xxxxxxxxxxxxx/xxxxxxxxxx
```

### 3. Configure Firebase

**Android:**
1. Download `google-services.json` from Firebase Console
2. Place in `android/app/google-services.json`

**iOS:**
1. Download `GoogleService-Info.plist` from Firebase Console
2. Place in `ios/GoogleService-Info.plist`

**Important:** These files are not tracked in git for security.

### 4. Generate Release Keystore (Android)

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Store the keystore password securely (use a password manager).

### 5. Build Configuration

Enable ProGuard for release builds by ensuring this is in `android/app/build.gradle`:

```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        signingConfig signingConfigs.release
    }
}
```

## Security Checklist for New Developers

- [ ] Created `.env` file with actual credentials
- [ ] Added Firebase config files (not in git)
- [ ] Never commit `.env` or firebase config files
- [ ] Use `secureStorage` for sensitive data
- [ ] Use `logger` instead of `console.log`
- [ ] Sanitize all user inputs
- [ ] Test with `npm run test`
- [ ] Review `/SECURITY.md` documentation

## Common Issues

### Issue: "EncryptedStorage module not found"
**Solution:**
```bash
cd ios && pod install && cd ..
npm run ios
```

### Issue: "google-services.json file is missing"
**Solution:** Download from Firebase Console and place in `android/app/`

### Issue: Rate limit errors during development
**Solution:**
```typescript
import rateLimiter from '@services/rateLimiter';
rateLimiter.clearAll(); // Clear all rate limits
```

## Need Help?

- Read the full security documentation: `SECURITY.md`
- Contact: dev@biblestudycards.app
