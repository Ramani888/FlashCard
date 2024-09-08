import React, {useState, memo} from 'react';
import {Pressable, StyleSheet, Text, View, Linking, ScrollView} from 'react-native';
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
import { ScreenName } from '../../component/Screen';

const inputFields = [
  {
    name: 'email',
    placeholder: 'Enter Email',
    iconName: 'email-outline',
    keyboardType: 'email-address',
  },
  {
    name: 'userName',
    placeholder: 'Enter Username',
    iconName: 'account-outline',
  },
];

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const openLink = url => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    userName: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
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
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Welcome 👋 Please enter your Account.</Text>
      <Formik
        initialValues={{email: '', userName: '', password: ''}}
        validationSchema={validationSchema}
        onSubmit={values => {
          console.log('Form Values:', values);
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
              placeholder={'Enter password'}
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

            <View style={styles.checkboxContainer}>
              <CheckBox
                checked={isChecked}
                onPress={() => setIsChecked(!isChecked)}
                iconType="material-community"
                checkedIcon="checkbox-marked"
                uncheckedIcon="checkbox-blank-outline"
                checkedColor={Color.theme1}
                containerStyle={styles.checkBox}
              />
              <Text style={styles.agreementText}>
                You agree to{' '}
                <Text
                  style={styles.linkText}
                  onPress={() => openLink('https://example.com/terms')}>
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text
                  style={styles.linkText}
                  onPress={() => openLink('https://example.com/privacy')}>
                  Privacy Policy
                </Text>
              </Text>
            </View>

            <CustomeButton
              title={'SIGN UP'}
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

            <View style={styles.signUpContainer}>
              <Text style={styles.infoText}>
                You have already an account{' '}
                <Text
                  style={styles.signUpText}
                  onPress={() => navigation.navigate(ScreenName.signIn)}>
                  {' '}
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default memo(SignUpScreen);

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
