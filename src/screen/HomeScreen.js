import React, {useCallback, useRef, useState, useEffect, useMemo, memo} from 'react';
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  BackHandler,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Color from '../component/Color';
import {scale, verticalScale, moderateScale} from '../custome/Responsive';
import Font from '../component/Font';
import LinearGradient from 'react-native-linear-gradient';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {ScreenName} from '../component/Screen';
import {useDispatch} from 'react-redux';
import {setTheme as setReduxTheme} from '../redux/slices/themeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTheme from '../component/Theme';
import strings from '../language/strings';
import AdBanner from './ads/BannerAds';
import ToggleSwitch from 'toggle-switch-react-native';

const {height} = Dimensions.get('window');

// Memoized image requires to prevent recreation
const IMAGES = {
  account: require('../Assets/Img/account.png'),
  aiIcon: require('../Assets/Img/aiIcon.png'),
  notes: require('../Assets/Img/notes.png'),
  cardIcon: require('../Assets/Img/cardIcon.png'),
  pdf: require('../Assets/Img/pdf.png'),
  images: require('../Assets/Img/images.png'),
  card: require('../Assets/Img/card.png'),
  darkCard: require('../Assets/Img/darkCard.png'),
};

// Memoized gradient colors
const LIGHT_GRADIENT = ['#00394d', '#00394d', '#00394d'];
const DARK_GRADIENT = ['#00394d', '#001f2b', '#001f2b', '#00394d'];

// const IconButton = memo(({name, iconComponent, selected, onPress}) => {
//   const Icon = iconComponent;

//   return (
//     <Pressable
//       style={[styles.iconBtn, selected && styles.iconBtnSelected]}
//       onPress={onPress}>
//       <Icon
//         name={name}
//         size={moderateScale(15)}
//         color={selected ? Color.White : Color.theme1}
//         style={[styles.icon, selected && styles.iconSelected]}
//       />
//     </Pressable>
//   );
// });

const HomeScreen = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const themeColor = useTheme();
  const navigation = useNavigation();
  const [theme, setTheme] = useState('Light');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const getInitialTheme = async () => {
      const initialTheme = await AsyncStorage.getItem('theme');
      setTheme(initialTheme);
      if (!initialTheme || initialTheme === 'null') {
        setTheme('Light');
      } else {
        setTheme(initialTheme);
      }
    };

    getInitialTheme();
  }, []);

  useEffect(() => {
    (async () => {
      const language = await AsyncStorage.getItem('language');
      language === 'en' && strings.setLanguage('en');
      language === 'gu' && strings.setLanguage('gu');
      language === 'hi' && strings.setLanguage('hi');
      language === 'fr' && strings.setLanguage('fr');
    })();
  }, [isFocused]);

  useEffect(() => {
    if (theme) {
      const saveTheme = async () => {
        await AsyncStorage.setItem('theme', theme);
      };

      saveTheme();

      dispatch(setReduxTheme(theme));
    }
  }, [theme, dispatch]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  // Memoized navigation handlers
  const navigateToProfile = useCallback(() => navigation.navigate(ScreenName.profile), [navigation]);
  const navigateToAi = useCallback(() => navigation.navigate(ScreenName.aiScreen), [navigation]);
  const navigateToNotes = useCallback(() => navigation.navigate(ScreenName.notes), [navigation]);
  const navigateToSetAndFolder = useCallback(() => navigation.navigate(ScreenName.setAndFolder), [navigation]);
  const navigateToPdf = useCallback(() => navigation.navigate(ScreenName.pdf), [navigation]);
  const navigateToImage = useCallback(() => navigation.navigate(ScreenName.image), [navigation]);

  // Memoized theme toggle handler
  const handleThemeToggle = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'Light' ? 'Dark' : 'Light');
  }, []);

  const tabView = useCallback(() => {
    return (
      <View style={styles.tabViewContainer}>
        <View style={styles.tabRow}>
          <Pressable
            style={styles.tabContainer}
            onPress={navigateToProfile}>
            <Image
              source={IMAGES.account}
              style={styles.tabIcon}
            />
            <Text style={styles.tabText}>{strings.homeTab1}</Text>
          </Pressable>

          <Pressable
            style={styles.tabAiContainer}
            onPress={navigateToAi}>
            <Image
              source={IMAGES.aiIcon}
              style={styles.tabAi}
            />
            <Text style={styles.tabText}>{strings.homeTab2}</Text>
          </Pressable>

          <Pressable
            style={styles.tabContainer}
            onPress={navigateToNotes}>
            <Image
              source={IMAGES.notes}
              style={styles.tabIcon}
              tintColor={Color.theme1}
            />
            <Text style={styles.tabText}>{strings.homeTab3}</Text>
          </Pressable>
        </View>

        <View style={styles.tabRowSecondary}>
          <Pressable
            style={styles.tabContainer}
            onPress={navigateToSetAndFolder}>
            <Image
              source={IMAGES.cardIcon}
              style={styles.tabIcon}
              tintColor={Color.theme1}
            />
            <Text style={styles.tabText}>{strings.homeTab6}</Text>
          </Pressable>

          <Pressable
            style={styles.tabContainer}
            onPress={navigateToPdf}>
            <Image
              source={IMAGES.pdf}
              style={styles.tabIcon}
              tintColor={Color.theme1}
            />
            <Text style={styles.tabText}>{strings.homeTab4}</Text>
          </Pressable>

          <Pressable
            style={styles.tabContainer}
            onPress={navigateToImage}>
            <Image
              source={IMAGES.images}
              style={styles.tabIcon}
              tintColor={Color.theme1}
            />
            <Text style={styles.tabText}>{strings.homeTab5}</Text>
          </Pressable>
        </View>
      </View>
    );
  }, [navigateToProfile, navigateToAi, navigateToNotes, navigateToSetAndFolder, navigateToPdf, navigateToImage]);

  // const BottomSheets = useCallback(() => {
  //   return (
  //     <RBSheet
  //       ref={refRBSheet}
  //       height={height * 0.57}
  //       openDuration={250}
  //       draggable={true}
  //       customStyles={{
  //         container: styles.bottomSheetContainer,
  //       }}>
  //       <View style={styles.sheetContainer}>
  //         <IconButton
  //           name="clock"
  //           iconComponent={MaterialCommunityIcons}
  //           selected={selectedIcon === 'timer'}
  //           onPress={() => setSelectedIcon('timer')}
  //         />
  //         <IconButton
  //           name="notifications"
  //           iconComponent={Ionicons}
  //           selected={selectedIcon === 'notification'}
  //           onPress={() => setSelectedIcon('notification')}
  //         />
  //       </View>
  //       {selectedIcon === 'timer' && <TimerComponent />}
  //       {selectedIcon === 'notification' && <PushNotificationComponent />}
  //     </RBSheet>
  //   );
  // }, [selectedIcon]);

  // Memoize gradient colors based on theme
  const gradientColors = useMemo(() => 
    theme === 'Light' ? LIGHT_GRADIENT : DARK_GRADIENT
  , [theme]);

  // Memoize card image based on theme
  const cardImage = useMemo(() => 
    theme === 'Light' ? IMAGES.card : IMAGES.darkCard
  , [theme]);

  const renderBody = useCallback(
    () => (
      <ScrollView contentContainerStyle={[styles.scrollContainer, {paddingBottom: Math.max(insets.bottom + verticalScale(10), verticalScale(20))}]}>
        <LinearGradient
          colors={gradientColors}
          style={styles.headerContainer}>
          <View style={styles.marginSpacer} />
          <View style={styles.toggleBtnView}>
            <ToggleSwitch
              isOn={theme === 'Dark'}
              onColor="#04041599"
              offColor="#FFFFFF99"
              size="medium"
              onToggle={handleThemeToggle}
            />
          </View>
          <Text style={styles.headerText}></Text>
          <Pressable onPress={navigateToSetAndFolder}>
            <Image
              source={cardImage}
              style={styles.cardImage}
            />
          </Pressable>
        </LinearGradient>
        {tabView()}

        <AdBanner />
      </ScrollView>
    ),
    [theme, gradientColors, cardImage, tabView, handleThemeToggle, navigateToSetAndFolder],
  );

  return (
    <View style={[styles.container, {backgroundColor: themeColor.background}]}>
      <StatusBar translucent backgroundColor={Color.transparent} />

      {renderBody()}
      {/* <CustomeButton
        buttonColor={Color.theme1}
        buttonWidth="80%"
        buttonHeight={scale(45)}
        title="Language"
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={Color.White}
        fontFamily={Font.semiBold}
        marginTop={verticalScale(15)}
        position="absolute"
        bottom={verticalScale(20)}
        alignSelf={'center'}
        onPress={() => navigation.navigate(ScreenName.language)}
      /> */}
    </View>
  );
};

export default React.memo(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  scrollContainer: {
    flexGrow: 1,
    position: 'relative',
  },
  marginSpacer: {
    marginTop: verticalScale(0),
  },
  headerContainer: {
    height: height * 0.415,
  },
  headerText: {
    fontSize: scale(24),
    fontFamily: Font.medium,
    color: Color.White,
    textAlign: 'center',
    marginTop: verticalScale(75),
  },
  cardImage: {
    width: scale(350),
    height: scale(238),
    alignSelf: 'center',
    marginTop: verticalScale(20),
  },
  bottomSheetContainer: {
    alignItems: 'center',
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
  },
  sheetContainer: {
    flexDirection: 'row',
    gap: scale(50),
    marginVertical: verticalScale(15),
  },
  iconBtn: {
    padding: moderateScale(5),
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    borderRadius: scale(5),
    backgroundColor: Color.White,
  },
  iconBtnSelected: {
    backgroundColor: Color.theme1,
  },
  icon: {
    backgroundColor: Color.WhiteDefault,
    padding: moderateScale(5),
    borderRadius: scale(5),
  },
  iconSelected: {
    backgroundColor: Color.theme1,
  },
  tabViewContainer: {
    marginTop: verticalScale(90),
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  tabAiContainer: {
    marginTop: verticalScale(5),
    alignItems: 'center',
  },
  tabRowSecondary: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: verticalScale(15),
    marginHorizontal: scale(10),
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    marginVertical: verticalScale(15),
  },
  tabIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
  },
  tabAi: {
    width: moderateScale(35),
    height: moderateScale(35),
  },
  tabText: {
    fontSize: scale(14),
    fontFamily: Font.medium,
    color: Color.theme1,
    paddingTop: verticalScale(5),
    width: scale(100),
    textAlign: 'center',
  },
  toggleBtnView: {
    position: 'absolute',
    right: moderateScale(20),
    top: moderateScale(50),
  },
});
