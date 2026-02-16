# Contributing to FlashCard

Thank you for your interest in contributing to FlashCard! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Create a new branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Run tests: `npm test`
6. Submit a pull request

## Code Style

### TypeScript

- Use strict TypeScript mode
- Prefer interfaces over type aliases for object types
- Export types alongside their implementations
- Use meaningful variable and function names

```typescript
// Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export const formatUserName = (user: UserProfile): string => {
  return user.name.trim();
};

// Avoid
type user = { id: any; name: any };
export const fmt = (u: any) => u.name;
```

### React Components

- Use functional components with hooks
- Use TypeScript for prop types
- Memoize expensive computations
- Keep components focused and single-purpose

```typescript
interface ComponentProps {
  title: string;
  onPress: () => void;
}

const MyComponent: React.FC<ComponentProps> = memo(({title, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});
```

### Redux

- Use Redux Toolkit slices
- Keep reducers pure and simple
- Use selectors for derived state
- Use typed hooks (`useAppSelector`, `useAppDispatch`)

```typescript
// Creating a slice
const mySlice = createSlice({
  name: 'myFeature',
  initialState,
  reducers: {
    actionName: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

// Using in components
const value = useAppSelector(state => state.myFeature.value);
const dispatch = useAppDispatch();
dispatch(actionName('newValue'));
```

### File Naming

- Components: PascalCase (`MyComponent.tsx`)
- Hooks: camelCase with `use` prefix (`useMyHook.ts`)
- Utils: camelCase (`formatDate.ts`)
- Types: PascalCase for interfaces/types

### Import Order

Follow this import order:

1. React and React Native imports
2. External library imports
3. Internal imports (absolute paths)
4. Relative imports
5. Styles/assets

```typescript
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '@redux/hooks';
import {formatDate} from '../utils';
import styles from './styles';
```

## Testing

### Writing Tests

- Write tests for all utility functions
- Test Redux slices with their reducers
- Test custom hooks with renderHook
- Use meaningful test descriptions

```typescript
describe('formatDate', () => {
  it('should format date correctly', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
  });

  it('should handle invalid dates', () => {
    const result = formatDate('invalid');
    expect(result).toBe('');
  });
});
```

### Test Coverage

Aim for:
- 80%+ coverage on utility functions
- 70%+ coverage on Redux slices
- 60%+ coverage on components

## Git Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions/updates

### Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(auth): add forgot password flow
fix(cards): resolve card flip animation lag
refactor(api): migrate to TypeScript
```

### Pull Requests

1. Update your branch with the latest main
2. Ensure all tests pass
3. Update documentation if needed
4. Request review from maintainers
5. Address review feedback

## Directory Structure Guidelines

### Adding New Features

1. Create components in `src/component/[feature]/`
2. Create screens in `src/screen/[feature]/`
3. Add Redux slice if needed in `src/redux/slices/`
4. Add hooks in `src/hooks/`
5. Add tests in `__tests__/`

### Component Organization

```
src/component/myFeature/
├── MyFeature.tsx           # Main component
├── MyFeatureItem.tsx       # Sub-component
├── MyFeatureModal.tsx      # Modal component
└── index.ts                # Exports
```

## Performance Considerations

- Use `React.memo` for pure components
- Use `useMemo` and `useCallback` appropriately
- Avoid inline styles and functions in render
- Use `FlatList` for long lists
- Implement proper `keyExtractor` and `getItemLayout`

## Questions?

If you have questions about contributing, feel free to:
- Open an issue for discussion
- Reach out to maintainers

Thank you for contributing!
