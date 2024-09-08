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
}) => {
  return (
    <View style={[styles.containerStyles, inputContainerStyles]}>
      <View
        style={[
          {
            marginHorizontal: marginHorizontal,
            height: height,
            width: width,
            borderRadius: borderRadius,
            flexDirection: 'row',
            alignItems: 'center',
          },
          customStyles,
        ]}>
        {iconLeft && IconLeftComponent}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          maxLength={maxLength}
          onChangeText={onChangeText}
          style={[textArea ? styles.textArea : styles.textInput, inputStyles]}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          editable={editable}
          textAlignVertical={textAlignVertical}
          multiline={multiline}
          numberOfLines={numberOfLines}
          scrollEnabled={false}
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
  containerStyles: {width: '100%',alignItems:'center'},
  textInput: {
    flex: 1,
    fontSize: scale(14),
    paddingLeft: scale(10),
    fontFamily: Font.regular,
  },
  viewError: {
    marginTop: verticalScale(3),
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
    borderRadius: scale(8),
    fontSize: scale(14),
    paddingHorizontal: scale(12),
    paddingTop: verticalScale(10),
    paddingBottom: scale(10),
    textAlignVertical: 'top',
  },
});
