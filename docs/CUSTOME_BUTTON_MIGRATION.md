# CustomeButton Migration Guide

## 🎉 IMPORTANT: No Migration Required!

**The new CustomeButton is 100% backward compatible!** All your existing code continues to work without any changes.

### What Changed?
- ✅ TypeScript conversion with full type safety
- ✅ Better performance optimizations
- ✅ Enhanced accessibility features
- ✅ New cleaner API with style objects
- ✅ **All old props still work!**

### Do I Need to Change My Code?
**No!** Your existing code works as-is:

```jsx
// This still works exactly the same ✅
<CustomeButton
  title="Submit"
  buttonWidth={200}
  buttonColor="#007AFF"
  fontColor="#FFFFFF"
  onPress={handleSubmit}
/>
```

### Should I Use the New API?
For **new code**, the new API is cleaner and recommended:

```tsx
// New API (recommended for new code)
<CustomeButton
  title="Submit"
  containerStyle={{ width: 200, backgroundColor: '#007AFF' }}
  textStyle={{ color: '#FFFFFF' }}
  onPress={handleSubmit}
/>
```

But you can migrate gradually—update components when you touch them, not all at once.

---

## Overview

The CustomeButton component has been optimized with TypeScript, improved API design, better performance, and enhanced accessibility. This guide will help you migrate from the old API to the new one.

## Key Improvements

### ✅ TypeScript Support
- Full TypeScript type definitions
- Better IDE autocomplete and type checking
- Catch errors at compile time

### ✅ Simplified API
- **Before**: 30+ individual style props
- **After**: 2 style props (`containerStyle`, `textStyle`)
- More flexible and cleaner component API

### ✅ Better Performance
- Optimized memoization strategy
- Reduced re-renders
- Better press handler optimization

### ✅ Enhanced Accessibility
- Proper accessibility roles and labels
- Keyboard navigation support
- Screen reader friendly
- Minimum touch target sizes

### ✅ Modern Features
- TypeScript support
- Press state visual feedback
- Comprehensive test coverage
- Better icon configuration

---

## Migration Examples

### Basic Button

#### Old API
```jsx
<CustomeButton
  title="Submit"
  buttonWidth={200}
  buttonHeight={50}
  buttonColor="#007AFF"
  fontSize={16}
  fontColor="#FFFFFF"
  borderRadius={8}
  onPress={handleSubmit}
/>
```

#### New API
```tsx
<CustomeButton
  title="Submit"
  containerStyle={{
    width: 200,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  }}
  textStyle={{
    fontSize: 16,
    color: '#FFFFFF',
  }}
  onPress={handleSubmit}
/>
```

---

### Button with Icons

#### Old API
```jsx
<CustomeButton
  title="Next"
  iconRight={true}
  IconComponentName={MaterialIcons}
  iconName="arrow-forward"
  iconSize={20}
  iconColor="#FFFFFF"
  iconPaddingLeft={8}
  buttonColor="#007AFF"
  fontColor="#FFFFFF"
  onPress={handleNext}
/>
```

#### New API
```tsx
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

<CustomeButton
  title="Next"
  iconRight={{
    Component: MaterialIcons,
    name: 'arrow-forward',
    size: 20,
    color: '#FFFFFF',
    style: { marginLeft: 8 },
  }}
  containerStyle={{ backgroundColor: '#007AFF' }}
  textStyle={{ color: '#FFFFFF' }}
  onPress={handleNext}
/>
```

---

### Button with Both Icons

#### Old API
```jsx
<CustomeButton
  title="Transfer"
  iconLeft={true}
  iconRight={true}
  IconComponentName={MaterialIcons}
  iconName="swap-horiz"  // Same icon for both sides
  iconSize={20}
  iconColor="#FFFFFF"
  iconPaddingRight={8}
  iconPaddingLeft={8}
  buttonColor="#4CAF50"
  onPress={handleTransfer}
/>
```

#### New API
```tsx
<CustomeButton
  title="Transfer"
  iconLeft={{
    Component: MaterialIcons,
    name: 'arrow-back',
    size: 20,
    color: '#FFFFFF',
    style: { marginRight: 8 },
  }}
  iconRight={{
    Component: MaterialIcons,
    name: 'arrow-forward',
    size: 20,
    color: '#FFFFFF',
    style: { marginLeft: 8 },
  }}
  containerStyle={{ backgroundColor: '#4CAF50' }}
  onPress={handleTransfer}
/>
```

---

### Disabled Button

#### Old API
```jsx
<CustomeButton
  title="Disabled"
  disabled={true}
  buttonColor="#CCCCCC"
  fontColor="#666666"
  onPress={handlePress}
/>
```

#### New API
```tsx
<CustomeButton
  title="Disabled"
  disabled={true}
  containerStyle={{ backgroundColor: '#CCCCCC' }}
  textStyle={{ color: '#666666' }}
  onPress={handlePress}
/>
```

*Note: The new version automatically applies opacity to disabled buttons.*

---

### Complex Styled Button

#### Old API
```jsx
<CustomeButton
  title="Custom"
  buttonWidth="100%"
  buttonHeight={60}
  buttonColor="#FF5722"
  fontSize={18}
  fontColor="#FFFFFF"
  fontFamily="Roboto-Bold"
  fontWeight="bold"
  textTransform="uppercase"
  borderRadius={12}
  borderWidth={2}
  borderColor="#D84315"
  marginTop={20}
  marginHorizontal={16}
  paddingHorizontal={24}
  elevation={4}
  onPress={handlePress}
/>
```

#### New API
```tsx
<CustomeButton
  title="Custom"
  containerStyle={{
    width: '100%',
    height: 60,
    backgroundColor: '#FF5722',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D84315',
    marginTop: 20,
    marginHorizontal: 16,
    paddingHorizontal: 24,
    elevation: 4,
  }}
  textStyle={{
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }}
  onPress={handlePress}
/>
```

---

## New Features

### 1. Accessibility Support

```tsx
<CustomeButton
  title="Submit Form"
  accessibilityLabel="Submit registration form"
  accessibilityHint="Double tap to submit your information"
  onPress={handleSubmit}
/>
```

### 2. Test ID Support

```tsx
<CustomeButton
  title="Login"
  testID="login-button"
  onPress={handleLogin}
/>
```

### 3. Press State Visual Feedback

The new button automatically provides visual feedback when pressed (opacity change). This is built-in and requires no configuration.

### 4. Additional Pressable Props

You can now pass any Pressable prop directly:

```tsx
<CustomeButton
  title="Long Press"
  onPress={handlePress}
  onLongPress={handleLongPress}
  onPressIn={handlePressIn}
  onPressOut={handlePressOut}
  delayLongPress={800}
/>
```

---

## Style Props Mapping Reference

### Container Styles

| Old Props | New Prop |
|-----------|----------|
| `buttonWidth` | `containerStyle.width` |
| `buttonHeight` | `containerStyle.height` |
| `buttonColor` | `containerStyle.backgroundColor` |
| `borderRadius` | `containerStyle.borderRadius` |
| `borderTopLeftRadius` | `containerStyle.borderTopLeftRadius` |
| `borderTopRightRadius` | `containerStyle.borderTopRightRadius` |
| `borderBottomLeftRadius` | `containerStyle.borderBottomLeftRadius` |
| `borderBottomRightRadius` | `containerStyle.borderBottomRightRadius` |
| `borderWidth` | `containerStyle.borderWidth` |
| `borderColor` | `containerStyle.borderColor` |
| `marginTop` | `containerStyle.marginTop` |
| `marginBottom` | `containerStyle.marginBottom` |
| `marginLeft` | `containerStyle.marginLeft` |
| `marginRight` | `containerStyle.marginRight` |
| `marginHorizontal` | `containerStyle.marginHorizontal` |
| `marginVertical` | `containerStyle.marginVertical` |
| `paddingHorizontal` | `containerStyle.paddingHorizontal` |
| `paddingVertical` | `containerStyle.paddingVertical` |
| `padding` | `containerStyle.padding` |
| `elevation` | `containerStyle.elevation` |
| `alignSelf` | `containerStyle.alignSelf` |
| `position` | `containerStyle.position` |
| `top` | `containerStyle.top` |
| `bottom` | `containerStyle.bottom` |
| `left` | `containerStyle.left` |
| `right` | `containerStyle.right` |

### Text Styles

| Old Props | New Prop |
|-----------|----------|
| `fontSize` | `textStyle.fontSize` |
| `fontColor` | `textStyle.color` |
| `fontFamily` | `textStyle.fontFamily` |
| `fontWeight` | `textStyle.fontWeight` |
| `textTransform` | `textStyle.textTransform` |

### Icon Configuration

| Old Props | New Prop |
|-----------|----------|
| `iconLeft` (boolean) | `iconLeft` (object) |
| `iconRight` (boolean) | `iconRight` (object) |
| `IconComponentName` | `iconLeft.Component` / `iconRight.Component` |
| `iconName` | `iconLeft.name` / `iconRight.name` |
| `iconSize` | `iconLeft.size` / `iconRight.size` |
| `iconColor` | `iconLeft.color` / `iconRight.color` |
| `iconPaddingRight` | `iconLeft.style.marginRight` |
| `iconPaddingLeft` | `iconRight.style.marginLeft` |

---

## Benefits of the New API

### 1. **Less Code**
```tsx
// Old: 200+ lines of props
// New: Clean, organized style objects
```

### 2. **Better Reusability**
```tsx
const primaryButtonStyle = {
  backgroundColor: '#007AFF',
  paddingHorizontal: 24,
  borderRadius: 8,
};

<CustomeButton title="Save" containerStyle={primaryButtonStyle} />
<CustomeButton title="Submit" containerStyle={primaryButtonStyle} />
```

### 3. **Easier to Style**
You can now use StyleSheet.create for better performance:

```tsx
const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

<CustomeButton
  title="Submit"
  containerStyle={styles.primaryButton}
  textStyle={styles.buttonText}
/>
```

### 4. **Type Safety**
With TypeScript, you get:
- Autocomplete for all props
- Type checking at compile time
- Better refactoring support
- Inline documentation

---

## Performance Improvements

The new component includes:

1. **Optimized Memoization**: Only re-renders when necessary
2. **useCallback for Handlers**: Prevents unnecessary function re-creation
3. **Efficient Style Processing**: Reduces inline style object creation
4. **Press State Optimization**: Built-in press visual feedback without extra re-renders

---

## Testing

The new component includes comprehensive test coverage:

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import CustomeButton from '@/custome/CustomeButton';

test('button press works correctly', () => {
  const onPress = jest.fn();
  const { getByTestId } = render(
    <CustomeButton 
      title="Test" 
      onPress={onPress} 
      testID="test-button"
    />
  );
  
  fireEvent.press(getByTestId('test-button'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
```

---

## Migration Checklist

- [ ] Update imports to use the new `.tsx` file
- [ ] Replace individual style props with `containerStyle` object
- [ ] Replace text style props with `textStyle` object
- [ ] Update icon configuration to use object format
- [ ] Add `testID` props for testing
- [ ] Add accessibility labels where appropriate
- [ ] Test button functionality after migration
- [ ] Update tests to use new API

---

## Backward Compatibility

The new `CustomeButton.tsx` file is **100% backward compatible** with the old API. Both the old individual props and new style objects work in the same component:

```tsx
// Both APIs work in the same component
import CustomeButton from '@/custome/CustomeButton';

// Use old API (individual props)
<CustomeButton buttonWidth={200} buttonColor="#007AFF" />

// Use new API (style objects)
<CustomeButton containerStyle={{ width: 200, backgroundColor: '#007AFF' }} />

// Mix both APIs
<CustomeButton buttonColor="#007AFF" containerStyle={{ borderRadius: 12 }} />
```

---

## Need Help?

If you encounter any issues during migration:

1. Check this guide for examples
2. Review the TypeScript types for available props
3. Check the test file for usage examples
4. Refer to the component source code for implementation details

---

## Summary

The new CustomeButton component provides:
- ✅ Cleaner, more maintainable API
- ✅ Better performance
- ✅ Full TypeScript support
- ✅ Enhanced accessibility
- ✅ Comprehensive test coverage
- ✅ Modern React best practices

The migration is straightforward and will result in cleaner, more maintainable code.
