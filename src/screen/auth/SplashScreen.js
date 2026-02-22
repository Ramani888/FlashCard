import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScreenName} from '../../component/Screen';
import LottieSplashScreen from 'react-native-lottie-splash-screen';

const SPLASH_TIMEOUT = 500;

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const targetScreen = user ? ScreenName.setAndFolder : ScreenName.signIn;
        
        setTimeout(() => {
          LottieSplashScreen.hide();
          navigation.reset({
            index: 0,
            routes: [{name: targetScreen}],
          });
        }, SPLASH_TIMEOUT);
      } catch (error) {
        console.log('Error checking login:', error);
        setTimeout(() => {
          LottieSplashScreen.hide();
          navigation.reset({
            index: 0,
            routes: [{name: ScreenName.signIn}],
          });
        }, SPLASH_TIMEOUT);
      }
    };

    checkLogin();
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
});
