import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ScreenName, ScreenPath} from '../component/Screen';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName={ScreenName.home}>
      <Stack.Screen
        name={ScreenName.home}
        component={ScreenPath.HomeScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenName.verses}
        component={ScreenPath.VersesScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenName.createCard}
        component={ScreenPath.CreateCardScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenName.qaScreen}
        component={ScreenPath.QAScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenName.profile}
        component={ScreenPath.ProfileScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenName.contact}
        component={ScreenPath.ContactScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenName.support}
        component={ScreenPath.SupportScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={ScreenName.notes}
        component={ScreenPath.NotesScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AppStack;

const styles = StyleSheet.create({});
