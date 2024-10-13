import 'react-native-gesture-handler';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LottieSplashScreen from 'react-native-lottie-splash-screen';
import AppNav from './src/navigation/AppNav';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import Color from './src/component/Color';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      LottieSplashScreen.hide();
    }, 1000);
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
};

export default App;

const styles = StyleSheet.create({});
