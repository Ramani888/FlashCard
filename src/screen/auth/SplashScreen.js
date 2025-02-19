import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScreenName} from '../../component/Screen';
import LottieSplashScreen from 'react-native-lottie-splash-screen';

const SplashScreen = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  const checkLogin = useCallback(async () => {
    setVisible(true);
    const user = await AsyncStorage.getItem('user');
    setVisible(false);

    if (user) {
      setTimeout(() => {
        LottieSplashScreen.hide();
        navigation.reset({
          index: 0,
          routes: [{name: ScreenName.home}],
        });
      }, 4500);
    } else {
      setTimeout(() => {
        LottieSplashScreen.hide();
        navigation.reset({
          index: 0,
          routes: [{name: ScreenName.signIn}],
        });
      }, 4500);
    }
  }, [navigation]);

  return <View style={styles.container} />;
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  lottie: {width: '100%', height: '100%'},
});
