import React, {useState, memo, useCallback, useMemo} from 'react';
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
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import {useLoader} from '../../context';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';
import {useAppDispatch} from '../../redux/hooks';
import {setUser} from '../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../../config';

const SignInScreen = () => {
  const navigation = useNavigation();
  const themeColor = useTheme();
  const dispatch = useAppDispatch();
  const {showLoader, hideLoader} = useLoader();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Memoize validation schema to prevent recreation on every render
  const validationSchema = useMemo(() => Yup.object().shape({
    email: Yup.string()
      .email(strings.invalidEmail)
      .required(strings.emailRequired),
    password: Yup.string()
      .min(8, strings.passwordError)
      .required(strings.passwordRequired),
  }), []);

  // ===================================== Api =================================== //

  const loginUser = useCallback(async (email, password) => {
    const rawData = {email, password};
    try {
      showLoader();
      const response = await apiPost(Api.signIn, '', JSON.stringify(rawData));
      if (response?.success === true) {
        const userData = response?.user;
        await AsyncStorage.setItem(Config.STORAGE_KEYS.USER, JSON.stringify(userData));
        dispatch(setUser({user: userData, token: userData?.token}));
        showMessageonTheScreen(response?.message);
        navigation.reset({
          index: 0,
          routes: [{name: ScreenName.setAndFolder}],
        });
      } else {
        showMessageonTheScreen(response?.message);
      }
    } catch (error) {
      console.log('error in login api', error);
    } finally {
      hideLoader();
    }
  }, [dispatch, navigation, showLoader, hideLoader]);

  // ===================================== Api =================================== //

  const togglePasswordVisibility = useCallback(() =>
    setIsPasswordVisible(prev => !prev), []);

  const handleSignUp = useCallback(() => {
    navigation.navigate(ScreenName.signUp);
  }, [navigation]);

  const handleForgotPassword = useCallback(() => {
    navigation.navigate(ScreenName.resetPassword);
  }, [navigation]);

  // Memoize icon components to prevent recreation
  const emailIcon = useMemo(() => (
    <View style={styles.iconWrapper}>
      <MaterialCommunityIcons
        name="email-outline"
        size={moderateScale(17)}
        color={Color.Gray}
      />
    </View>
  ), []);

  const keyIcon = useMemo(() => (
    <View style={styles.iconWrapper}>
      <MaterialCommunityIcons
        name="key-outline"
        size={moderateScale(17)}
        color={Color.Gray}
      />
    </View>
  ), []);

  const eyeIcon = useMemo(() => (
    <Pressable style={styles.iconWrapper} onPress={togglePasswordVisibility}>
      <MaterialCommunityIcons
        name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
        size={moderateScale(17)}
        color={Color.Gray}
      />
    </Pressable>
  ), [isPasswordVisible, togglePasswordVisibility]);

  return (
    <View style={[styles.container, {backgroundColor: themeColor.background1}]}>
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
              placeholder={strings.enterEmail}
              placeholderTextColor={Color.mediumGray}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values?.email}
              errors={errors?.email}
              touched={touched?.email}
              iconLeft={true}
              keyboardType="email-address"
              inputStyles={styles.inputStyles}
              IconLeftComponent={emailIcon}
              inputContainerStyles={styles.inputContainer}
            />

            <CustomeInputField
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
              IconLeftComponent={keyIcon}
              iconRight={true}
              IconRightComponent={eyeIcon}
              inputContainerStyles={styles.inputContainer}
            />

            <Pressable
              style={styles.forgotPassBtn}
              onPress={handleForgotPassword}>
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
