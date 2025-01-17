import { useSelector } from 'react-redux';
import Color from './Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

const useTheme = () => {
    const isFocused = useIsFocused();
    const [initialTheme, setInitialTheme] = useState(null);
    const theme = useSelector(state => state.myState.theme);

    useEffect(() => {
        const fetchTheme = async () => {
            const storedTheme = await AsyncStorage.getItem('theme');
            setInitialTheme(storedTheme);
        };
        if (isFocused) fetchTheme();
    }, [isFocused]);

    const isLightTheme = (theme || initialTheme) === 'Light';

    const themeColors = {
        headerTheme: isLightTheme
            ? ['#00394d', '#00394d', '#00394d']
            : ['#00394d', '#00394d', '#00394d'],
        gradientTheme: isLightTheme
            ? ['#00394d', '#00394d', '#00394d']
            : ['#00394d', '#001f2b', '#001f2b', '#00394d'],
        background: isLightTheme ? Color.White : '#1C1C1C',
        background1: isLightTheme ? Color.WhiteDefault : '#1C1C1C',
        textColor: isLightTheme ? Color.Black : Color.White,
        textColor1: isLightTheme ? Color.Black : Color.WhiteDefault,
        listAndBoxColor: isLightTheme ? Color.White : '#494949',
        listAndBoxColor1: isLightTheme ? Color.WhiteDefault : '#494949',
        cardHeader: isLightTheme ? '#ececec' : '#1C1C1C',
        cardHeader1: isLightTheme ? '#ececec' : '#040415',
        modelBackgroundView: isLightTheme ? Color.White : '#040415',
        modelBackground: isLightTheme ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)',
        subscriptionView: isLightTheme ? '#146D8B33' : '#0F576F',
        threeDotIcon: isLightTheme ? Color.WhiteDefault : '#9F9F9F66',
    };

    return { theme, ...themeColors };
};

export default useTheme;

// import Color from './Color';

// const useTheme = () => {
//   const isLightTheme = true;

//   const themeColors = {
//     headerTheme: ['#00394d', '#00394d', '#00394d'],
//     gradientTheme: ['#00394d', '#00394d', '#00394d'],
//     background: Color.White,
//     background1: Color.WhiteDefault,
//     textColor: Color.Black,
//     textColor1: Color.Black,
//     textColor2: Color.White,
//     listAndBoxColor: Color.White,
//     listAndBoxColor1: Color.WhiteDefault,
//     cardHeader: '#ececec',
//     modelBackgroundView: Color.White,
//     modelBackground: 'rgba(0,0,0,0.8)',
//     subscriptionView: '#146D8B33',
//     threeDotIcon: Color.WhiteDefault,
//   };

//   return {theme: 'Light', ...themeColors};
// };

// export default useTheme;

