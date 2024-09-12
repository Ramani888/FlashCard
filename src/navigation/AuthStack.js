import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ScreenName, ScreenPath} from '../component/Screen';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName={ScreenName.signIn}>
      <Stack.Screen
        name={ScreenName.signUp}
        component={ScreenPath.SignUpScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenName.otpVerify}
        component={ScreenPath.OtpVerifyScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenName.signIn}
        component={ScreenPath.SignInScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
