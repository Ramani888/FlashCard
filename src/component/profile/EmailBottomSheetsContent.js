import React, {useCallback, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomeInputField from '../../custome/CustomeInputField';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../component/Color';
import CustomeButton from '../../custome/CustomeButton';
import Font from '../Font';
import AntDesign from 'react-native-vector-icons/AntDesign';
import OTPTextInput from 'react-native-otp-textinput';
import showMessageonTheScreen from '../ShowMessageOnTheScreen';

const EmailBottomSheetsContent = ({closeEmailBottomSheet}) => {
  const [isValid, setIsValid] = useState(true);
  const [otp, setOtp] = useState('');

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const handleSubmit = useCallback(
    (values, {resetForm}) => {
      console.log('values', values);
      resetForm();
    },
    [closeEmailBottomSheet],
  );

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
        showMessageonTheScreen('Please Enter the Email');
      }
    } else {
      showMessageonTheScreen('Invalid OTP, please check your input.');
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeButton} onPress={handlePressClose}>
        <AntDesign name="close" size={scale(15)} color={Color.Black} />
      </Pressable>
      <Text style={styles.title}>ENTER EMAIL</Text>

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
              placeholder="Enter Email"
              placeholderTextColor={Color.mediumGray}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              borderWidth={0.7}
              borderColor={Color.LightGray}
              height={verticalScale(45)}
              marginTop={verticalScale(10)}
              width="100%"
              errors={errors.email}
              touched={touched.email}
            />
            <CustomeButton
              buttonColor={Color.theme1}
              buttonWidth="100%"
              buttonHeight={scale(45)}
              title="Send Verification Code"
              borderRadius={scale(10)}
              fontSize={scale(15)}
              fontColor={Color.White}
              fontFamily={Font.semiBold}
              marginTop={verticalScale(15)}
              marginBottom={verticalScale(50)}
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
                buttonHeight={scale(45)}
                title="VERIFY"
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
  },
  separator: {
    borderBottomWidth: scale(0.7),
    borderBottomColor: Color.LightGray,
  },
  otpContainer: {
    marginBottom: verticalScale(5),
    // marginLeft: scale(-5.5),
  },
  otpInput: {
    width: scale(71),
    height: scale(67),
    borderWidth: scale(1),
    borderBottomWidth: scale(1),
    borderRadius: scale(10),
    fontFamily: Font.regular,
  },
});
