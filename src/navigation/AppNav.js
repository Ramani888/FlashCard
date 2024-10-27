import {StyleSheet, View, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppStack from './AppStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../component/Loader';

const AppNav = () => {
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser)
        global.user = parsedUser;
        global.token = parsedUser?.token
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

  if (loading) {
    return <Loader visible={loading} />;
  }

  return (
    <View style={{flex: 1}}>
      <AppStack user={user} />
    </View>
  );
};

export default AppNav;
