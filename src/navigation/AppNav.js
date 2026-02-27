import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import AppStack from './AppStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from '../language/strings';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {ScreenName} from '../component/Screen';
import {useAppSelector} from '../redux/hooks';

const AppNav = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  
  // Use Redux auth state instead of global variables
  const {isAuthenticated, isLoading} = useAppSelector(state => state.auth);
  
  // Track previous auth state to detect logout
  const prevIsAuthenticatedRef = useRef(isAuthenticated);

  // Handle logout detection (token expiry or manual logout)
  // Only navigate to login if user was authenticated and is now logged out
  useEffect(() => {
    // If user was authenticated before but not anymore (logout/token expiry)
    if (!isLoading && prevIsAuthenticatedRef.current && !isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{name: ScreenName.signIn}],
      });
    }
    prevIsAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated, isLoading, navigation]);

  useEffect(() => {
    (async () => {
      const lang = await AsyncStorage.getItem('Language');
      if (lang) {
        const Language = JSON.parse(lang);
        Language?.name === 'English' && strings.setLanguage('en');
        Language?.name === 'Español' && strings.setLanguage('es');
        Language?.name === 'Português' && strings.setLanguage('pt');
        Language?.name === 'Français' && strings.setLanguage('fr');
        Language?.name === 'Italiano' && strings.setLanguage('it');
        Language?.name === 'Deutsch' && strings.setLanguage('de');
        Language?.name === 'Polski' && strings.setLanguage('pl');
        Language?.name === '普通话' && strings.setLanguage('zh');
        Language?.name === 'Kiswahili' && strings.setLanguage('sw');
        Language?.name === 'Tagalog' && strings.setLanguage('tl');
        Language?.name === 'हिंदी' && strings.setLanguage('hi');
      }
    })();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <AppStack />
    </View>
  );
};

export default AppNav;

const styles = StyleSheet.create({
  container: {flex: 1},
});
