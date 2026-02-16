# FlashCard App

A React Native flashcard application for Bible study and learning.

## Requirements

- Node.js >= 18
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. iOS Setup

```bash
cd ios && pod install && cd ..
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration values.

### 4. Run the App

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS simulator |
| `npm start` | Start Metro bundler |
| `npm run start:reset` | Start Metro with cache reset |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Check TypeScript types |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run clean` | Clean Android build |
| `npm run clean:all` | Clean all and reinstall |
| `npm run pods` | Install iOS CocoaPods |
| `npm run android:release` | Build Android release APK |
| `npm run android:bundle` | Build Android release AAB |

## Project Structure

```
src/
├── Api/                    # API endpoints and configuration
├── Assets/                 # Images, fonts, and static files
├── component/              # Reusable UI components
├── config/                 # App configuration
├── constants/              # App-wide constants
├── custome/                # Custom UI components
├── hooks/                  # Custom React hooks
├── language/               # Internationalization files
├── navigation/             # Navigation configuration
├── redux/                  # Redux state management
│   ├── slices/             # Redux slices (auth, theme, folders, etc.)
│   ├── hooks.ts            # Typed Redux hooks
│   └── store.ts            # Redux store configuration
├── screen/                 # Screen components
├── services/               # API and other services
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## Architecture

### State Management
- **Redux Toolkit** for global state
- **Typed hooks** (`useAppDispatch`, `useAppSelector`)
- **Async thunks** for API calls

### API Layer
- Centralized API service with retry logic
- Request/response interceptors
- Automatic token handling
- Error handling with user feedback

### Code Quality
- TypeScript for type safety
- ESLint + Prettier for code style
- Jest for unit testing
- GitHub Actions for CI/CD

## Testing

Run all tests:
```bash
npm test
```

Run with coverage:
```bash
npm run test:coverage
```

## Building for Production

### Android

Generate release AAB (for Play Store):
```bash
npm run android:bundle
```

Generate release APK:
```bash
npm run android:release
```

### iOS

Build through Xcode for App Store distribution.

## CI/CD

The project includes GitHub Actions workflows:

- **ci.yml**: Linting, testing, and building on PRs
- **release-android.yml**: Automated Play Store deployment on tags

## Environment Variables

| Variable | Description |
|----------|-------------|
| `API_BASE_URL` | Backend API URL |
| `ADMOB_BANNER_ID` | AdMob Banner ID |
| `ADMOB_INTERSTITIAL_ID` | AdMob Interstitial ID |
| `ENABLE_ADS` | Enable/disable ads |

## Contributing

1. Create a feature branch
2. Make changes following code style guidelines
3. Write/update tests
4. Submit a PR

## License

Private - All rights reserved
