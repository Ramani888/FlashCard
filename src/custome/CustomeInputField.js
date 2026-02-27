import {View, Text, TextInput, StyleSheet} from 'react-native';
import React, {memo, useMemo, forwardRef} from 'react';
import PropTypes from 'prop-types';
import {scale, verticalScale, moderateScale} from './Responsive';
import Color from '../component/Color';
import Font from '../component/Font';

const CustomeInputField = memo(
  forwardRef(
    (
      {
        placeholder = '',
        value = '',
        maxLength,
        onChangeText,
        secureTextEntry = false,
        editable = true,
        keyboardType = 'default',
        touched = false,
        errors = '',
        borderRadius = moderateScale(8),
        backgroundColor = Color.White,
        width = '100%',
        height = verticalScale(45),
        placeholderTextColor = Color.Gray,
        marginHorizontal = 0,
        iconLeft = false,
        IconLeftComponent = null,
        iconRight = false,
        IconRightComponent = null,
        textArea = false,
        textAlignVertical = 'center',
        multiline = false,
        numberOfLines,
        customStyles,
        errorTextStyles,
        inputStyles,
        inputContainerStyles,
        errorContainerStyle,
        onBlur,
        autoCapitalize = 'sentences',
        autoCorrect = true,
        returnKeyType,
        onSubmitEditing,
        testID,
      },
      ref,
    ) => {
      // Memoize container style to prevent inline object recreation
      const containerDynamicStyle = useMemo(
        () => ({
          marginHorizontal,
          height,
          width,
          borderRadius,
          backgroundColor,
          flexDirection: 'row',
          alignItems: 'center',
        }),
        [marginHorizontal, height, width, borderRadius, backgroundColor],
      );

      // Memoize error display to prevent unnecessary re-renders
      const errorDisplay = useMemo(() => {
        if (!errors || !touched) return null;
        return (
          <View style={[styles.viewError, errorContainerStyle]}>
            <Text style={[styles.textError, errorTextStyles]}>{errors}</Text>
          </View>
        );
      }, [errors, touched, errorContainerStyle, errorTextStyles]);

      // Memoize input style based on textArea prop
      const computedInputStyle = useMemo(
        () => [textArea ? styles.textArea : styles.textInput, inputStyles],
        [textArea, inputStyles],
      );

      return (
        <View style={styles.containerStyles}>
          <View
            style={[inputContainerStyles, containerDynamicStyle, customStyles]}>
            {iconLeft && IconLeftComponent}
            <TextInput
              ref={ref}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor}
              value={value}
              maxLength={maxLength}
              onChangeText={onChangeText}
              style={computedInputStyle}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              editable={editable}
              textAlignVertical={textAlignVertical}
              multiline={multiline}
              numberOfLines={numberOfLines}
              scrollEnabled={false}
              onBlur={onBlur}
              autoCapitalize={autoCapitalize}
              autoCorrect={autoCorrect}
              returnKeyType={returnKeyType}
              onSubmitEditing={onSubmitEditing}
              testID={testID}
              accessible={true}
              accessibilityLabel={placeholder}
              accessibilityHint={errors && touched ? errors : undefined}
              accessibilityState={{disabled: !editable}}
            />
            {iconRight && IconRightComponent}
          </View>
          {errorDisplay}
        </View>
      );
    },
  ),
);

CustomeInputField.displayName = 'CustomeInputField';

CustomeInputField.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  maxLength: PropTypes.number,
  onChangeText: PropTypes.func,
  secureTextEntry: PropTypes.bool,
  editable: PropTypes.bool,
  keyboardType: PropTypes.oneOf([
    'default',
    'number-pad',
    'decimal-pad',
    'numeric',
    'email-address',
    'phone-pad',
    'url',
  ]),
  touched: PropTypes.bool,
  errors: PropTypes.string,
  borderRadius: PropTypes.number,
  backgroundColor: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholderTextColor: PropTypes.string,
  marginHorizontal: PropTypes.number,
  iconLeft: PropTypes.bool,
  IconLeftComponent: PropTypes.element,
  iconRight: PropTypes.bool,
  IconRightComponent: PropTypes.element,
  textArea: PropTypes.bool,
  textAlignVertical: PropTypes.oneOf(['auto', 'top', 'bottom', 'center']),
  multiline: PropTypes.bool,
  numberOfLines: PropTypes.number,
  customStyles: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  errorTextStyles: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyles: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputContainerStyles: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  errorContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onBlur: PropTypes.func,
  autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
  autoCorrect: PropTypes.bool,
  returnKeyType: PropTypes.string,
  onSubmitEditing: PropTypes.func,
  testID: PropTypes.string,
};

export default CustomeInputField;

// Styles are created once and reused for all instances
const styles = StyleSheet.create({
  containerStyles: {
    width: '100%',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: scale(14),
    paddingLeft: scale(10),
    fontFamily: Font.regular,
    color: Color.Black,
    paddingVertical: verticalScale(0), // Prevents inconsistent padding on different platforms
  },
  viewError: {
    marginTop: verticalScale(3),
    alignSelf: 'flex-start',
    paddingHorizontal: scale(10),
  },
  textError: {
    fontSize: moderateScale(10),
    color: Color.Red,
    fontFamily: Font.regular,
  },
  textArea: {
    flex: 1,
    color: Color.Black,
    fontSize: scale(14),
    paddingHorizontal: scale(12),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    textAlignVertical: 'top',
    fontFamily: Font.regular,
    alignSelf: 'flex-start'
  },
});
