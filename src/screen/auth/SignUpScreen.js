import React, {useState, memo, useRef} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Linking,
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
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../../component/Screen';
import {apiPost} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import Loader from '../../component/Loader';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';
import CustomeModal from '../../custome/CustomeModal';
import LanguageModalContent from '../../component/auth/LanguageModalContent';
import AntDesign from 'react-native-vector-icons/AntDesign';

const inputFields = [
  {
    name: 'email',
    placeholder: strings.enterEmail,
    iconName: 'email-outline',
    keyboardType: 'email-address',
  },
  {
    name: 'userName',
    placeholder: strings.enterUsername,
    iconName: 'account-outline',
  },
];

const SignUpScreen = () => {
  const navigation = useNavigation();
  const colorTheme = useTheme();
  const [visible, setVisible] = useState(false);
  const [languageModal, setLanguageModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [selectedLanguage, setSelectedLanguage] = useState({
    id: 0,
    name: 'English',
    flag: require('../../Assets/FlagImage/UsaFlag.png'),
  });
  const languageRef = useRef();

  // ======================================== Api ===================================== //

  const signUp = async value => {
    console.log('value', value);
    try {
      setVisible(true);
      const response = await apiPost(Api.signUp, '', JSON.stringify(value));
      if (response?.success == true) {
        navigation?.navigate(ScreenName.otpVerify, {email: value.email});
      } else {
        showMessageonTheScreen(response?.message);
      }
    } catch (error) {
      console.log('error in signUp api', error);
    } finally {
      setVisible(false);
    }
  };

  // ======================================== End ===================================== //

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const handleSignIn = () => {
    navigation.navigate(ScreenName.signIn);
  };

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

  const openModal = (item, isLastItem) => {
    languageRef.current.measureInWindow((x, y, width, height) => {
      setModalPosition({x: x, y: y + verticalScale(55)});
      setLanguageModal(true);
    });
  };

  const closeModal = () => {
    setLanguageModal(false);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {backgroundColor: colorTheme.background},
      ]}
      showsVerticalScrollIndicator={false}>
      <Loader visible={visible} />
      <Text style={[styles.title, {color: colorTheme.textColor}]}>
        {strings.signUp}
      </Text>
      <Text style={styles.subtitle}>{strings.welcomMessage}</Text>
      <Formik
        initialValues={{
          email: '',
          userName: '',
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
            {renderInputFields(
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
            )}

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
                {strings.termConditionMessage1}{' '}
                <Text
                  style={[styles.linkText, {color: colorTheme.textColor}]}
                  onPress={() => openLink('https://example.com/terms')}>
                  {strings.termConditionMessage2}
                </Text>{' '}
                {strings.and}{' '}
                <Text
                  style={[styles.linkText, {color: colorTheme.textColor}]}
                  onPress={() => openLink('https://example.com/privacy')}>
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
              buttonColor={Color.WhiteDefault}
              fontSize={scale(15)}
              fontFamily={Font.semiBold}
              fontColor={Color.theme1}
              borderRadius={scale(10)}
              marginTop={verticalScale(20)}
              textTransform={'uppercase'}
              onPress={handleSignIn}
            />

            {/* <View style={styles.signUpContainer}>
              <Text style={styles.infoText}>
                {strings.alreadyAccountmsg}{' '}
                <Text
                  style={styles.signUpText}
                  onPress={() => }>
                  {' '}
                  {strings.signIn}
                </Text>
              </Text>
            </View> */}
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
