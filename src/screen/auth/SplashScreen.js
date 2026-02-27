import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../../component/Screen';
import LottieSplashScreen from 'react-native-lottie-splash-screen';
import {useAppSelector} from '../../redux/hooks';
import Color from '../../component/Color';

const SPLASH_TIMEOUT = 500;

const SplashScreen = () => {
  const navigation = useNavigation();
  // Get auth state from Redux instead of AsyncStorage
  const {isAuthenticated, isLoading} = useAppSelector(state => state.auth);
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Only navigate once, when auth loading is complete
    if (!isLoading && !hasNavigated.current) {
      hasNavigated.current = true;
      const targetScreen = isAuthenticated 
        ? ScreenName.setAndFolder 
        : ScreenName.signIn;
      
      setTimeout(() => {
        LottieSplashScreen.hide();
        navigation.reset({
          index: 0,
          routes: [{name: targetScreen}],
        });
      }, SPLASH_TIMEOUT);
    }
  }, [isLoading, isAuthenticated, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Color.theme1} />
    </View>
  );
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
