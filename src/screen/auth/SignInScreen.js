import React, {useState, memo, useEffect} from 'react';
import {Pressable, StyleSheet, Text, View, Linking} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Color from '../../component/Color';
import Font from '../../component/Font';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters'; // moderateScale for balanced scaling
import CustomeInputField from '../../custome/CustomeInputField';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomeButton from '../../custome/CustomeButton';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../../component/Screen';
import {apiPost} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import Loader from '../../component/Loader';

const inputFields = [
  {
    name: 'email',
    placeholder: 'Enter Email',
    iconName: 'email-outline',
    keyboardType: 'email-address',
  },
];

const SignInScreen = () => {
  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');

  // ===================================== Api =================================== //

  const loginUser = async (email, password) => {
    const rawData = {
      email: email,
      password: password,
    };
    try {
      setVisible(true);
      const response = await apiPost(Api.signIn, '', JSON.stringify(rawData));
      if (response?.success == true) {
        await AsyncStorage.setItem('user', JSON.stringify(response?.user));
        LoggedInUser();
        showMessageonTheScreen(response?.message);
      } else {
        showMessageonTheScreen(response?.message);
        setVisible(false);
      }
    } catch (error) {
      console.log('error in login api', error);
    } finally {
      setVisible(false);
    }
  };

  const LoggedInUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      global.user = JSON.parse(userData);
      navigation.navigate(ScreenName.home);
    } catch (error) {
      console.log('error in logged in', error);
    } finally {
      setVisible(false);
    }
  };

  // ===================================== Api =================================== //

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const openLink = url => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
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
        IconLeftComponent={
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons
              name={field.iconName}
              size={moderateScale(17)}
              color={Color.Gray}
            />
          </View>
        }
        inputContainerStyles={styles.inputContainer}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <Loader visible={visible} />
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Welcome 👋 Please enter your Account.</Text>
      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={validationSchema}
        onSubmit={values => {
          loginUser(values.email, values.password);
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
              IconLeftComponent={
                <View style={styles.iconWrapper}>
                  <MaterialCommunityIcons
                    name={'key-outline'}
                    size={moderateScale(17)}
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
                    size={moderateScale(17)}
                    color={Color.Gray}
                  />
                </Pressable>
              }
              inputContainerStyles={styles.inputContainer}
            />

            <Pressable
              style={styles.forgotPassBtn}
              onPress={() => navigation.navigate(ScreenName.resetPassword)}>
              <Text style={styles.forgotPassText}>Forgot Password?</Text>
            </Pressable>

            <CustomeButton
              title={'SIGN IN'}
              buttonWidth={'100%'}
              buttonHeight={verticalScale(45)}
              buttonColor={Color.theme1}
              fontSize={moderateScale(15)}
              fontFamily={Font.semiBold}
              fontColor={Color.White}
              borderRadius={moderateScale(10)}
              marginTop={verticalScale(10)}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>

      <View style={styles.signUpContainer}>
        <Text style={styles.infoText}>
          Don't have an account?{' '}
          <Text
            style={styles.signUpText}
            onPress={() => navigation.navigate(ScreenName.signUp)}>
            {' '}
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default memo(SignInScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  title: {
    fontSize: moderateScale(22),
    color: Color.Black,
    fontFamily: Font.semiBold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(14),
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
    paddingHorizontal: scale(10),
    backgroundColor: Color.White,
    borderRadius: moderateScale(10),
    marginTop: verticalScale(15),
    height: verticalScale(45),
  },
  inputStyles: {
    fontSize: moderateScale(14),
    height: verticalScale(45),
    color: Color.Black,
    fontFamily: Font.regular,
  },
  iconWrapper: {
    backgroundColor: Color.WhiteDefault,
    padding: scale(5),
    borderRadius: scale(5),
  },
  forgotPassBtn: {
    marginVertical: verticalScale(10),
    alignSelf: 'flex-end',
  },
  forgotPassText: {
    fontSize: moderateScale(13),
    fontFamily: Font.medium,
    color: Color.Black,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(20),
    alignSelf: 'center',
  },
  infoText: {
    fontSize: moderateScale(13),
    color: Color.mediumGray,
    fontFamily: Font.regular,
    width: '90%',
    lineHeight: verticalScale(20),
    textAlign: 'center',
  },
  signUpText: {
    fontSize: moderateScale(12),
    color: Color.Black,
    fontFamily: Font.medium,
    textDecorationLine: 'underline',
  },
  errorMessage: {
    fontSize: moderateScale(13),
    fontFamily: Font.medium,
    color: Color.Red,
    textAlign: 'center',
  },
});
