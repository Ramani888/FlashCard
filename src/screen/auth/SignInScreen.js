import React, {useState, memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Color from '../../component/Color';
import Font from '../../component/Font';
import {scale, verticalScale, moderateScale} from '../../custome/Responsive';
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
import useTheme from '../../component/Theme';
import strings from '../../language/strings';

const SignInScreen = () => {
  const navigation = useNavigation();
  const themeColor = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  // ===================================== Api =================================== //

  const loginUser = async (email, password) => {
    const rawData = {
      email: email,
      password: password,
    };
    try {
      setVisible(true);
      const response = await apiPost(Api.signIn, '', JSON.stringify(rawData));
      if (response?.success === true) {
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
      const parseUserData = JSON.parse(userData);
      global.user = parseUserData;
      global.token = parseUserData?.token;
      navigation.reset({
        index: 0,
        routes: [
          {
            name: ScreenName.home,
          },
        ],
      });
    } catch (error) {
      console.log('error in logged in', error);
    } finally {
      setVisible(false);
    }
  };

  // ===================================== Api =================================== //

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const handleSignUp = () => {
    navigation.navigate(ScreenName.signUp);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(strings.invalidEmail)
      .required(strings.emailRequired),
    password: Yup.string()
      .min(8, strings.passwordError)
      .required(strings.passwordRequired),
  });

  return (
    <View style={[styles.container, {backgroundColor: themeColor.background1}]}>
      <Loader visible={visible} />
      <Text style={[styles.title, {color: themeColor.textColor}]}>
        {strings.signIn}
      </Text>
      <Text style={[styles.subtitle, {color: themeColor.textColor}]}>
        {strings.welcomMessage}
      </Text>
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
            <CustomeInputField
              key={'email'}
              placeholder={strings.enterEmail}
              placeholderTextColor={Color.mediumGray}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values?.email}
              errors={errors?.email}
              touched={touched?.email}
              iconLeft={true}
              keyboardType={'email-address'}
              inputStyles={styles.inputStyles}
              IconLeftComponent={
                <View style={styles.iconWrapper}>
                  <MaterialCommunityIcons
                    name={'email-outline'}
                    size={moderateScale(17)}
                    color={Color.Gray}
                  />
                </View>
              }
              inputContainerStyles={styles.inputContainer}
            />

            <CustomeInputField
              key={'password'}
              placeholder={strings.enterPassword}
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
              <Text
                style={[styles.forgotPassText, {color: themeColor.textColor}]}>
                {strings.forgotPassword}
              </Text>
            </Pressable>

            <CustomeButton
              title={strings.signIn}
              buttonWidth={'100%'}
              buttonHeight={verticalScale(45)}
              buttonColor={Color.theme1}
              fontSize={moderateScale(15)}
              fontFamily={Font.semiBold}
              fontColor={Color.White}
              borderRadius={moderateScale(10)}
              marginTop={verticalScale(10)}
              textTransform={'uppercase'}
              onPress={handleSubmit}
            />

            <CustomeButton
              title={strings.signUp}
              buttonWidth={'100%'}
              buttonHeight={verticalScale(45)}
              buttonColor={'#9F9F9F33'}
              fontSize={moderateScale(15)}
              fontFamily={Font.semiBold}
              fontColor={Color.theme1}
              borderRadius={moderateScale(10)}
              marginTop={verticalScale(20)}
              textTransform={'uppercase'}
              onPress={handleSignUp}
            />
          </View>
        )}
      </Formik>
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
    fontSize: scale(22),
    color: Color.Black,
    fontFamily: Font.semiBold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scale(14),
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
    fontSize: scale(14),
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
    fontSize: scale(12),
    color: Color.Black,
    fontFamily: Font.medium,
    textDecorationLine: 'underline',
  },
  errorMessage: {
    fontSize: scale(13),
    fontFamily: Font.medium,
    color: Color.Red,
    textAlign: 'center',
  },
});
