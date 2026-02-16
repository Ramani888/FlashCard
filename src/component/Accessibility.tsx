/**
 * Accessibility Wrapper Component
 * Provides consistent accessibility props for interactive elements
 */
import React, {ReactNode} from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  AccessibilityRole,
  AccessibilityState,
  View,
  ViewProps,
} from 'react-native';

interface AccessibleTouchableProps extends Omit<TouchableOpacityProps, 'role'> {
  label: string;
  hint?: string;
  accessibilityRoleType?: AccessibilityRole;
  state?: AccessibilityState;
  children: ReactNode;
}

export const AccessibleTouchable: React.FC<AccessibleTouchableProps> = ({
  label,
  hint,
  accessibilityRoleType = 'button',
  state,
  children,
  ...props
}) => {
  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityRole={accessibilityRoleType}
      accessibilityState={state}
      {...props}>
      {children}
    </TouchableOpacity>
  );
};

interface AccessibleViewProps extends Omit<ViewProps, 'role'> {
  label: string;
  hint?: string;
  accessibilityRoleType?: AccessibilityRole;
  isHeader?: boolean;
  children: ReactNode;
}

export const AccessibleView: React.FC<AccessibleViewProps> = ({
  label,
  hint,
  accessibilityRoleType,
  isHeader = false,
  children,
  ...props
}) => {
  return (
    <View
      accessible={true}
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityRole={isHeader ? 'header' : accessibilityRoleType}
      {...props}>
      {children}
    </View>
  );
};

/**
 * Accessibility utilities
 */
export const a11y = {
  /**
   * Generate accessibility props for a button
   */
  button: (label: string, hint?: string, disabled?: boolean) => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: 'button' as AccessibilityRole,
    accessibilityState: {disabled},
  }),

  /**
   * Generate accessibility props for a link
   */
  link: (label: string, hint?: string) => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: 'link' as AccessibilityRole,
  }),

  /**
   * Generate accessibility props for an image
   */
  image: (label: string) => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: 'image' as AccessibilityRole,
  }),

  /**
   * Generate accessibility props for a header
   */
  header: (label: string) => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: 'header' as AccessibilityRole,
  }),

  /**
   * Generate accessibility props for a text input
   */
  input: (label: string, hint?: string, hasError?: boolean) => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: 'text' as AccessibilityRole,
    accessibilityState: {
      disabled: false,
      selected: false,
    },
    accessibilityValue: hasError ? {text: 'Has error'} : undefined,
  }),

  /**
   * Generate accessibility props for a checkbox/toggle
   */
  checkbox: (label: string, isChecked: boolean) => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: 'checkbox' as AccessibilityRole,
    accessibilityState: {checked: isChecked},
  }),

  /**
   * Generate accessibility props for a switch
   */
  switch: (label: string, isOn: boolean) => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: 'switch' as AccessibilityRole,
    accessibilityState: {checked: isOn},
  }),

  /**
   * Generate accessibility props for a list item
   */
  listItem: (label: string, index: number, total: number) => ({
    accessible: true,
    accessibilityLabel: `${label}, item ${index + 1} of ${total}`,
    accessibilityRole: 'listitem' as AccessibilityRole,
  }),

  /**
   * Generate accessibility props for an alert/notification
   */
  alert: (message: string) => ({
    accessible: true,
    accessibilityLabel: message,
    accessibilityRole: 'alert' as AccessibilityRole,
    accessibilityLiveRegion: 'assertive' as const,
  }),
};

export default {AccessibleTouchable, AccessibleView, a11y};
