import { Divider } from '@rneui/themed/dist/Divider';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import {MenuOption} from 'react-native-popup-menu';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {scale, verticalScale} from '../../custome/Responsive';
import strings from '../../language/strings';
import Color from '../Color';
import useTheme from '../Theme';

/**
 * @typedef {{ id: number, name: string, englishName: string, flag: import('react-native').ImageSourcePropType, code: string }} LanguageItem
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/** @type {LanguageItem[]} */
export const LANGUAGES = [
  {id: 0,  name: 'English',      englishName: 'English',            flag: require('../../Assets/FlagImage/UsaFlag.png'),      code: 'en'},
  {id: 1,  name: 'Español',      englishName: 'Spanish',            flag: require('../../Assets/FlagImage/spain.png'),        code: 'es'},
  {id: 2,  name: 'Français',     englishName: 'French',             flag: require('../../Assets/FlagImage/france.png'),       code: 'fr'},
  {id: 3,  name: 'Deutsch',      englishName: 'German',             flag: require('../../Assets/FlagImage/germany.png'),      code: 'de'},
  {id: 4,  name: 'Português',    englishName: 'Portuguese',         flag: require('../../Assets/FlagImage/portugal.png'),     code: 'pt'},
  {id: 5,  name: 'Italiano',     englishName: 'Italian',            flag: require('../../Assets/FlagImage/italy.png'),        code: 'it'},
  {id: 6,  name: 'Polski',       englishName: 'Polish',             flag: require('../../Assets/FlagImage/poland.png'),       code: 'pl'},
  {id: 7,  name: '简体中文',      englishName: 'Chinese (Mandarin)', flag: require('../../Assets/FlagImage/china.png'),        code: 'zh'},
  {id: 8,  name: 'Kiswahili',    englishName: 'Swahili',            flag: require('../../Assets/FlagImage/kenya.png'),        code: 'sw'},
  {id: 9,  name: 'Tagalog',      englishName: 'Filipino',           flag: require('../../Assets/FlagImage/philippines.png'), code: 'tl'},
  {id: 10, name: 'हिंदी',         englishName: 'Hindi',              flag: require('../../Assets/FlagImage/india.png'),        code: 'hi'},
  {id: 11, name: 'Bahasa Indonesia', englishName: 'Indonesian',     flag: require('../../Assets/FlagImage/indonesia.png'),   code: 'id'},
  {id: 12, name: '한국어',         englishName: 'Korean',             flag: require('../../Assets/FlagImage/korea.png'),        code: 'ko'},
  {id: 13, name: 'አማርኛ',         englishName: 'Amharic',            flag: require('../../Assets/FlagImage/ethiopia.png'),    code: 'am'},
  {id: 14, name: 'Українська',   englishName: 'Ukrainian',          flag: require('../../Assets/FlagImage/ukraine.png'),     code: 'uk'},
  {id: 15, name: 'Asụsụ Igbo',   englishName: 'Igbo',               flag: require('../../Assets/FlagImage/nigeria.png'),     code: 'ig'},
  {id: 16, name: 'Română',       englishName: 'Romanian',           flag: require('../../Assets/FlagImage/romania.png'),     code: 'ro'},
  {id: 17, name: 'Yorùbá',       englishName: 'Yoruba',             flag: require('../../Assets/FlagImage/benin.png'),       code: 'yo'},
  {id: 18, name: 'Cebuano',      englishName: 'Cebuano',            flag: require('../../Assets/FlagImage/philippines.png'), code: 'ceb'},
  {id: 19, name: 'Ελληνικά',     englishName: 'Greek',              flag: require('../../Assets/FlagImage/greece.png'),      code: 'el'},
  {id: 20, name: 'العربية',       englishName: 'Arabic',             flag: require('../../Assets/FlagImage/saudi_arabia.png'), code: 'ar'},
  {id: 21, name: 'Nederlands',   englishName: 'Dutch',              flag: require('../../Assets/FlagImage/netherlands.png'), code: 'nl'},
  {id: 22, name: 'Svenska',      englishName: 'Swedish',            flag: require('../../Assets/FlagImage/sweden.png'),      code: 'sv'},
  {id: 23, name: 'Magyar',       englishName: 'Hungarian',          flag: require('../../Assets/FlagImage/hungary.png'),     code: 'hu'},
  {id: 24, name: 'Tiếng Việt',   englishName: 'Vietnamese',         flag: require('../../Assets/FlagImage/vietnam.png'),     code: 'vi'},
];
/* eslint-enable @typescript-eslint/no-unsafe-assignment */

/**
 * @param {{ setSelectedLanguage: (item: LanguageItem) => void, selectedLanguage: LanguageItem | null, handleLanguageSaved: (item: LanguageItem) => void }} props
 */
const LanguageModalContent = ({
  setSelectedLanguage,
  selectedLanguage,
  handleLanguageSaved,
}) => {
  const colorTheme = useTheme();

  const changeLanguage = name => {
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
    name === 'Bahasa Indonesia' && strings.setLanguage('id');
    name === 'Indonesia' && strings.setLanguage('id');
    name === '한국어' && strings.setLanguage('ko');
    name === 'አማርኛ' && strings.setLanguage('am');
    name === 'Українська' && strings.setLanguage('uk');
    name === 'Igbo' && strings.setLanguage('ig');
    name === 'Română' && strings.setLanguage('ro');
    name === 'Yorùbá' && strings.setLanguage('yo');
    name === 'Cebuano' && strings.setLanguage('ceb');
    name === 'Ελληνικά' && strings.setLanguage('el');
    name === 'العربية' && strings.setLanguage('ar');
    name === 'Nederlands' && strings.setLanguage('nl');
    name === 'Svenska' && strings.setLanguage('sv');
    name === 'Magyar' && strings.setLanguage('hu');
    name === 'Tiếng Việt' && strings.setLanguage('vi');
  };

  /** @param {{ item: LanguageItem }} param */
  const renderLanguage = ({item}) => {
    return (
      <>
        <MenuOption
          onSelect={() => {
            setSelectedLanguage(/** @type {LanguageItem} */ (item));
            handleLanguageSaved(/** @type {LanguageItem} */ (item));
            changeLanguage(/** @type {LanguageItem} */ (item)?.name);
          }}>
          <View
            style={[
              styles.languageRow
            ]}>
            <Image source={item.flag} style={styles.flag} />
            <Text style={[styles.languageText, {color: colorTheme.textColor}]}>
              {item.name}
            </Text>

            {selectedLanguage?.id === item.id ? (
              <AntDesign name="checkcircle" size={21.5} color={Color.Green} />
            ) : (
              <View style={styles.radioButton} />
            )}
          </View>
        </MenuOption>
        <Divider />
      </>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colorTheme.modelBackgroundView},
      ]}>
      <FlatList
        data={LANGUAGES}
        renderItem={renderLanguage}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: scale(12),
    display: 'flex',
    flexDirection: 'column',
    gap: verticalScale(4),
    borderRadius: scale(10),
  },
  languageRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(5),
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
