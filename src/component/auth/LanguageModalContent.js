import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';
import Color from '../Color';
import { scale, verticalScale } from '../../custome/Responsive';
import AntDesign from 'react-native-vector-icons/AntDesign';
import strings from '../../language/strings';
import useTheme from '../Theme';

const LanguageModalContent = ({
    setSelectedLanguage,
    selectedLanguage,
    closeModal,
    handleLanguageSaved
}) => {
    const colorTheme = useTheme()
    const languages = [
        {
            id: 0,
            name: 'English',
            flag: require('../../Assets/FlagImage/UsaFlag.png'),
        },
        { id: 1, name: 'Español', flag: require('../../Assets/FlagImage/spain.png') },
        {
            id: 2,
            name: 'Português',
            flag: require('../../Assets/FlagImage/portugal.png'),
        },
        {
            id: 3,
            name: 'Français',
            flag: require('../../Assets/FlagImage/france.png'),
        },
        {
            id: 4,
            name: 'Italiano',
            flag: require('../../Assets/FlagImage/italy.png'),
        },
        {
            id: 5,
            name: 'Deutsch',
            flag: require('../../Assets/FlagImage/germany.png'),
        },
        { id: 6, name: 'Polski', flag: require('../../Assets/FlagImage/poland.png') },
        {
            id: 7,
            name: '普通话',
            flag: require('../../Assets/FlagImage/china.png'),
        },
        { id: 8, name: 'Kiswahili', flag: require('../../Assets/FlagImage/kenya.png') },
        {
            id: 9,
            name: 'Tagalog',
            flag: require('../../Assets/FlagImage/philippines.png'),
        },
        { id: 10, name: 'हिंदी', flag: require('../../Assets/FlagImage/india.png') },
    ];

    const changeLanguage = (name) => {
        name === 'English' && strings.setLanguage('en');
        name === 'Español' && strings.setLanguage('es');
        name === 'Português' && strings.setLanguage('pt');
        name === 'Français' && strings.setLanguage('fr');
        name === 'Italiano' && strings.setLanguage('it');
        name === 'Deutsch' && strings.setLanguage('de');
        name === 'Polski' && strings.setLanguage('pl');
        name === '普通话' && strings.setLanguage('zh');
        name === 'Kiswahili' && strings.setLanguage('sw');
        name === 'Tagalog' && strings.setLanguage('tl');
        name === 'हिंदी' && strings.setLanguage('hi');
    };

    const renderLanguage = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={[styles.languageRow, { borderBottomWidth: item?.id !== 10 ? scale(0.5) : 0 }]}
                onPress={() => {
                    setSelectedLanguage(item);
                    handleLanguageSaved(item)
                    changeLanguage(item?.name)
                    closeModal();
                }}>
                <Image source={item.flag} style={styles.flag} />
                <Text style={[styles.languageText, { color: colorTheme.textColor }]}>{item.name}</Text>

                {selectedLanguage?.id === item.id ? (
                    <AntDesign name="checkcircle" size={21.5} color={Color.Green} />
                ) : (
                    <View style={styles.radioButton} />
                )}
            </TouchableOpacity>
        );
    };

    console.log('selectedLanguage', selectedLanguage)
    console.log('languages', languages)

    return (
        <View style={[styles.container, { backgroundColor: colorTheme.modelBackgroundView }]}>
            <FlatList
                data={languages}
                renderItem={renderLanguage}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: scale(10),
        paddingHorizontal: scale(10),
        backgroundColor: '#fff',
    },
    languageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(10),
        borderBottomColor: '#ddd',
    },
    flag: {
        width: scale(30),
        height: scale(20),
        marginRight: scale(10),
    },
    languageText: {
        flex: 1,
        fontSize: scale(15),
        color: Color.Black,
    },
    radioButton: {
        width: scale(20),
        height: scale(20),
        borderWidth: scale(2),
        borderColor: '#ccc',
        borderRadius: scale(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        width: scale(16),
        height: scale(16),
        backgroundColor: 'green',
        borderRadius: scale(8),
    },
});

export default LanguageModalContent;






// import React from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     FlatList,
//     Image,
//     TouchableOpacity,
// } from 'react-native';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import strings from '../../language/strings';
// import useTheme from '../Theme';
// import { scale, verticalScale } from '../../custome/Responsive';
// import Color from '../Color';

// const LanguageModalContent = ({
//     setSelectedLanguage,
//     selectedLanguage,
//     closeModal,
//     handleLanguageSaved,
// }) => {
//     const colorTheme = useTheme();

//     const languages = [
//         { id: 0, name: strings.english, flag: require('../../Assets/FlagImage/UsaFlag.png'), code: 'en' },
//         { id: 1, name: strings.espanol, flag: require('../../Assets/FlagImage/spain.png'), code: 'es' },
//         { id: 2, name: strings.postogues, flag: require('../../Assets/FlagImage/portugal.png'), code: 'pt' },
//         { id: 3, name: strings.francais, flag: require('../../Assets/FlagImage/france.png'), code: 'fr' },
//         { id: 4, name: strings.italiano, flag: require('../../Assets/FlagImage/italy.png'), code: 'it' },
//         { id: 5, name: strings.german, flag: require('../../Assets/FlagImage/germany.png'), code: 'de' },
//         { id: 6, name: strings.polish, flag: require('../../Assets/FlagImage/poland.png'), code: 'pl' },
//         { id: 7, name: strings.mandarin, flag: require('../../Assets/FlagImage/china.png'), code: 'zh' },
//         { id: 8, name: strings.swahili, flag: require('../../Assets/FlagImage/kenya.png'), code: 'sw' },
//         { id: 9, name: strings.tagalog, flag: require('../../Assets/FlagImage/philippines.png'), code: 'tl' },
//         { id: 10, name: strings.hindi, flag: require('../../Assets/FlagImage/india.png'), code: 'hi' },
//     ];

//     const changeLanguage = (code) => {
//         strings.setLanguage(code);
//     };

//     const renderLanguage = ({ item }) => (
//         <TouchableOpacity
//             style={[
//                 styles.languageRow,
//                 { borderBottomWidth: item.id !== languages.length - 1 ? scale(0.5) : 0 },
//             ]}
//             onPress={() => {
//                 setSelectedLanguage(item);
//                 handleLanguageSaved(item);
//                 changeLanguage(item.code);
//                 closeModal();
//             }}
//         >
//             <Image source={item.flag} style={styles.flag} />
//             <Text style={[styles.languageText, { color: colorTheme.textColor }]}>
//                 {item.name}
//             </Text>

//             {selectedLanguage?.code === item.code ? (
//                 <AntDesign name="checkcircle" size={21.5} color={Color.Green} />
//             ) : (
//                 <View style={styles.radioButton} />
//             )}
//         </TouchableOpacity>
//     );

//     return (
//         <View style={[styles.container, { backgroundColor: colorTheme.modelBackgroundView }]}>
//             <FlatList
//                 data={languages}
//                 renderItem={renderLanguage}
//                 keyExtractor={(item) => item.id.toString()}
//                 showsVerticalScrollIndicator={false}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         paddingHorizontal: scale(10),
//         backgroundColor: '#fff',
//     },
//     languageRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: verticalScale(10),
//         borderBottomColor: '#ddd',
//     },
//     flag: {
//         width: scale(30),
//         height: scale(20),
//         marginRight: scale(10),
//     },
//     languageText: {
//         flex: 1,
//         fontSize: scale(15),
//         color: Color.Black,
//     },
//     radioButton: {
//         width: scale(20),
//         height: scale(20),
//         borderWidth: scale(2),
//         borderColor: '#ccc',
//         borderRadius: scale(10),
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });

// export default LanguageModalContent;




