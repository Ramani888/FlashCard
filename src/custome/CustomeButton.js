import {Text, StyleSheet, Pressable, Dimensions} from 'react-native';
import React, {memo, useMemo} from 'react';

const {height} = Dimensions.get('window');

const CustomeButton = memo(({
  title,
  buttonWidth,
  buttonHeight,
  buttonColor,
  fontSize,
  fontColor,
  onPress,
  fontFamily,
  textTransform,
  fontWeight,
  disabled,
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
  iconLeft,
  iconRight,
  IconComponentName,
  iconName,
  iconSize,
  iconColor,
  iconPaddingRight,
  iconPaddingLeft,
  elevation,
  alignSelf,
  position,
  top,
  bottom,
  left,
  right,
}) => {
  // Memoize button style to prevent inline object recreation on each render
  const buttonStyle = useMemo(() => ({
    backgroundColor: buttonColor,
    width: buttonWidth,
    height: buttonHeight || height * 0.06,
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
    borderWidth,
    borderColor,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    marginHorizontal,
    paddingHorizontal,
    marginVertical,
    paddingVertical,
    padding,
    elevation,
    alignSelf,
    position,
    top,
    bottom,
    left,
    right,
  }), [
    buttonColor, buttonWidth, buttonHeight, borderRadius,
    borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius,
    borderWidth, borderColor, marginTop, marginBottom, marginLeft, marginRight,
    marginHorizontal, paddingHorizontal, marginVertical, paddingVertical,
    padding, elevation, alignSelf, position, top, bottom, left, right,
  ]);

  // Memoize text style
  const textStyle = useMemo(() => ({
    fontSize,
    color: fontColor,
    fontFamily,
    fontWeight,
    textTransform,
  }), [fontSize, fontColor, fontFamily, fontWeight, textTransform]);

  // Memoize icon styles
  const leftIconStyle = useMemo(() => ({paddingRight: iconPaddingRight}), [iconPaddingRight]);
  const rightIconStyle = useMemo(() => ({paddingLeft: iconPaddingLeft}), [iconPaddingLeft]);

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.btnStyle, buttonStyle]}>
      {iconLeft && IconComponentName && (
        <IconComponentName
          name={iconName}
          size={iconSize}
          color={iconColor}
          style={leftIconStyle}
        />
      )}
      <Text style={[styles.btnText, textStyle]}>
        {title}
      </Text>
      {iconRight && IconComponentName && (
        <IconComponentName
          name={iconName}
          size={iconSize}
          color={iconColor}
          style={rightIconStyle}
        />
      )}
    </Pressable>
  );
});

CustomeButton.displayName = 'CustomeButton';

export default CustomeButton;

const styles = StyleSheet.create({
  btnStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    textAlign: 'center',
  },
});
