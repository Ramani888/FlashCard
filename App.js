import 'react-native-gesture-handler';
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNav from './src/navigation/AppNav';

const App = () => {
  return (
    <View style={{flex:1}}>
      <NavigationContainer>
        <AppNav />
      </NavigationContainer>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
