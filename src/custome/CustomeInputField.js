import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Color from '../component/Color';
import Font from '../component/Font';

const CustomeInputField = ({
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
  onBlur
}) => {
  return (
    <View style={[styles.containerStyles]}>
      <View
        style={[
          inputContainerStyles,
          {
            marginHorizontal: marginHorizontal ? marginHorizontal : 0,
            height: height ? height : verticalScale(45),
            width: width ? width : '100%',
            borderRadius: borderRadius ? borderRadius : moderateScale(8),
            backgroundColor: backgroundColor || Color.White,
            flexDirection: 'row',
            alignItems: 'center',
          },
          customStyles,
        ]}>
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
};

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
    color:Color.Black,
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
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    textAlignVertical: 'top',
  },
});
