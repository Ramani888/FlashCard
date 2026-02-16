import {View, Text, TextInput, StyleSheet} from 'react-native';
import React, {memo, useMemo} from 'react';
import {scale, verticalScale, moderateScale} from './Responsive';
import Color from '../component/Color';
import Font from '../component/Font';

const CustomeInputField = memo(({
  placeholder,
  value,
  maxLength,
  onChangeText,
  secureTextEntry,
  editable,
  keyboardType,
  touched,
  errors,
  borderRadius,
  backgroundColor,
  width,
  height,
  placeholderTextColor,
  marginLeft,
  marginHorizontal,
  iconLeft,
  IconLeftComponent,
  iconRight,
  IconRightComponent,
  textArea,
  textAlignVertical,
  multiline,
  numberOfLines,
  customStyles,
  errorTextStyles,
  inputStyles,
  inputContainerStyles,
  errorContainerStyle,
  onBlur,
}) => {
  // Memoize container style to prevent inline object recreation
  const containerDynamicStyle = useMemo(() => ({
    marginHorizontal: marginHorizontal || 0,
    height: height || verticalScale(45),
    width: width || '100%',
    borderRadius: borderRadius || moderateScale(8),
    backgroundColor: backgroundColor || Color.White,
    flexDirection: 'row',
    alignItems: 'center',
  }), [marginHorizontal, height, width, borderRadius, backgroundColor]);

  return (
    <View style={styles.containerStyles}>
      <View style={[inputContainerStyles, containerDynamicStyle, customStyles]}>
        {iconLeft && IconLeftComponent}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor || Color.Gray}
          value={value}
          maxLength={maxLength}
          onChangeText={onChangeText}
          style={[textArea ? styles.textArea : styles.textInput, inputStyles]}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          editable={editable}
          textAlignVertical={textAlignVertical || 'center'}
          multiline={multiline}
          numberOfLines={numberOfLines}
          scrollEnabled={false}
          onBlur={onBlur}
        />
        {iconRight && IconRightComponent}
      </View>
      {errors && touched && (
        <View style={[styles.viewError, errorContainerStyle]}>
          <Text style={[styles.textError, errorTextStyles]}>{errors}</Text>
        </View>
      )}
    </View>
  );
});

CustomeInputField.displayName = 'CustomeInputField';

export default CustomeInputField;

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
    // backgroundColor:'red',
  },
  viewError: {
    marginTop: verticalScale(3),
    alignSelf: 'flex-start',
  },
  textError: {
    fontSize: moderateScale(10),
    color: Color.Red,
    fontFamily: Font.regular,
  },
  textArea: {
    flex: 1,
    color: Color.Black,
    borderColor: 'gray',
    borderRadius: moderateScale(8),
    fontSize: scale(14),
    paddingHorizontal: scale(12),
    paddingBottom: verticalScale(10),
    textAlignVertical: 'top',
  },
});
