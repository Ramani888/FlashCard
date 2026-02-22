# Loader Context Documentation

## Overview

The Loader Context provides a global loading indicator that can be controlled from anywhere in your application. This eliminates the need for managing loading states in individual components and ensures a consistent loading experience across the app.

## Architecture

The loader context consists of:
- **LoaderContext**: React context for loader state
- **LoaderProvider**: Provider component that wraps your app
- **useLoader**: Custom hook to access loader functionality
- **Loader Component**: Visual loader component (Modal with activity indicator)

## Setup

The LoaderProvider has been integrated into the app hierarchy in `App.js`:

```javascript
<Provider store={store}>
  <AuthProvider>
    <LoaderProvider>
      <AppContent />
    </LoaderProvider>
  </AuthProvider>
</Provider>
```

## Usage

### Basic Usage

Import the `useLoader` hook in any component:

```typescript
import { useLoader } from '../context';

const MyComponent = () => {
  const { showLoader, hideLoader } = useLoader();
  
  const handleAction = async () => {
    showLoader();
    try {
      await someAsyncOperation();
    } finally {
      hideLoader();
    }
  };
  
  return <Button onPress={handleAction} title="Do Something" />;
};
```

### Using withLoader (Recommended)

The `withLoader` method automatically handles showing and hiding the loader:

```typescript
import { useLoader } from '../context';

const MyComponent = () => {
  const { withLoader } = useLoader();
  
  const handleAction = async () => {
    await withLoader(async () => {
      await someAsyncOperation();
      await anotherAsyncOperation();
    });
  };
  
  return <Button onPress={handleAction} title="Do Something" />;
};
```

### Custom Loader Color

You can specify a custom color for the loader:

```typescript
const { showLoader, withLoader } = useLoader();

// Manual control with custom color
showLoader('#FF0000');

// withLoader with custom color
await withLoader(async () => {
  await someAsyncOperation();
}, '#00FF00');
```

## API Reference

### useLoader Hook

Returns an object with the following properties and methods:

#### Properties

- **isLoading**: `boolean` - Current loading state

#### Methods

- **showLoader(color?: string): void**
  - Shows the global loader
  - `color`: Optional hex color string for the loader spinner

- **hideLoader(): void**
  - Hides the global loader

- **withLoader<T>(asyncFn: () => Promise<T>, color?: string): Promise<T>**
  - Automatically shows loader before executing async function and hides it after
  - `asyncFn`: The async function to execute
  - `color`: Optional hex color string for the loader spinner
  - Returns: The result of the async function

## Real-World Examples

### Example 1: Login Screen

```typescript
import React from 'react';
import { View } from 'react-native';
import { useLoader } from '../context';
import { useAuth } from '../hooks/useAuth';
import CustomeButton from '../custome/CustomeButton';

const LoginScreen = () => {
  const { withLoader } = useLoader();
  const { loginUser } = useAuth();
  
  const handleLogin = async () => {
    await withLoader(async () => {
      await loginUser(email, password);
    });
  };
  
  return (
    <View>
      <CustomeButton title="Login" onPress={handleLogin} />
    </View>
  );
};
```

### Example 2: Fetching Data

```typescript
import React, { useEffect } from 'react';
import { useLoader } from '../context';
import { fetchUserData } from '../api/userApi';

const ProfileScreen = () => {
  const { withLoader } = useLoader();
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    loadUserData();
  }, []);
  
  const loadUserData = async () => {
    const data = await withLoader(async () => {
      return await fetchUserData();
    });
    setUserData(data);
  };
  
  return (
    // ... render profile
  );
};
```

### Example 3: Multiple Sequential Operations

```typescript
const handleComplexOperation = async () => {
  const { withLoader } = useLoader();
  
  await withLoader(async () => {
    // Step 1: Fetch data
    const data = await fetchData();
    
    // Step 2: Process data
    const processedData = await processData(data);
    
    // Step 3: Save results
    await saveResults(processedData);
    
    // All steps will show the loader
  });
};
```

### Example 4: Manual Control with Error Handling

```typescript
const handleSaveWithValidation = async () => {
  const { showLoader, hideLoader } = useLoader();
  
  // Validate first (no loader)
  if (!isValid) {
    showErrorAlert();
    return;
  }
  
  // Show loader only after validation passes
  showLoader();
  
  try {
    await saveData();
    showSuccessAlert();
  } catch (error) {
    showErrorAlert(error.message);
  } finally {
    hideLoader(); // Always hide loader
  }
};
```

### Example 5: Nested API Calls

```typescript
const synchronizeData = async () => {
  const { withLoader } = useLoader();
  
  await withLoader(async () => {
    // Fetch multiple resources in parallel
    const [users, posts, comments] = await Promise.all([
      fetchUsers(),
      fetchPosts(),
      fetchComments()
    ]);
    
    // Process and sync to local storage
    await syncToLocal({ users, posts, comments });
  });
};
```

## Best Practices

### ✅ DO

- Use `withLoader` for most async operations (cleaner code)
- Ensure `hideLoader` is called in finally blocks when using manual control
- Use custom colors sparingly and only when needed for specific UX requirements
- Keep loading operations short and meaningful

### ❌ DON'T

- Don't nest multiple `showLoader` calls without corresponding `hideLoader` calls
- Don't use loader for operations that take less than 200ms (too fast, causes flicker)
- Don't use for background operations where users can still interact with the app
- Don't forget to hide the loader in error cases

## Migration from useLoading Hook

If you were previously using the local `useLoading` hook:

**Before:**
```typescript
const MyComponent = () => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  
  const handleAction = async () => {
    startLoading();
    try {
      await someAction();
    } finally {
      stopLoading();
    }
  };
  
  return (
    <>
      <Loader visible={isLoading} />
      <Button onPress={handleAction} />
    </>
  );
};
```

**After:**
```typescript
const MyComponent = () => {
  const { withLoader } = useLoader();
  
  const handleAction = async () => {
    await withLoader(async () => {
      await someAction();
    });
  };
  
  return <Button onPress={handleAction} />;
};
```

Benefits:
- No need to import and render `<Loader />` component
- Less boilerplate code
- Consistent loader appearance across the app
- Centralized loader management

## Troubleshooting

### Loader not showing
- Ensure `LoaderProvider` is properly wrapped around your app
- Check that you're using `useLoader` inside a component that's a child of `LoaderProvider`

### Loader stuck on screen
- Make sure every `showLoader()` has a corresponding `hideLoader()`
- Use `withLoader` to automatically handle cleanup
- Check for unhandled promise rejections

### Multiple loaders appearing
- The global loader context ensures only one loader is shown at a time
- If you see multiple loaders, check if you're still using local `<Loader />` components elsewhere

## TypeScript Support

The Loader Context is fully typed. TypeScript will provide autocomplete and type checking:

```typescript
import { useLoader } from '../context';

const MyComponent: React.FC = () => {
  const { showLoader, hideLoader, withLoader, isLoading } = useLoader();
  
  // TypeScript knows the types of all methods and properties
  // withLoader properly infers return types from async functions
  
  const fetchData = async (): Promise<string> => {
    return await withLoader(async () => {
      const response = await fetch('/api/data');
      return await response.text();
    }); // Return type is inferred as Promise<string>
  };
  
  return null;
};
```

## Testing

When testing components that use the loader context, wrap them with `LoaderProvider`:

```typescript
import { render } from '@testing-library/react-native';
import { LoaderProvider } from '../context';
import MyComponent from './MyComponent';

test('should show loader during async operation', () => {
  const { getByTestId } = render(
    <LoaderProvider>
      <MyComponent />
    </LoaderProvider>
  );
  
  // Your test assertions
});
```

## Performance Considerations

- The loader uses React's context, which is optimized for infrequent updates
- The Loader component uses `memo` to prevent unnecessary re-renders
- Color state is managed separately to avoid re-rendering when only color changes
- Modal rendering is optimized with early return when not visible

## Future Enhancements

Possible future improvements:
- Queue system for multiple simultaneous loader requests
- Custom loader components or animations
- Minimum display time to prevent flicker on fast operations
- Progress indicator support for long operations
- Multiple loader instances for different parts of the app
