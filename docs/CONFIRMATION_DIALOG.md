# ConfirmationDialog Component

A reusable confirmation dialog component that follows the FlashCard app's theme and design patterns.

## 📁 Location

`/src/custome/ConfirmationDialog.js`

## ✨ Features

- ✅ Follows project theme (Light/Dark mode support)
- ✅ Fully customizable (title, message, button texts, colors)
- ✅ Danger/Error style for destructive actions
- ✅ Responsive sizing using project's Responsive utilities
- ✅ Consistent with existing component patterns (CustomeAlert, CustomeModal)
- ✅ TypeScript-ready with JSDoc comments
- ✅ Memoized for performance

## 🎨 Design

The component is built using:
- **CustomeModal** - Base modal wrapper
- **CustomeButton** - Themed buttons
- **useTheme** - Automatic theme support
- **Font** - Consistent typography
- **Color** - Project color palette
- **Responsive** - Scaled dimensions

## 📋 Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isVisible` | boolean | ✅ | - | Controls dialog visibility |
| `title` | string | ❌ | 'Confirm Action' | Dialog title text |
| `message` | string | ✅ | - | Confirmation message |
| `onConfirm` | function | ✅ | - | Callback when confirm pressed |
| `onCancel` | function | ✅ | - | Callback when cancel pressed |
| `confirmText` | string | ❌ | 'Confirm' | Confirm button text |
| `cancelText` | string | ❌ | 'Cancel' | Cancel button text |
| `confirmButtonColor` | string | ❌ | Color.theme1 | Custom confirm button color |
| `cancelButtonColor` | string | ❌ | Color.mediumGray | Custom cancel button color |
| `titleColor` | string | ❌ | Color.theme1 | Custom title color |
| `isDanger` | boolean | ❌ | false | Use danger/error styling |

## 🚀 Quick Start

### Basic Usage

```javascript
import React, {useState} from 'react';
import ConfirmationDialog from '../custome/ConfirmationDialog';

const MyScreen = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button onPress={() => setShowDialog(true)} title="Show Dialog" />
      
      <ConfirmationDialog
        isVisible={showDialog}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
        onConfirm={() => {
          console.log('Confirmed!');
          setShowDialog(false);
        }}
        onCancel={() => setShowDialog(false)}
      />
    </>
  );
};
```

### Delete Confirmation (Danger Style)

```javascript
<ConfirmationDialog
  isVisible={showDeleteDialog}
  title="Delete Item"
  message="This action cannot be undone. Are you sure?"
  confirmText="Delete"
  cancelText="Cancel"
  isDanger={true}
  onConfirm={handleDelete}
  onCancel={() => setShowDeleteDialog(false)}
/>
```

### Custom Colors

```javascript
<ConfirmationDialog
  isVisible={showDialog}
  title="Save Changes"
  message="Do you want to save your changes?"
  confirmText="Save"
  cancelText="Discard"
  confirmButtonColor={Color.success}
  cancelButtonColor={Color.error}
  titleColor={Color.success}
  onConfirm={handleSave}
  onCancel={() => setShowDialog(false)}
/>
```

## 📖 Examples

See complete examples with different use cases in:
`/docs/ConfirmationDialogExample.js`

## 🎯 Use Cases

Perfect for:
- ✓ Delete confirmations
- ✓ Logout confirmations
- ✓ Form submission confirmations
- ✓ Navigation confirmations
- ✓ Any action requiring user confirmation

## 🌗 Theme Support

The component automatically adapts to the app's theme:
- **Light Mode**: White background with dark text
- **Dark Mode**: Dark background with light text
- Background overlay: Themed using `colorTheme.modelBackground`
- Text colors: Themed using `colorTheme.textColor`

## 🎨 Color Variants

### Standard (default)
- Title: `Color.theme1` (#146d8b)
- Confirm Button: `Color.theme1`
- Cancel Button: `Color.mediumGray`

### Danger (isDanger={true})
- Title: `Color.error` (red)
- Confirm Button: `Color.error`
- Cancel Button: `Color.mediumGray`

### Custom
Use `confirmButtonColor`, `cancelButtonColor`, and `titleColor` props to customize

## 🔄 Comparison with CustomeAlert

| Feature | ConfirmationDialog | CustomeAlert |
|---------|-------------------|--------------|
| Buttons | 2 (Cancel + Confirm) | 1 (Ok) |
| Use Case | Confirmation actions | Information/Alerts |
| Button Layout | Side by side | Single centered |
| Danger Style | ✅ Built-in | ✅ Built-in |

## 🏗️ Architecture

```
ConfirmationDialog
  └─ CustomeModal (backdrop + positioning)
      └─ View (content container)
          ├─ Text (title)
          ├─ Text (message)
          └─ View (button container)
              ├─ CustomeButton (cancel)
              └─ CustomeButton (confirm)
```

## 📝 Notes

1. Always provide meaningful `title` and `message` for better UX
2. Use `isDanger={true}` for destructive actions (delete, remove, etc.)
3. Customize button texts to match your action (e.g., "Delete" instead of "Confirm")
4. Handle both `onConfirm` and `onCancel` callbacks
5. Don't forget to close the dialog in your callbacks

## 🧪 Testing

The component is ready for unit testing:
- Memoized with `React.memo` for performance
- Display name set for debugging
- All callbacks can be mocked
- Visibility controlled via single prop

---

**Created**: February 2026  
**Follows**: FlashCard App Design System  
**Compatible with**: React Native, iOS, Android
