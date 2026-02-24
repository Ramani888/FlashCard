import {
  AppState,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { scale, verticalScale } from '../../custome/Responsive';
import Font from '../../component/Font';
import Color from '../../component/Color';
import OTPTextInput from 'react-native-otp-textinput';
import CustomeButton from '../../custome/CustomeButton';
import { apiPost, apiPut } from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenName } from '../../component/Screen';
import { useLoader } from '../../context';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Helper function to get language code from AsyncStorage
const getLanguageCode = async () => {
  try {
    const langData = await AsyncStorage.getItem('Language');
    const selectedLanguage = langData ? JSON.parse(langData) : null;
    return selectedLanguage?.code || 'en';
  } catch (error) {
    console.log('Error getting language:', error);
    return 'en';
  }
};

const OtpVerifyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const colorTheme = useTheme();
  const { showLoader, hideLoader } = useLoader();
  const [isValid, setIsValid] = useState(true);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(120);
  const [isCounting, setIsCounting] = useState(false);
  const { email, password } = route.params;

  const appState = useRef(AppState.currentState);
  const timerRef = useRef(null);
  const startTimestampRef = useRef(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) return; // Prevent multiple intervals

    setIsCounting(true);
    startTimestampRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor(
        (now - startTimestampRef.current) / 1000,
      );
      const remainingTime = Math.max(120 - elapsedSeconds, 0);

      setCountdown(remainingTime);

      if (remainingTime <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setIsCounting(false);
      }
    }, 1000);
  }, []);

  // Stop Timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      setIsCounting(false);
    }
  }, [countdown]);

  // App State Change Handler
  const handleAppStateChange = useCallback(nextAppState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App returning to the foreground
      const now = Date.now();
      const elapsedSeconds = Math.floor(
        (now - startTimestampRef.current) / 1000,
      );
      const remainingTime = Math.max(120 - elapsedSeconds, 0);

      setCountdown(remainingTime);

      if (remainingTime > 0) {
        startTimestampRef.current = Date.now() - elapsedSeconds * 1000;
        startTimer();
      } else {
        stopTimer();
        setCountdown(0);
      }
    }

    appState.current = nextAppState;
  }, [startTimer, stopTimer]);

  // Clear Timer on Unmount
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
      stopTimer(); // Clear any running timer
    };
  }, [handleAppStateChange]);

  // Start Timer on Mount
  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  // ===================================== Api ==================================== //

  const verifyOtp = useCallback(async () => {
    try {
      const languageCode = await getLanguageCode();

      const rawData = {
        email,
        otp,
        isPrivacy: true,
        language: languageCode,
      };

      showLoader();
      const response = await apiPost(
        Api.verifyOtp,
        '',
        JSON.stringify(rawData),
      );
      if (response?.success === true) {
        showMessageonTheScreen(response?.message);
        navigation.navigate(ScreenName.signIn);
      } else {
        showMessageonTheScreen(response?.message);
      }
    } catch (error) {
      console.log('error in verify otp api', error);
    } finally {
      hideLoader();
    }
  }, [email, otp, showLoader, hideLoader, navigation]);

  const forgotPasswordVerifyOtp = useCallback(async () => {
    try {
      const languageCode = await getLanguageCode();

      const rawData = {
        email,
        password,
        otp,
        language: languageCode,
      };

      showLoader();
      const response = await apiPut(
        Api.forgotPasswordVerifyOtp,
        '',
        JSON.stringify(rawData),
      );
      if (response?.success === true) {
        showMessageonTheScreen(response?.message);
        navigation.navigate(ScreenName.signIn);
      }
    } catch (error) {
      console.log('error in verify otp api', error);
    } finally {
      hideLoader();
    }
  }, [email, password, otp, showLoader, hideLoader, navigation]);

  const ResendOtp = useCallback(async () => {
    try {
      const languageCode = await getLanguageCode();

      showLoader();
      const response = await apiPut(`${Api.resendOtp}?email=${email}&language=${languageCode}`);
      if (response?.success === true) {
        showMessageonTheScreen(response?.message);
        setCountdown(120);
        startTimer();
      }
    } catch (error) {
      console.log('error in resend otp api', error);
    } finally {
      hideLoader();
    }
  }, [email, showLoader, hideLoader, startTimer]);

  // ===================================== End ==================================== //

  const handleOtpChange = useCallback((text) => {
    setOtp(text);
    setIsValid(text.length === 4 && /^\d+$/.test(text));
  }, []);

  const handleVerify = useCallback(() => {
    if (isValid && otp.length === 4) {
      password ? forgotPasswordVerifyOtp() : verifyOtp();
    } else {
      showMessageonTheScreen(strings.invalidOtpMessage);
    }
  }, [isValid, otp, password, forgotPasswordVerifyOtp, verifyOtp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderBody = () => {
    return (
      <View style={styles.bodyContainer}>
        <Text style={[styles.title, { color: colorTheme.textColor }]}>
          {strings.inputOtp}
        </Text>
        <Text style={styles.subtitle}>
          {strings.emailInfo1}
          <Text style={[styles.email, { color: colorTheme.textColor }]}>
            {' '}
            {email}
          </Text>{' '}
          {strings.emailInfo2}
        </Text>
        <Text style={styles.noteText}>
          <Text style={styles.noteLabel}>{strings.noteLabel}</Text>
          {strings.spamFolderNote}
        </Text>
        <OTPTextInput
          handleTextChange={handleOtpChange}
          inputCount={4}
          containerStyle={styles.otpContainer}
          textInputStyle={styles.otpInput}
          tintColor={isValid ? Color.Black : Color.Green}
          offTintColor={Color.mediumGray}
        />

        {isCounting && (
          <View style={styles.resendView}>
            <Text
              style={{
                fontSize: scale(14),
                color: colorTheme.textColor,
                fontFamily: Font.regular,
                paddingBottom: verticalScale(20),
              }}>
              {strings.dontReciveEmail}
            </Text>

            <Text style={[styles.recendOtpText, { color: colorTheme.textColor }]}>
              {strings.resendMessage1}{' '}
              <Text
                style={{
                  fontSize: scale(14),
                  color: Color.Red,
                  fontFamily: Font.regular,
                }}>
                {formatTime(countdown)}{' '}
              </Text>{' '}
              {strings.resendMessage2}
            </Text>
          </View>
        )}

        {!isCounting && (
          <Pressable style={styles.resendBtn} onPress={() => ResendOtp()}>
            <Text
              style={{
                fontSize: scale(14),
                color: colorTheme.textColor,
                fontFamily: Font.medium,
              }}>
              {strings.resendOtp}
            </Text>
          </Pressable>
        )}

        <CustomeButton
          title={strings.verify}
          buttonWidth={'90%'}
          buttonHeight={verticalScale(45)}
          buttonColor={Color.theme1}
          fontSize={scale(15)}
          fontFamily={Font.semiBold}
          fontColor={Color.White}
          borderRadius={scale(10)}
          marginTop={verticalScale(30)}
          alignSelf={'center'}
          onPress={handleVerify}
        />
      </View>
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: colorTheme.background1 }]}>
      {renderBody()}
    </View>
  );
};

export default React.memo(OtpVerifyScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  bodyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
    width: scale(300),
    lineHeight: verticalScale(18),
  },
  noteText: {
    fontSize: scale(11.5),
    color: Color.mediumGray,
    fontFamily: Font.regular,
    textAlign: 'center',
    marginTop: verticalScale(8),
    width: scale(300),
    fontStyle: 'italic',
  },
  noteLabel: {
    color: Color.Red,
    fontFamily: Font.semiBold,
    fontStyle: 'normal',
  },
  otpContainer: {
    marginVertical: verticalScale(20),
  },
  otpInput: {
    width: width * 0.2,
    height: height * 0.1,
    borderWidth: scale(0.3),
    borderColor: Color.grayScale5,
    borderBottomWidth: scale(0.3),
    borderRadius: scale(5),
    fontFamily: Font.regular,
    backgroundColor: Color.White,
  },
  resendView: { alignItems: 'center' },
  resendBtn: { alignSelf: 'flex-end', marginRight: scale(20) },
  recendOtpText: {
    fontSize: scale(15),
    fontFamily: Font.regular,
    color: Color.Black,
  },
  email: { color: Color.Black },
});
