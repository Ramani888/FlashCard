import React, {useCallback, useState} from 'react';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomeInputField from '../../../custome/CustomeInputField';
import {scale, verticalScale} from '../../../custome/Responsive';
import Color from '../../Color';
import CustomeButton from '../../../custome/CustomeButton';
import Font from '../../Font';
import AntDesign from 'react-native-vector-icons/AntDesign';
import OTPTextInput from 'react-native-otp-textinput';
import showMessageonTheScreen from '../../ShowMessageOnTheScreen';
import strings from '../../../language/strings';

const {width, height} = Dimensions.get('window');

const EmailBottomSheetsContent = ({closeEmailBottomSheet}) => {
  const [isValid, setIsValid] = useState(true);
  const [otp, setOtp] = useState('');

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const handleSubmit = useCallback((values, {resetForm}) => {
    resetForm();
  }, []);

  const handlePressClose = useCallback(() => {
    closeEmailBottomSheet();
  }, [closeEmailBottomSheet]);

  const handleOtpChange = text => {
    setOtp(text);
    if (text.length === 4 && /^\d+$/.test(text)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const handleVerify = email => {
    if (isValid && otp.length === 4) {
      if (email) {
        closeEmailBottomSheet();
      } else {
        showMessageonTheScreen(strings.pleaseEnterEmail);
      }
    } else {
      showMessageonTheScreen(strings.invalidOtpMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeButton} onPress={handlePressClose}>
        <AntDesign name="close" size={scale(15)} color={Color.Black} />
      </Pressable>
      <Text style={styles.title}>{strings.enterEmail}</Text>

      <View style={styles.separator} />
      <Formik
        initialValues={{email: ''}}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.formContainer}>
            <CustomeInputField
              placeholder={strings.enterEmail}
              placeholderTextColor={Color.mediumGray}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              marginTop={verticalScale(10)}
              width="100%"
              errors={errors.email}
              touched={touched.email}
              inputStyles={styles.inputStyles}
              inputContainerStyles={styles.inputContainerStyle}
            />
            <CustomeButton
              buttonColor={Color.theme1}
              buttonWidth="100%"
              title={strings.sendVerificationCode}
              borderRadius={scale(10)}
              fontSize={scale(15)}
              fontColor={Color.White}
              fontFamily={Font.semiBold}
              marginTop={verticalScale(15)}
              marginBottom={height * 0.05}
              onPress={handleSubmit}
            />

            <View>
              <OTPTextInput
                handleTextChange={handleOtpChange}
                inputCount={4}
                containerStyle={styles.otpContainer}
                textInputStyle={styles.otpInput}
                tintColor={isValid ? Color.Black : Color.Green}
                offTintColor={Color.mediumGray}
              />
              <CustomeButton
                buttonColor={Color.theme1}
                buttonWidth="100%"
                title={strings.verify}
                borderRadius={scale(10)}
                fontSize={scale(15)}
                fontColor={Color.White}
                fontFamily={Font.semiBold}
                marginTop={verticalScale(15)}
                onPress={() => handleVerify(values?.email)}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default React.memo(EmailBottomSheetsContent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: verticalScale(10),
    paddingTop: verticalScale(2),
    marginHorizontal: scale(10),
  },
  formContainer: {
    marginTop: verticalScale(15),
  },
  inputContainerStyle: {
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    borderRadius: scale(10),
    backgroundColor: Color.White,
    height: verticalScale(45),
  },
  inputStyles: {
    fontSize: scale(13),
    color: Color.Black,
    fontFamily: Font.regular,
    height: verticalScale(45),
  },
  closeButton: {
    height: scale(26),
    width: scale(26),
    borderRadius: scale(13),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.WhiteDefault,
    position: 'absolute',
    top: verticalScale(-35),
    right: 0,
  },
  title: {
    fontSize: scale(20),
    color: Color.Black,
    fontFamily: Font.medium,
    textAlign: 'center',
    paddingBottom: verticalScale(10),
    textTransform: 'uppercase',
  },
  separator: {
    borderBottomWidth: scale(0.7),
    borderBottomColor: Color.LightGray,
  },
  otpContainer: {
    marginBottom: verticalScale(5),
  },
  otpInput: {
    width: width * 0.2,
    height: height * 0.1,
    borderWidth: scale(1),
    borderBottomWidth: scale(1),
    borderRadius: scale(10),
    fontFamily: Font.regular,
  },
});
