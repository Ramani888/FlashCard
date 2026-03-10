import React, {useState, memo, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
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
import {LANGUAGES} from '../../component/auth/LanguageModalContent';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Divider} from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {sanitizeEmail, sanitizeString} from '../../utils/sanitization';
import logger from '../../utils/logger';

const SignUpScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const colorTheme = useTheme();
  const {showLoader, hideLoader} = useLoader();
  const [isChecked, setIsChecked] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [languageKey, setLanguageKey] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState({
    id: 0,
    name: 'English',
    flag: require('../../Assets/FlagImage/UsaFlag.png'),
    code: 'en',
  });

  const refLangSheet = useRef();
  const {height} = Dimensions.get('window');

  // Memoize validation schema — re-created when language changes so error messages update
  const validationSchema = useMemo(() => Yup.object().shape({
    email: Yup.string()
      .email(strings.invalidEmail)
      .required(strings.emailRequired),
    password: Yup.string()
      .min(8, strings.passwordError)
      .required(strings.passwordRequired),
  }), [languageKey]);

  const handleLanguageSaved = useCallback(async (Language) => {
    await AsyncStorage.setItem('Language', JSON.stringify(Language));
    if (Language?.code) {
      strings.setLanguage(Language.code);
      setLanguageKey(k => k + 1); // force re-render so all strings update
    }
  }, []);

  const handleLangSelect = useCallback((item) => {
    setSelectedLanguage(item);
    handleLanguageSaved(item);
    refLangSheet.current.close();
  }, [handleLanguageSaved]);

  useEffect(() => {
    (async () => {
      const lang = await AsyncStorage.getItem('Language');
      if (lang) {
        const saved = JSON.parse(lang);
        const match = LANGUAGES.find(item => item.id === saved?.id);
        if (match) {
          setSelectedLanguage(match);
          strings.setLanguage(match.code);
          setLanguageKey(k => k + 1);
        }
      }
    })();
  }, []); // run once on mount only — isFocused causes a race with async handleLanguageSaved

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

  const openLangSheet = useCallback(() => {
    refLangSheet.current.open();
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
              style={styles.languageButton}
              onPress={openLangSheet}>
              <Image source={selectedLanguage?.flag} style={styles.flagImage} />
              <Text style={styles.language}>{selectedLanguage?.name}</Text>
              <AntDesign
                name="caretdown"
                size={scale(17)}
                color={Color.Black}
              />
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

      <RBSheet
        ref={refLangSheet}
        height={height * 0.75}
        openDuration={250}
        draggable={true}
        customStyles={{
          container: styles.langSheetContainer,
          draggableIcon: styles.langSheetDragIcon,
        }}>
        <Text style={styles.langSheetTitle}>{strings.selectLanguage}</Text>
        <FlatList
          data={LANGUAGES}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          extraData={selectedLanguage}
          contentContainerStyle={styles.langSheetList}
          renderItem={({item}) => {
            const isSelected = selectedLanguage?.id === item.id;
            return (
              <>
                <Pressable
                  onPress={() => handleLangSelect(item)}
                  style={styles.langRow}>
                  <View style={styles.langFlagWrapper}>
                    <Image source={item.flag} style={styles.langFlag} />
                  </View>
                  <View style={styles.langTextWrapper}>
                    <Text style={styles.langNameBold}>
                      {item.name}
                      <Text style={styles.langNameLight}>
                        {' – '}{item.englishName}
                      </Text>
                    </Text>
                  </View>
                  {isSelected ? (
                    <AntDesign name="checkcircle" size={scale(22)} color={Color.Green} />
                  ) : (
                    <View style={styles.langRadio} />
                  )}
                </Pressable>
                <Divider />
              </>
            );
          }}
        />
      </RBSheet>
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
  langSheetContainer: {
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    paddingHorizontal: scale(16),
  },
  langSheetDragIcon: {
    marginTop: verticalScale(10),
  },
  langSheetTitle: {
    fontSize: scale(16),
    fontFamily: Font.semiBold,
    textAlign: 'center',
    marginVertical: verticalScale(12),
    color: Color.Black,
  },
  langSheetList: {
    paddingBottom: verticalScale(20),
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(4),
  },
  langFlagWrapper: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    overflow: 'hidden',
    marginRight: scale(12),
    backgroundColor: '#f0f0f0',
  },
  langFlag: {
    width: scale(44),
    height: scale(44),
  },
  langTextWrapper: {
    flex: 1,
  },
  langNameBold: {
    fontSize: scale(14),
    fontFamily: Font.semiBold,
    color: Color.Black,
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  langNameLight: {
    fontSize: scale(13),
    fontFamily: Font.regular,
    color: Color.mediumGray,
  },
  langRadio: {
    width: scale(22),
    height: scale(22),
    borderWidth: scale(1.5),
    borderColor: '#ccc',
    borderRadius: scale(11),
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
