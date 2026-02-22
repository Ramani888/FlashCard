import React, { memo, useCallback, useMemo } from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
  type StyleProp,
} from 'react-native';

const { height } = Dimensions.get('window');

interface IconConfig {
  Component: React.ComponentType<any>;
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export interface CustomeButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  onPress?: () => void;
  
  // New API - Style props (recommended)
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  
  // Icon configuration (new API)
  iconLeft?: IconConfig;
  iconRight?: IconConfig;
  
  // Legacy API - Individual style props (deprecated but supported for backward compatibility)
  buttonWidth?: number | string;
  buttonHeight?: number | string;
  buttonColor?: string;
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  fontWeight?: TextStyle['fontWeight'];
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginHorizontal?: number;
  paddingHorizontal?: number;
  marginVertical?: number;
  paddingVertical?: number;
  padding?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  elevation?: number;
  alignSelf?: ViewStyle['alignSelf'];
  position?: ViewStyle['position'];
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  
  // Legacy icon props (deprecated)
  IconComponentName?: React.ComponentType<any>;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  iconPaddingRight?: number;
  iconPaddingLeft?: number;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  
  // Visual states
  disabled?: boolean;
}

const CustomeButton = memo<CustomeButtonProps>(({
  title,
  onPress,
  containerStyle,
  textStyle,
  iconLeft,
  iconRight,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
  
  // Legacy props
  buttonWidth,
  buttonHeight,
  buttonColor,
  fontSize,
  fontColor,
  fontFamily,
  textTransform,
  fontWeight,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  marginHorizontal,
  paddingHorizontal,
  marginVertical,
  paddingVertical,
  padding,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomRightRadius,
  borderBottomLeftRadius,
  borderRadius,
  borderWidth,
  borderColor,
  elevation,
  alignSelf,
  position,
  top,
  bottom,
  left,
  right,
  IconComponentName,
  iconName,
  iconSize,
  iconColor,
  iconPaddingRight,
  iconPaddingLeft,
  
  ...pressableProps
}) => {
  // Convert legacy props to style objects for backward compatibility
  const legacyContainerStyle = useMemo(() => {
    const style: ViewStyle = {};
    
    if (buttonWidth !== undefined) style.width = buttonWidth as any;
    if (buttonHeight !== undefined) style.height = buttonHeight as any;
    if (buttonColor !== undefined) style.backgroundColor = buttonColor;
    if (borderRadius !== undefined) style.borderRadius = borderRadius;
    if (borderTopLeftRadius !== undefined) style.borderTopLeftRadius = borderTopLeftRadius;
    if (borderTopRightRadius !== undefined) style.borderTopRightRadius = borderTopRightRadius;
    if (borderBottomRightRadius !== undefined) style.borderBottomRightRadius = borderBottomRightRadius;
    if (borderBottomLeftRadius !== undefined) style.borderBottomLeftRadius = borderBottomLeftRadius;
    if (borderWidth !== undefined) style.borderWidth = borderWidth;
    if (borderColor !== undefined) style.borderColor = borderColor;
    if (marginTop !== undefined) style.marginTop = marginTop;
    if (marginBottom !== undefined) style.marginBottom = marginBottom;
    if (marginLeft !== undefined) style.marginLeft = marginLeft;
    if (marginRight !== undefined) style.marginRight = marginRight;
    if (marginHorizontal !== undefined) style.marginHorizontal = marginHorizontal;
    if (paddingHorizontal !== undefined) style.paddingHorizontal = paddingHorizontal;
    if (marginVertical !== undefined) style.marginVertical = marginVertical;
    if (paddingVertical !== undefined) style.paddingVertical = paddingVertical;
    if (padding !== undefined) style.padding = padding;
    if (elevation !== undefined) style.elevation = elevation;
    if (alignSelf !== undefined) style.alignSelf = alignSelf;
    if (position !== undefined) style.position = position;
    if (top !== undefined) style.top = top;
    if (bottom !== undefined) style.bottom = bottom;
    if (left !== undefined) style.left = left;
    if (right !== undefined) style.right = right;
    
    // Apply default height if neither buttonHeight nor containerStyle.height is provided
    if (!buttonHeight && !containerStyle) {
      style.height = height * 0.06;
    }
    
    return Object.keys(style).length > 0 ? style : null;
  }, [
    buttonWidth, buttonHeight, buttonColor, borderRadius,
    borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius,
    borderWidth, borderColor, marginTop, marginBottom, marginLeft, marginRight,
    marginHorizontal, paddingHorizontal, marginVertical, paddingVertical,
    padding, elevation, alignSelf, position, top, bottom, left, right, containerStyle,
  ]);

  const legacyTextStyle = useMemo(() => {
    const style: TextStyle = {};
    
    if (fontSize !== undefined) style.fontSize = fontSize;
    if (fontColor !== undefined) style.color = fontColor;
    if (fontFamily !== undefined) style.fontFamily = fontFamily;
    if (fontWeight !== undefined) style.fontWeight = fontWeight;
    if (textTransform !== undefined) style.textTransform = textTransform;
    
    return Object.keys(style).length > 0 ? style : null;
  }, [fontSize, fontColor, fontFamily, fontWeight, textTransform]);

  // Convert legacy icon props to new icon config
  const legacyIconLeft = useMemo(() => {
    if (IconComponentName && iconName && !iconLeft && !iconRight) {
      return {
        Component: IconComponentName,
        name: iconName,
        size: iconSize,
        color: iconColor,
        style: iconPaddingRight ? { marginRight: iconPaddingRight } : undefined,
      };
    }
    return null;
  }, [IconComponentName, iconName, iconSize, iconColor, iconPaddingRight, iconLeft, iconRight]);

  const legacyIconRight = useMemo(() => {
    if (IconComponentName && iconName && !iconLeft && iconRight === undefined) {
      return null;
    }
    return null;
  }, [IconComponentName, iconName, iconLeft, iconRight]);

  // Memoize press handler to prevent unnecessary re-renders
  const handlePress = useCallback(() => {
    if (onPress && !disabled) {
      onPress();
    }
  }, [onPress, disabled]);

  // Render left icon if configured
  const renderLeftIcon = () => {
    const icon = iconLeft || legacyIconLeft;
    if (!icon) return null;
    
    const { Component, name, size = 20, color = '#000', style } = icon;
    return <Component name={name} size={size} color={color} style={style} />;
  };

  // Render right icon if configured
  const renderRightIcon = () => {
    const icon = iconRight || legacyIconRight;
    if (!icon) return null;
    
    const { Component, name, size = 20, color = '#000', style } = icon;
    return <Component name={name} size={size} color={color} style={style} />;
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        legacyContainerStyle,
        containerStyle,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      accessible={true}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      testID={testID}
      {...pressableProps}
    >
      {renderLeftIcon()}
      <Text style={[styles.text, legacyTextStyle, textStyle, disabled && styles.disabledText]}>
        {title}
      </Text>
      {renderRightIcon()}
    </Pressable>
  );
});

CustomeButton.displayName = 'CustomeButton';

export default CustomeButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.8,
  },
});
