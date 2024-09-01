import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Color from '../component/Color';

const CustomeInputField = ({
  placeholder,
  value,
  maxLength,
  onChangeText,
  secureTextEntry = false,
  editable = true,
  keyboardType = 'default',
  touched = false,
  errors,
  borderWidth = scale(1),
  borderRadius = scale(8),
  borderColor = Color.Gray,
  MainWidth = '100%',
  backgroundColor = Color.White,
  width = '100%',
  height = verticalScale(50),
  placeholderTextColor = Color.Gray,
  marginTop = verticalScale(10),
  marginBottom = verticalScale(10),
  marginLeft = 0,
  marginHorizontal = 0,
  color = Color.Black,
  inputWidth = '100%',
  iconLeft,
  IconComponentName,
  iconName,
  iconSize = scale(20),
  iconColor = Color.Gray,
  iconRight,
  differentIconRight,
  IconRightComponentName,
  iconRightName,
  iconRightSize = scale(20),
  iconRightColor = Color.Gray,
  textArea = false,
  textAlignVertical = 'top',
  textAlign = 'left',
  multiline = false,
  numberOfLines = 5,
  onBlur,
  customStyles = {},
  errorTextStyles = {},
  inputStyles = {},
  containerStyles = {},
  errorContainerStyle,
}) => {
  return (
    <View
      style={[
        {
          width: MainWidth,
          marginTop: marginTop,
          marginBottom: marginBottom,
        },
        containerStyles,
      ]}>
      <View
        style={[
          {
            borderColor: errors && touched ? Color.Red : borderColor,
            borderWidth: errors && touched ? scale(1) : borderWidth,
            marginHorizontal: marginHorizontal,
            height: height,
            width: width,
            borderRadius: borderRadius,
            marginLeft: marginLeft,
            backgroundColor: backgroundColor,
            flexDirection: 'row',
            alignItems: 'center',
          },
          customStyles,
        ]}>
        {iconLeft && IconComponentName && (
          <IconComponentName
            name={iconName}
            size={iconSize}
            color={iconColor}
            style={{marginLeft: scale(10)}}
          />
        )}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          maxLength={maxLength}
          onChangeText={onChangeText}
          style={[
            textArea ? styles.textArea : styles.textInput,
            {
              color: color,
              width: inputWidth,
            },
            inputStyles,
          ]}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          editable={editable}
          textAlignVertical={textAlignVertical}
          textAlign={textAlign}
          multiline={multiline}
          numberOfLines={numberOfLines}
          scrollEnabled={false}
          onBlur={onBlur}
        />
        {iconRight && IconComponentName && (
          <IconComponentName
            name={iconName}
            size={iconSize}
            color={iconColor}
            style={{marginRight: scale(10)}}
          />
        )}
        {differentIconRight && IconRightComponentName && (
          <IconRightComponentName
            name={iconRightName}
            size={iconRightSize}
            color={iconRightColor}
            style={{marginRight: scale(10)}}
          />
        )}
      </View>
      {errors && touched && (
        <View style={[styles.viewError,errorContainerStyle]}>
          <Text style={[styles.textError, errorTextStyles]}>{errors}</Text>
        </View>
      )}
    </View>
  );
};

CustomeInputField.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  maxLength: PropTypes.number,
  onChangeText: PropTypes.func.isRequired,
  secureTextEntry: PropTypes.bool,
  editable: PropTypes.bool,
  keyboardType: PropTypes.string,
  touched: PropTypes.bool,
  errors: PropTypes.string,
  borderWidth: PropTypes.number,
  borderRadius: PropTypes.number,
  borderColor: PropTypes.string,
  MainWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  backgroundColor: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.number,
  placeholderTextColor: PropTypes.string,
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
  marginLeft: PropTypes.number,
  marginHorizontal: PropTypes.number,
  color: PropTypes.string,
  inputWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconLeft: PropTypes.bool,
  IconComponentName: PropTypes.elementType,
  iconName: PropTypes.string,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  iconRight: PropTypes.bool,
  differentIconRight: PropTypes.bool,
  IconRightComponentName: PropTypes.elementType,
  iconRightName: PropTypes.string,
  iconRightSize: PropTypes.number,
  iconRightColor: PropTypes.string,
  textArea: PropTypes.bool,
  textAlignVertical: PropTypes.string,
  textAlign: PropTypes.string,
  multiline: PropTypes.bool,
  numberOfLines: PropTypes.number,
  onBlur: PropTypes.func,
  customStyles: PropTypes.object,
  errorTextStyles: PropTypes.object,
  inputStyles: PropTypes.object,
  containerStyles: PropTypes.object,
  errorComponent: PropTypes.element,
};

CustomeInputField.defaultProps = {
  secureTextEntry: false,
  editable: true,
  keyboardType: 'default',
  touched: false,
  borderWidth: scale(1),
  borderRadius: scale(8),
  borderColor: Color.Gray,
  MainWidth: '100%',
  backgroundColor: Color.White,
  width: '100%',
  height: verticalScale(50),
  placeholderTextColor: Color.Gray,
  marginTop: verticalScale(10),
  marginBottom: verticalScale(10),
  marginLeft: 0,
  marginHorizontal: 0,
  color: Color.Black,
  inputWidth: '100%',
  iconSize: scale(20),
  iconColor: Color.Gray,
  iconRightSize: scale(20),
  iconRightColor: Color.Gray,
  textArea: false,
  textAlignVertical: 'top',
  textAlign: 'left',
  multiline: false,
  numberOfLines: 1,
};

export default CustomeInputField;

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    fontSize: scale(14),
    paddingLeft: scale(10),
    fontFamily: 'Montserrat-Regular',
  },
  viewError: {
    position: 'absolute',
    bottom: verticalScale(-16),
    marginVertical: verticalScale(2),
  },
  textError: {
    fontSize: moderateScale(10),
    color: Color.Red,
    paddingLeft: scale(5),
    fontFamily: 'Montserrat-Regular',
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
