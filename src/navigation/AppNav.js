import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AppStack from './AppStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../component/Loader';
import strings from '../language/strings';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { ScreenName } from '../component/Screen';

const AppNav = () => {
    const navigation = useNavigation()
    const isFocused = useIsFocused();
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        (async () => {
            const lang = await AsyncStorage.getItem('Language')
            if (lang) {
                const Language = JSON.parse(lang)
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
        })()
    }, [isFocused])

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
        <View style={{ flex: 1 }}>
            <AppStack user={user} />
        </View>
    );
};

export default AppNav;
