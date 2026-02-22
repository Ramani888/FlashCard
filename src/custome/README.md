# CustomeButton Component

A highly optimized, TypeScript-based button component for React Native with full accessibility support, flexible styling, and comprehensive test coverage.

## 🎯 Features

- ✅ **TypeScript Support** - Full type safety and IntelliSense
- ✅ **Backward Compatible** - Works with existing old API (30+ individual props)
- ✅ **Performance Optimized** - Memoized rendering and callbacks
- ✅ **Accessibility First** - WCAG compliant with proper ARIA attributes
- ✅ **Flexible Styling** - New API with style objects OR legacy individual props
- ✅ **Icon Support** - Left and right icons with any icon library
- ✅ **Press Feedback** - Built-in visual feedback for press states
- ✅ **Test Coverage** - 30 comprehensive unit tests including backward compatibility
- ✅ **Modern React** - Uses hooks and latest best practices

## 📦 Installation

The component is already part of your project at:
```
src/custome/CustomeButton.tsx
```

**Important:** This component is **100% backward compatible** with the old API. All existing code will continue to work without any changes!

## 🚀 Quick Start

**The component is 100% backward compatible!** Your existing code works as-is:

```tsx
// ✅ Old API still works (no changes needed)
<CustomeButton
  title="Submit"
  buttonWidth={200}
  buttonColor="#007AFF"
  fontColor="#FFFFFF"
  onPress={handleSubmit}
/>

// ✅ New API also available (cleaner, recommended for new code)
<CustomeButton
  title="Submit"
  containerStyle={{ width: 200, backgroundColor: '#007AFF' }}
  textStyle={{ color: '#FFFFFF' }}
  onPress={handleSubmit}
/>

// ✅ Mix both APIs (legacy props + new style objects)
<CustomeButton
  title="Submit"
  buttonColor="#007AFF"
  containerStyle={{ borderRadius: 12 }}
  textStyle={{ fontWeight: 'bold' }}
  onPress={handleSubmit}
/>
```

## ⚡ Backward Compatibility

All existing code using the old API continues to work without any changes! The component supports:

### Legacy Props (Deprecated but Supported)
- **Container**: `buttonWidth`, `buttonHeight`, `buttonColor`, `borderRadius`, `borderWidth`, `borderColor`, `margin*`, `padding*`, `elevation`, `position`, `top`, `bottom`, `left`, `right`, `alignSelf`
- **Text**: `fontSize`, `fontColor`, `fontFamily`, `fontWeight`, `textTransform`  
- **Legacy Icons**: `IconComponentName`, `iconName`, `iconSize`, `iconColor`, `iconPaddingRight`, `iconPaddingLeft`

### Migration Strategy
1. ✅ **No changes required** - All existing code works immediately
2. ✅ **Gradual migration** - Update components one-by-one when you touch them
3. ✅ **Mix both APIs** - Use legacy props with new style objects
4. ✅ **New code** - Use the cleaner new API (recommended)

```tsx
// ✅ All these work:

// Pure old API
<CustomeButton buttonWidth={200} buttonColor="#007AFF" />

// Pure new API  
<CustomeButton containerStyle={{ width: 200, backgroundColor: '#007AFF' }} />

// Mixed (legacy props + new styles)
<CustomeButton 
  buttonColor="#007AFF" 
  containerStyle={{ borderRadius: 12 }}
/>
```

## 📚 API Reference

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✅ | - | Button text |
| `onPress` | `() => void` | ❌ | - | Press handler |
| `containerStyle` | `StyleProp<ViewStyle>` | ❌ | - | Container styles |
| `textStyle` | `StyleProp<TextStyle>` | ❌ | - | Text styles |
| `iconLeft` | `IconConfig` | ❌ | - | Left icon configuration |
| `iconRight` | `IconConfig` | ❌ | - | Right icon configuration |
| `disabled` | `boolean` | ❌ | `false` | Disable button |
| `accessibilityLabel` | `string` | ❌ | `title` | Accessibility label |
| `accessibilityHint` | `string` | ❌ | - | Accessibility hint |
| `testID` | `string` | ❌ | - | Test identifier |

**Plus all standard `Pressable` props** (`onLongPress`, `onPressIn`, `onPressOut`, etc.)

### IconConfig Type

```typescript
interface IconConfig {
  Component: React.ComponentType<any>;  // Icon component (e.g., MaterialIcons)
  name: string;                         // Icon name
  size?: number;                        // Icon size (default: 20)
  color?: string;                       // Icon color (default: '#000')
  style?: StyleProp<ViewStyle>;         // Icon container style
}
```

## 💡 Usage Examples

### Basic Buttons

```tsx
// Primary Button
<CustomeButton
  title="Submit"
  onPress={handleSubmit}
  containerStyle={{
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    borderRadius: 8,
  }}
  textStyle={{ color: '#FFFFFF', fontSize: 16 }}
/>

// Outlined Button
<CustomeButton
  title="Cancel"
  onPress={handleCancel}
  containerStyle={{
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
  }}
  textStyle={{ color: '#007AFF' }}
/>

// Disabled Button
<CustomeButton
  title="Disabled"
  disabled={true}
  containerStyle={{ backgroundColor: '#CCCCCC' }}
/>
```

### With Icons

```tsx
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Left Icon
<CustomeButton
  title="Save"
  onPress={handleSave}
  iconLeft={{
    Component: MaterialIcons,
    name: 'save',
    size: 20,
    color: '#FFFFFF',
    style: { marginRight: 8 },
  }}
  containerStyle={{ backgroundColor: '#34C759' }}
  textStyle={{ color: '#FFFFFF' }}
/>

// Right Icon
<CustomeButton
  title="Next"
  onPress={handleNext}
  iconRight={{
    Component: MaterialIcons,
    name: 'arrow-forward',
    size: 20,
    color: '#FFFFFF',
    style: { marginLeft: 8 },
  }}
/>

// Both Icons
<CustomeButton
  title="Transfer"
  iconLeft={{
    Component: MaterialIcons,
    name: 'arrow-back',
    size: 18,
    color: '#FFF',
  }}
  iconRight={{
    Component: MaterialIcons,
    name: 'arrow-forward',
    size: 18,
    color: '#FFF',
  }}
/>
```

### Accessibility

```tsx
<CustomeButton
  title="Submit Form"
  onPress={handleSubmit}
  accessibilityLabel="Submit registration form"
  accessibilityHint="Double tap to submit your registration information"
  testID="submit-form-button"
/>
```

### Reusable Styles

```tsx
import { StyleSheet } from 'react-native';

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

// Use across multiple buttons
<CustomeButton 
  title="Save" 
  containerStyle={styles.primaryButton}
  textStyle={styles.buttonText}
/>

<CustomeButton 
  title="Submit" 
  containerStyle={styles.primaryButton}
  textStyle={styles.buttonText}
/>
```

### Advanced Usage

```tsx
// Full width with custom styles
<CustomeButton
  title="Continue"
  onPress={handleContinue}
  containerStyle={{
    width: '100%',
    height: 56,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }}
  textStyle={{
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }}
/>

// With additional Pressable props
<CustomeButton
  title="Long Press Me"
  onPress={handlePress}
  onLongPress={handleLongPress}
  onPressIn={() => console.log('Press started')}
  onPressOut={() => console.log('Press ended')}
  delayLongPress={800}
/>
```

## 🧪 Testing

The component includes comprehensive test coverage. To run tests:

```bash
npm test -- CustomeButton.test.tsx
```

### Writing Tests

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import CustomeButton from '@/custome/CustomeButton';

test('button calls onPress when pressed', () => {
  const onPress = jest.fn();
  const { getByTestId } = render(
    <CustomeButton 
      title="Test Button" 
      onPress={onPress}
      testID="test-btn"
    />
  );
  
  fireEvent.press(getByTestId('test-btn'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
```

## 🎨 Styling Guide

### Container Styles
All standard React Native `View` styles are supported:
- Layout: `width`, `height`, `flex`, `alignSelf`
- Spacing: `margin*`, `padding*`
- Border: `borderRadius`, `borderWidth`, `borderColor`
- Colors: `backgroundColor`
- Elevation: `elevation` (Android), `shadow*` (iOS)

### Text Styles
All standard React Native `Text` styles are supported:
- Typography: `fontSize`, `fontFamily`, `fontWeight`
- Color: `color`
- Transform: `textTransform`
- Alignment: `textAlign`

## 🚀 Performance Tips

1. **Use StyleSheet.create** for static styles:
   ```tsx
   const styles = StyleSheet.create({
     button: { backgroundColor: '#007AFF' }
   });
   ```

2. **Memoize dynamic styles**:
   ```tsx
   const buttonStyle = useMemo(() => ({
     backgroundColor: isActive ? '#007AFF' : '#CCCCCC'
   }), [isActive]);
   ```

3. **Stable callbacks**:
   ```tsx
   const handlePress = useCallback(() => {
     doSomething();
   }, []);
   ```

## 📖 Migration from Old API

If you're migrating from the old `CustomeButton.js`, see the [Migration Guide](../../docs/CUSTOME_BUTTON_MIGRATION.md) for detailed instructions and examples.

**Quick comparison:**
```tsx
// Old API (30+ props)
<CustomeButton
  title="Save"
  buttonWidth={200}
  buttonHeight={50}
  buttonColor="#007AFF"
  fontSize={16}
  fontColor="#FFFFFF"
  borderRadius={8}
  marginTop={20}
  // ... 20+ more props
/>

// New API (2 style props)
<CustomeButton
  title="Save"
  containerStyle={{
    width: 200,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginTop: 20,
  }}
  textStyle={{
    fontSize: 16,
    color: '#FFFFFF',
  }}
/>
```

## 🎯 Accessibility Checklist

- ✅ Minimum touch target size (44pt)
- ✅ Proper accessibility role (`button`)
- ✅ Accessibility labels and hints
- ✅ Disabled state indication
- ✅ Screen reader support
- ✅ High contrast support
- ✅ Keyboard navigation (when applicable)

## 📝 Best Practices

1. **Always provide `accessibilityLabel`** for screen readers
2. **Use `testID`** for automated testing
3. **Keep button text short and descriptive**
4. **Ensure sufficient color contrast** (4.5:1 minimum)
5. **Maintain minimum touch target size** (44pt)
6. **Use icons with text labels** for clarity
7. **Provide visual feedback** for press states (built-in)

## 🔧 Troubleshooting

### Icons not appearing?
Make sure you've installed and linked the icon library:
```bash
npm install react-native-vector-icons
# Follow platform-specific setup instructions
```

### TypeScript errors?
Ensure your `tsconfig.json` includes proper React Native types:
```json
{
  "compilerOptions": {
    "jsx": "react-native"
  }
}
```

### Styles not applying?
Both APIs work! You can use either:
```tsx
// ✅ Old API (individual props)
<CustomeButton buttonColor="#007AFF" />

// ✅ New API (style objects)
<CustomeButton containerStyle={{ backgroundColor: '#007AFF' }} />

// ✅ Mix both
<CustomeButton buttonColor="#007AFF" containerStyle={{ borderRadius: 12 }} />
```

## 📚 Additional Resources

- [React Native Pressable](https://reactnative.dev/docs/pressable)
- [Accessibility Guidelines](https://reactnative.dev/docs/accessibility)
- [TypeScript in React Native](https://reactnative.dev/docs/typescript)
- [Testing React Native](https://reactnative.dev/docs/testing-overview)

## 📄 Related Files

- Component: [CustomeButton.tsx](./CustomeButton.tsx)
- Tests: [CustomeButton.test.tsx](../../__tests__/custome/CustomeButton.test.tsx)
- Migration Guide: [CUSTOME_BUTTON_MIGRATION.md](../../docs/CUSTOME_BUTTON_MIGRATION.md)

## 🤝 Contributing

When contributing changes to this component:
1. Maintain backward compatibility where possible
2. Add tests for new features
3. Update documentation
4. Follow TypeScript best practices
5. Ensure accessibility standards are met

---

**Version:** 2.0.0 (TypeScript with Backward Compatibility)  
**Last Updated:** February 2026
