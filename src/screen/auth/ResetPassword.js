import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Linking,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Color from '../../component/Color';
import Font from '../../component/Font';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import CustomeInputField from '../../custome/CustomeInputField';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomeButton from '../../custome/CustomeButton';
import {CheckBox} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../../component/Screen';
import {apiPost} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import Loader from '../../component/Loader';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';

const inputFields = [
  {
    name: 'email',
    placeholder: 'Enter Email',
    iconName: 'email-outline',
    keyboardType: 'email-address',
  },
];

const ResetPassword = () => {
  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const openLink = url => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const renderInputFields = (
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
  ) => {
    return inputFields.map(field => (
      <CustomeInputField
        key={field.name}
        placeholder={field.placeholder}
        placeholderTextColor={Color.mediumGray}
        onChangeText={handleChange(field.name)}
        onBlur={handleBlur(field.name)}
        value={values[field.name]}
        errors={errors[field.name]}
        touched={touched[field.name]}
        iconLeft={true}
        keyboardType={field.keyboardType || 'default'}
        inputStyles={styles.inputStyles}
        errorTextStyles={styles.errorText}
        IconLeftComponent={
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons
              name={field.iconName}
              size={scale(17)}
              color={Color.Gray}
            />
          </View>
        }
        inputContainerStyles={styles.inputContainer}
      />
    ));
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <Loader visible={visible} />
      <Text style={styles.title}>Resset Password</Text>
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          console.log('values', values);
          navigation?.navigate(ScreenName.otpVerify, {email: values.email});
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.formContainer}>
            {renderInputFields(
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
            )}

            <CustomeInputField
              key={'password'}
              placeholder={'New Password'}
              placeholderTextColor={Color.mediumGray}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              errors={errors.password}
              touched={touched.password}
              iconLeft={true}
              secureTextEntry={!isPasswordVisible}
              inputStyles={styles.inputStyles}
              errorTextStyles={styles.errorText}
              IconLeftComponent={
                <View style={styles.iconWrapper}>
                  <MaterialCommunityIcons
                    name={'key-outline'}
                    size={scale(17)}
                    color={Color.Gray}
                  />
                </View>
              }
              iconRight={true}
              IconRightComponent={
                <Pressable
                  style={styles.iconWrapper}
                  onPress={togglePasswordVisibility}>
                  <MaterialCommunityIcons
                    name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                    size={scale(17)}
                    color={Color.Gray}
                  />
                </Pressable>
              }
              inputContainerStyles={styles.inputContainer}
            />

            <CustomeInputField
              key={'confrim password'}
              placeholder={'Confirm New Password'}
              placeholderTextColor={Color.mediumGray}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              errors={errors.confirmPassword}
              touched={touched.confirmPassword}
              iconLeft={true}
              secureTextEntry={!isConfirmPasswordVisible}
              inputStyles={styles.inputStyles}
              errorTextStyles={styles.errorText}
              IconLeftComponent={
                <View style={styles.iconWrapper}>
                  <MaterialCommunityIcons
                    name={'key-outline'}
                    size={scale(17)}
                    color={Color.Gray}
                  />
                </View>
              }
              iconRight={true}
              IconRightComponent={
                <Pressable
                  style={styles.iconWrapper}
                  onPress={toggleConfirmPasswordVisibility}>
                  <MaterialCommunityIcons
                    name={
                      isConfirmPasswordVisible
                        ? 'eye-outline'
                        : 'eye-off-outline'
                    }
                    size={scale(17)}
                    color={Color.Gray}
                  />
                </Pressable>
              }
              inputContainerStyles={styles.inputContainer}
            />

            <CustomeButton
              title={'COFIRM'}
              buttonWidth={'100%'}
              buttonHeight={verticalScale(45)}
              buttonColor={Color.theme1}
              fontSize={scale(15)}
              fontFamily={Font.semiBold}
              fontColor={Color.White}
              borderRadius={scale(10)}
              marginTop={verticalScale(30)}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default React.memo(ResetPassword);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  title: {
    fontSize: scale(20),
    color: Color.Black,
    fontFamily: Font.semiBold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scale(13),
    color: Color.mediumGray,
    fontFamily: Font.regular,
    textAlign: 'center',
    marginTop: verticalScale(10),
  },
  formContainer: {
    width: '100%',
    marginTop: verticalScale(15),
  },
  inputContainer: {
    width: '100%',
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    paddingHorizontal: moderateScale(8),
    backgroundColor: Color.White,
    borderRadius: scale(10),
    marginTop: verticalScale(10),
    height: verticalScale(45),
  },
  inputStyles: {
    fontSize: scale(13),
    color: Color.Black,
    fontFamily: Font.regular,
    height: verticalScale(45),
  },
  iconWrapper: {
    backgroundColor: Color.WhiteDefault,
    padding: moderateScale(5),
    borderRadius: scale(5),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  agreementText: {
    fontSize: scale(12),
    color: Color.mediumGray,
    fontFamily: Font.regular,
    flexShrink: 1,
    lineHeight: verticalScale(20),
  },
  linkText: {
    fontSize: scale(12),
    color: Color.Black,
    fontFamily: Font.regular,
    textDecorationLine: 'underline',
  },
  checkBox: {
    backgroundColor: Color.transparent,
    padding: 0,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(20),
    alignSelf: 'center',
  },
  infoText: {
    fontSize: scale(13),
    color: Color.mediumGray,
    fontFamily: Font.regular,
    textAlign: 'center',
  },
  signUpText: {
    fontSize: scale(13),
    color: Color.theme1,
    fontFamily: Font.semiBold,
  },
  errorText: {
    fontSize: scale(12),
    color: Color.Red,
    fontFamily: Font.regular,
    marginTop: verticalScale(5),
  },
});
