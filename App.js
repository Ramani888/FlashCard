import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LottieSplashScreen from 'react-native-lottie-splash-screen';
// import mobileAds, {MaxAdContentRating} from 'react-native-google-mobile-ads';
import DeviceInfo from 'react-native-device-info';
import AppNav from './src/navigation/AppNav';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import Color from './src/component/Color';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

const App = gestureHandlerRootHOC(() => {
  useEffect(() => {
    setTimeout(() => {
      LottieSplashScreen.hide();
    }, 1500);
    // mobileAds()
    //   .setRequestConfiguration({
    //     testDeviceIdentifiers: ['cbf12cd8aae26bcd'],
    //   })
    //   .then(() => {
    //     console.log('Ad configuration set successfully');
    //   });
    DeviceInfo.getUniqueId().then(deviceId => {
      // console.log('Test Device ID:', deviceId);
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      <StatusBar translucent backgroundColor={Color.transparent} />
      <NavigationContainer>
        <Provider store={store}>
          <AppNav />
        </Provider>
      </NavigationContainer>
    </View>
  );
});

export default App;

const styles = StyleSheet.create({});
