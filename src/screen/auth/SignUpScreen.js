import React, {useState, memo, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Color from '../../component/Color';
import Font from '../../component/Font';
import {scale, verticalScale, moderateScale} from '../../custome/Responsive';
import CustomeInputField from '../../custome/CustomeInputField';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomeButton from '../../custome/CustomeButton';
import {CheckBox} from '@rneui/themed';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {ScreenName} from '../../component/Screen';
import {apiPost} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import {useLoader} from '../../context';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';
import CustomeModal from '../../custome/CustomeModal';
import LanguageModalContent from '../../component/auth/LanguageModalContent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {sanitizeEmail, sanitizeString} from '../../utils/sanitization';
import logger from '../../utils/logger';

// Language mapping utility
const LANGUAGE_CODE_MAP = {
  'English': 'en',
  'Español': 'es',
  'Português': 'pt',
  'Français': 'fr',
  'Italiano': 'it',
  'Deutsch': 'de',
  'Polski': 'pl',
  '普通话': 'zh',
  'Kiswahili': 'sw',
  'Tagalog': 'tl',
  'हिंदी': 'hi',
};

const SignUpScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const colorTheme = useTheme();
  const {showLoader, hideLoader} = useLoader();
  const [languageModal, setLanguageModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [selectedLanguage, setSelectedLanguage] = useState({
    id: 0,
    name: 'English',
    flag: require('../../Assets/FlagImage/UsaFlag.png'),
    code: 'en',
  });

  const languageRef = useRef();

  // Memoize validation schema
  const validationSchema = useMemo(() => Yup.object().shape({
    email: Yup.string()
      .email(strings.invalidEmail)
      .required(strings.emailRequired),
    password: Yup.string()
      .min(8, strings.passwordError)
      .required(strings.passwordRequired),
  }), []);

  const handleLanguageSaved = useCallback(async (Language) => {
    await AsyncStorage.setItem('Language', JSON.stringify(Language));
    const languageCode = LANGUAGE_CODE_MAP[Language?.name];
    if (languageCode) {
      strings.setLanguage(languageCode);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const lang = await AsyncStorage.getItem('Language');
      if (lang) {
        setSelectedLanguage(JSON.parse(lang));
      }
    })();
  }, [isFocused]);

  // ======================================== Api ===================================== //

  const signUp = useCallback(async (value) => {
    try {
      showLoader();
      // Sanitize inputs before sending to API
      const sanitizedValue = {
        ...value,
        email: sanitizeEmail(value.email),
        password: sanitizeString(value.password),
      };
      const response = await apiPost(Api.signUp, '', JSON.stringify(sanitizedValue));
      if (response?.success === true) {
        navigation?.navigate(ScreenName.otpVerify, {email: sanitizedValue.email});
      } else {
        showMessageonTheScreen(response?.message);
      }
    } catch (error) {
      logger.error('error in signUp api', error);
    } finally {
      hideLoader();
    }
  }, [navigation, showLoader, hideLoader]);

  // ======================================== End ===================================== //

  const togglePasswordVisibility = useCallback(() =>
    setIsPasswordVisible(prev => !prev), []);

  const handleSignIn = useCallback(() => {
    navigation.navigate(ScreenName.signIn);
  }, [navigation]);

  const handleCheckboxToggle = useCallback(() => {
    setIsChecked(prev => !prev);
  }, []);

  const openModal = useCallback(() => {
    languageRef.current.measureInWindow((x, y, width, height) => {
      setModalPosition({x: x, y: y + verticalScale(55)});
      setLanguageModal(true);
    });
  }, []);

  const closeModal = useCallback(() => {
    setLanguageModal(false);
  }, []);

  const handleTermsPress = useCallback(() => {
    navigation.navigate(ScreenName.privacy, {tab: 'terms'});
  }, [navigation]);

  const handlePrivacyPress = useCallback(() => {
    navigation.navigate(ScreenName.privacy, {tab: 'privacy'});
  }, [navigation]);

  // Memoize icon components
  const emailIcon = useMemo(() => (
    <View style={styles.iconWrapper}>
      <MaterialCommunityIcons
        name="email-outline"
        size={scale(17)}
        color={Color.Gray}
      />
    </View>
  ), []);

  const keyIcon = useMemo(() => (
    <View style={styles.iconWrapper}>
      <MaterialCommunityIcons
        name="key-outline"
        size={scale(17)}
        color={Color.Gray}
      />
    </View>
  ), []);

  const eyeIcon = useMemo(() => (
    <Pressable style={styles.iconWrapper} onPress={togglePasswordVisibility}>
      <MaterialCommunityIcons
        name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
        size={scale(17)}
        color={Color.Gray}
      />
    </Pressable>
  ), [isPasswordVisible, togglePasswordVisibility]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {backgroundColor: colorTheme.background1},
      ]}
      showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, {color: colorTheme.textColor}]}>
        {strings.signUp}
      </Text>
      <Text style={styles.subtitle}>{strings.welcomMessage}</Text>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          values.isPrivacy = isChecked;
          if (isChecked) {
            signUp(values);
          }
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
            <Pressable
              ref={languageRef}
              style={styles.languageButton}
              onPress={openModal}>
              <Image source={selectedLanguage?.flag} style={styles.flagImage} />
              <Text style={styles.language}>{selectedLanguage?.name}</Text>
              {languageModal ? (
                <AntDesign
                  name="caretup"
                  size={scale(17)}
                  color={Color.Black}
                />
              ) : (
                <AntDesign
                  name="caretdown"
                  size={scale(17)}
                  color={Color.Black}
                />
              )}
            </Pressable>

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
              errorTextStyles={styles.errorText}
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
              errorTextStyles={styles.errorText}
              IconLeftComponent={keyIcon}
              iconRight={true}
              IconRightComponent={eyeIcon}
              inputContainerStyles={styles.inputContainer}
            />

            <View style={styles.checkboxContainer}>
              <CheckBox
                checked={isChecked}
                onPress={handleCheckboxToggle}
                iconType="material-community"
                checkedIcon="checkbox-marked"
                uncheckedIcon="checkbox-blank-outline"
                checkedColor={Color.theme1}
                containerStyle={styles.checkBox}
              />
              <Text style={styles.agreementText}>
                {strings.termConditionMessage1}{' '}
                <Text
                  style={[styles.linkText, {color: colorTheme.textColor}]}
                  onPress={handleTermsPress}>
                  {strings.termConditionMessage2}
                </Text>{' '}
                {strings.and}{' '}
                <Text
                  style={[styles.linkText, {color: colorTheme.textColor}]}
                  onPress={handlePrivacyPress}>
                  {strings.privacyPolicy}
                </Text>
              </Text>
            </View>

            <CustomeButton
              title={strings.signUp}
              buttonWidth={'100%'}
              buttonHeight={verticalScale(45)}
              buttonColor={isChecked ? Color.theme1 : Color.mediumGray}
              fontSize={scale(15)}
              fontFamily={Font.semiBold}
              fontColor={Color.White}
              borderRadius={scale(10)}
              marginTop={verticalScale(15)}
              textTransform={'uppercase'}
              disabled={!isChecked}
              onPress={() => {
                if (isChecked) {
                  handleSubmit();
                }
              }}
            />

            <CustomeButton
              title={strings.signIn}
              buttonWidth={'100%'}
              buttonHeight={verticalScale(45)}
              buttonColor={'#9F9F9F33'}
              fontSize={scale(15)}
              fontFamily={Font.semiBold}
              fontColor={Color.theme1}
              borderRadius={scale(10)}
              marginTop={verticalScale(20)}
              textTransform={'uppercase'}
              onPress={handleSignIn}
            />
          </View>
        )}
      </Formik>

      <CustomeModal
        visible={languageModal}
        onClose={closeModal}
        closeModal={false}
        mainPadding={scale(5)}
        backgroundColor={colorTheme.modelBackground}
        content={
          <LanguageModalContent
            setSelectedLanguage={setSelectedLanguage}
            selectedLanguage={selectedLanguage}
            closeModal={closeModal}
            handleLanguageSaved={handleLanguageSaved}
          />
        }
        width={'90%'}
        height={'63.5%'}
        justifyContent="flex-end"
        borderRadius={20}
        modalContainerStyle={[
          styles.modal,
          {backgroundColor: colorTheme.modelBackgroundView},
          {top: modalPosition.y, left: modalPosition.x},
        ]}
      />
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
    backgroundColor: Color.WhiteDefault,
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
    alignItems: 'flex-start',
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
  modal: {
    position: 'absolute',
    borderRadius: scale(10),
    elevation: scale(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: scale(0.3),
    shadowRadius: scale(4),
  },
  languageButton: {
    backgroundColor: Color.White,
    borderRadius: scale(9),
    paddingVertical: verticalScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: scale(1),
    borderColor: Color.LightGray,
  },
  flagImage: {width: scale(48), height: scale(32), marginLeft: scale(10)},
  language: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.semiBold,
    textTransform: 'uppercase',
    paddingLeft: scale(10),
    width: '73%',
  },
});
