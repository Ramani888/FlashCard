# FlashCard - React Native Mobile App

A modern flashcard learning application built with React Native, featuring AI assistance, PDF management, and community features.

## Features

- **Flashcard Management**: Create, edit, and organize flashcards in sets and folders
- **AI Assistance**: AI-powered card generation and learning assistance
- **PDF Support**: Import and manage PDF documents
- **Image Galleries**: Organize learning images in folders
- **Community**: Share and discover flashcard sets
- **Offline Support**: Work offline with local data sync
- **Cross-Platform**: Available on iOS and Android

## Tech Stack

- **Framework**: React Native 0.72.4
- **State Management**: Redux Toolkit with typed slices
- **Navigation**: React Navigation v6
- **Backend**: Firebase/Firestore
- **Language**: TypeScript with strict mode
- **Styling**: React Native StyleSheet with theming support
- **Testing**: Jest with React Native Testing Library

## Project Structure

```
src/
├── Api/                 # API service layer
│   ├── ApiService.ts    # Typed API functions
│   └── EndPoint.js      # API endpoints
├── Assets/              # Static assets
│   ├── Font/            # Custom fonts
│   ├── Img/             # Images
│   └── JsonFile/        # JSON data files
├── component/           # Reusable components
│   ├── auth/            # Authentication components
│   ├── cards/           # Card-related components
│   ├── homescreen/      # Home screen components
│   ├── Images/          # Image components
│   ├── pdf/             # PDF components
│   └── profile/         # Profile components
├── config/              # App configuration
├── constants/           # App constants
├── context/             # React contexts
├── custome/             # Custom UI components
├── hooks/               # Custom React hooks
├── language/            # Internationalization
├── navigation/          # Navigation configuration
├── redux/               # Redux store and slices
│   └── slices/          # Redux Toolkit slices
├── screen/              # Screen components
├── services/            # Business logic services
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FlashCard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install iOS pods (macOS only):
```bash
cd ios && pod install && cd ..
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

5. Run the app:
```bash
# iOS
npm run ios

# Android
npm run android
```

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Run TypeScript type checking
npm run type-check
```

### Building for Production

```bash
# Android
cd android && ./gradlew assembleRelease

# iOS
# Open Xcode and archive the app
```

## Architecture

### State Management

The app uses Redux Toolkit with the following slices:

- **authSlice**: User authentication state
- **themeSlice**: Theme preferences (light/dark)
- **folderSlice**: Folder management
- **appSlice**: General app state

### API Layer

The API layer (`src/Api/ApiService.ts`) provides typed HTTP methods:

```typescript
// GET request
const data = await apiGet<ResponseType>('/endpoint');

// POST request
const result = await apiPost<ResponseType>('/endpoint', data);
```

### Custom Hooks

Key custom hooks:

- **useAuth**: Authentication operations
- **useFolderApi**: Folder CRUD operations
- **useSetApi**: Set CRUD operations
- **useThemeToggle**: Theme switching
- **useDebounce**: Input debouncing
- **useNetworkStatus**: Network connectivity

### Utility Functions

The `src/utils` directory provides:

- **errorHandling**: Consistent error parsing and handling
- **validation**: Form validation utilities
- **formatters**: Date, number, and text formatting
- **performance**: Memoization and optimization helpers

## Testing

Tests are located in the `__tests__` directory:

```
__tests__/
├── hooks/               # Hook tests
├── redux/               # Redux slice tests
├── services/            # Service tests
└── utils/               # Utility tests
```

Test utilities are available in `__tests__/utils/testUtils.ts`.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

This project is proprietary software.
