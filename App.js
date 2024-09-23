import 'react-native-gesture-handler';
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNav from './src/navigation/AppNav';
import {Provider} from 'react-redux';
import store from './src/redux/store';

const App = () => {
  return (
    <View style={{flex: 1}}>
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
