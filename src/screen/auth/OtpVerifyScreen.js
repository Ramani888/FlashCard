import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import Font from '../../component/Font';
import Color from '../../component/Color';
import OTPTextInput from 'react-native-otp-textinput';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import CustomeButton from '../../custome/CustomeButton';
import {apiPost} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import {ScreenName} from '../../component/Screen';
import Loader from '../../component/Loader';

const {width, height} = Dimensions.get('window');

const OtpVerifyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isCounting, setIsCounting] = useState(false);
  const {email} = route.params;

  useEffect(() => {
    let timer;
    if (isCounting) {
      timer = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setIsCounting(false);
            return 60;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isCounting]);

  useEffect(() => {
    setIsCounting(true);
  }, [isFocused]);

  // ===================================== Api ==================================== //

  const verifyOtp = async () => {
    const rawData = {
      email: email,
      otp: otp,
    };
    try {
      setVisible(true);
      const response = await apiPost(
        Api.verifyOtp,
        '',
        JSON.stringify(rawData),
      );
      // console.log('responseverify', response);
      if (response?.success == true) {
        showMessageonTheScreen(response?.message);
        navigation.navigate(ScreenName.signIn);
      }
    } catch (error) {
      console.log('error in verify otp api', error);
    } finally {
      setVisible(false);
    }
  };

  // ===================================== End ==================================== //

  const handleOtpChange = text => {
    setOtp(text);
    if (text.length === 4 && /^\d+$/.test(text)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const handleVerify = () => {
    if (isValid && otp.length === 4) {
      verifyOtp();
    } else {
      showMessageonTheScreen('Invalid OTP, please check your input.');
    }
  };

  const renderBody = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.title}>Input OTP</Text>
        <Text style={styles.subtitle}>
          We have sent the OTP Verification code to your haecal78@gmail.com.
          Check your Email and enter the code below.
        </Text>
        <OTPTextInput
          handleTextChange={handleOtpChange}
          inputCount={4}
          containerStyle={styles.otpContainer}
          textInputStyle={styles.otpInput}
          tintColor={isValid ? Color.Black : Color.Green}
          offTintColor={Color.mediumGray}
        />

        <Text
          style={{
            fontSize: scale(14),
            color: Color.Black,
            fontFamily: Font.regular,
            paddingBottom: verticalScale(10),
          }}>
          Didn’t recive email?
        </Text>

        {isCounting && (
          <Text style={styles.recendOtpText}>
            You can resend code in{' '}
            <Text
              style={{
                fontSize: scale(14),
                color: Color.Red,
                fontFamily: Font.regular,
              }}>
              {countdown}{' '}
            </Text>{' '}
            Second
          </Text>
        )}

        <CustomeButton
          title={'VERIFY'}
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
    <View style={{flex: 1}}>
      <Loader visible={visible} />
      {renderBody()}
    </View>
  );
};

export default React.memo(OtpVerifyScreen);

const styles = StyleSheet.create({
  title: {
    fontSize: scale(20),
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
    width: scale(300),
  },
  otpContainer: {
    marginVertical: verticalScale(20),
  },
  otpInput: {
    width: width * 0.2,
    height: height * 0.1,
    borderWidth: scale(0.3),
    borderColor: Color.LightGray,
    borderBottomWidth: scale(0.3),
    borderRadius: scale(10),
    fontFamily: Font.regular,
    backgroundColor: Color.White,
  },
  recendOtpText: {
    fontSize: scale(15),
    fontFamily: Font.regular,
    color: Color.Black,
  },
});
