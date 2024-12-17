import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppStack from './AppStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../component/Loader';
import strings from '../language/strings';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import { ScreenName } from '../component/Screen';

const AppNav = () => {
  const navigation = useNavigation()
  const isFocused = useIsFocused();
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // setTimeout(() => {
    fetchUser();
    // }, 1000);
  }, []);

  useEffect(() => {
    (async () => {
      const language = await AsyncStorage.getItem('language');
      language == 'en' && strings.setLanguage('en');
      language == 'gu' && strings.setLanguage('gu');
      language == 'hi' && strings.setLanguage('hi');
      language == 'fr' && strings.setLanguage('fr');
    })();
  }, [isFocused]);

  const fetchUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        global.user = parsedUser;
        global.token = parsedUser?.token;
        navigation.navigate(ScreenName.home);
      } else {
        global.user = null;
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      global.user = null;
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <AppStack user={user} />
    </View>
  );
};

export default AppNav;
