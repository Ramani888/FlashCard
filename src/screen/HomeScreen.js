import React, {useCallback, useRef, useState, memo, useEffect} from 'react';
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import Color from '../component/Color';
import { scale,verticalScale,moderateScale } from '../custome/Responsive';
import Font from '../component/Font';
import RBSheet from 'react-native-raw-bottom-sheet';
import TimerComponent from '../component/homescreen/TimerComponent';
import PushNotificationComponent from '../component/homescreen/PushNotificationComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ScreenName} from '../component/Screen';
import {apiGet} from '../Api/ApiService';
import Api from '../Api/EndPoint';
import Loader from '../component/Loader';
import AIScreen from '../component/AIScreen';
import {useDispatch} from 'react-redux';
import BannerAds from './BannerAds';

const {width, height} = Dimensions.get('window');

const IconButton = memo(({name, iconComponent, selected, onPress}) => {
  const Icon = iconComponent;

  return (
    <Pressable
      style={[styles.iconBtn, selected && styles.iconBtnSelected]}
      onPress={onPress}>
      <Icon
        name={name}
        size={moderateScale(15)}
        color={selected ? Color.White : Color.theme1}
        style={[styles.icon, selected && styles.iconSelected]}
      />
    </Pressable>
  );
});

const HomeScreen = () => {
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const navigation = useNavigation();
  const [cardTypeData, setCardTypeData] = useState([]);

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

  const tabView = () => {
    return (
      <View style={styles.tabViewContainer}>
        <View style={styles.tabRow}>
          <Pressable
            style={styles.tabContainer}
            onPress={() => navigation.navigate(ScreenName.profile)}>
            <Image
              source={require('../Assets/Img/account.png')}
              style={styles.tabIcon}
            />
            <Text style={styles.tabText}>Account</Text>
          </Pressable>

          <Pressable
            style={styles.tabAiContainer}
            onPress={() => navigation.navigate(ScreenName.aiScreen)}>
            <Image
              source={require('../Assets/Img/aiIcon.png')}
              style={styles.tabAi}
            />
            <Text style={styles.tabText}>AI</Text>
          </Pressable>

          <Pressable
            style={styles.tabContainer}
            onPress={() => navigation.navigate(ScreenName.notes)}>
            <Image
              source={require('../Assets/Img/notes.png')}
              style={styles.tabIcon}
              tintColor={Color.theme1}
            />
            <Text style={styles.tabText}>Notes</Text>
          </Pressable>
        </View>

        <View style={styles.tabRowSecondary}>
          <Pressable
            style={styles.tabContainer}
            onPress={() => navigation.navigate(ScreenName.pdf)}>
            <Image
              source={require('../Assets/Img/pdf.png')}
              style={styles.tabIcon}
              tintColor={Color.theme1}
            />
            <Text style={styles.tabText}>PDF's</Text>
          </Pressable>

          <Pressable
            style={styles.tabContainer}
            onPress={() => navigation.navigate(ScreenName.image)}>
            <Image
              source={require('../Assets/Img/images.png')}
              style={styles.tabIcon}
              tintColor={Color.theme1}
            />
            <Text style={styles.tabText}>Images</Text>
          </Pressable>
        </View>

        {/* <BannerAds/> */}
      </View>
    );
  };

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

  const renderBody = useCallback(
    () => (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
          style={styles.headerContainer}>
          <Text style={styles.headerText}>MY CARDS</Text>
          <Pressable
            onPress={() => navigation.navigate(ScreenName.setAndFolder)}>
            <Image
              source={require('../Assets/Img/card.png')}
              style={styles.cardImage}
            />
          </Pressable>
        </LinearGradient>
        {tabView()}
        {/* 
        <Image
          source={require('../Assets/Img/ads.png')}
          style={styles.adsImage}
          resizeMode="contain"
        /> */}
      </ScrollView>
    ),
    [cardTypeData],
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={Color.transparent} />

      {renderBody()}
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
  },
  headerContainer: {
    height: height * 0.415,
  },
  headerText: {
    fontSize: scale(20),
    fontFamily: Font.medium,
    color: Color.White,
    textAlign: 'center',
    marginTop: verticalScale(65),
  },
  cardImage: {
    width: width * 0.85,
    height: verticalScale(215),
    alignSelf: 'center',
    marginTop: verticalScale(15),
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
    marginTop: verticalScale(75),
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: scale(400),
    alignSelf: 'center',
  },
  tabAiContainer: {
    marginTop: verticalScale(5),
    alignItems: 'center',
  },
  tabRowSecondary: {
    flexDirection: 'row',
    width: scale(250),
    alignSelf: 'center',
    marginTop: verticalScale(15),
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
  },
  adsImage: {
    width: '100%',
    height: verticalScale(50),
    position: 'absolute',
    bottom: verticalScale(30),
  },
});
