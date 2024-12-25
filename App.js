import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LottieSplashScreen from 'react-native-lottie-splash-screen';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import Color from './src/component/Color';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import mobileAds from 'react-native-google-mobile-ads';
import AppNav from './src/navigation/AppNav';
import {MenuProvider} from 'react-native-popup-menu';
import { withIAPContext } from 'react-native-iap';

const App = gestureHandlerRootHOC(() => {
  useEffect(() => {
    setTimeout(() => {
      LottieSplashScreen.hide();
    }, 1500);

    mobileAds()
    .initialize()
    .then(() => {
      console.log('AdMob Initialized');
    });
  });

  return (
    <MenuProvider>
      <View style={{flex: 1}}>
        <StatusBar translucent backgroundColor={Color.transparent} />
        <NavigationContainer>
          <Provider store={store}>
            <AppNav />
          </Provider>
        </NavigationContainer>
      </View>
    </MenuProvider>
  );
});

export default withIAPContext(App);

const styles = StyleSheet.create({});
