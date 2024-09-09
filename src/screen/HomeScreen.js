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
} from 'react-native';
import Color from '../component/Color';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import Font from '../component/Font';
import CustomeButton from '../custome/CustomeButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import TimerComponent from '../component/homescreen/TimerComponent';
import PushNotificationComponent from '../component/homescreen/PushNotificationComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../component/Screen';
import {apiGet} from '../Api/ApiService';
import Api from '../Api/EndPoint';
import Loader from '../component/Loader';

const {width, height} = Dimensions.get('window');

const IconButton = memo(({name, iconComponent, selected, onPress}) => {
  const Icon = iconComponent;

  return (
    <Pressable
      style={[
        styles.iconBtn,
        {backgroundColor: selected ? Color.theme1 : Color.White},
      ]}
      onPress={onPress}>
      <Icon
        name={name}
        size={moderateScale(15)}
        color={selected ? Color.White : Color.theme1}
        style={[
          styles.icon,
          {backgroundColor: selected ? Color.theme1 : Color.WhiteDefault},
        ]}
      />
    </Pressable>
  );
});

const HomeScreen = () => {
  const refRBSheet = useRef();
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [cardTypeData, setCardTypeData] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState('timer');

  useEffect(() => {
    getCardType();
  }, []);

  // ===================================== Api ===================================== //

  const getCardType = async () => {
    try {
      setVisible(true);
      const response = await apiGet(Api.getCardType, '');
      setCardTypeData(response);
    } catch (error) {
      console.log('error in cardType Data', error);
    } finally {
      setVisible(false);
    }
  };

  // ===================================== End ===================================== //

  const icons = {
    earthIcon: require('../Assets/Img/earthIcon.png'),
    clockIcon: require('../Assets/Img/clock.png'),
    userIcon: require('../Assets/Img/user.png'),
  };

  const renderHeaderIcons = useCallback(
    () => (
      <View style={styles.headerIconsContainer}>
        <Pressable onPress={() => refRBSheet.current.open()}>
          <Image source={icons.clockIcon} style={styles.iconTop} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate(ScreenName.profile)}>
          <Image source={icons.userIcon} style={styles.iconTop} />
        </Pressable>
      </View>
    ),
    [],
  );

  const renderButtons = useCallback(
    () => (
      <View style={styles.buttonsContainer}>
        <Text style={styles.myCardsText}>MY CARDS</Text>
        {cardTypeData.map((item, index) => (
          <CustomeButton
            key={index}
            buttonColor={Color.theme1}
            buttonWidth={width * 0.85}
            buttonHeight={height * 0.06}
            title={item?.name}
            borderRadius={moderateScale(10)}
            fontSize={moderateScale(15)}
            fontColor={Color.White}
            fontFamily={Font.semiBold}
            marginTop={index === 0 ? verticalScale(25) : verticalScale(15)}
            onPress={() => {
              item?.name === 'VERSES' &&
                navigation.navigate(ScreenName.cardTypeWiseFolderAndSet, {
                  cartTypeName: item?.name,
                  cardTypeId: item?._id,
                });
              item?.name === 'Q + A’s' &&
                navigation.navigate(ScreenName.cardTypeWiseFolderAndSet, {
                  cartTypeName: item?.name,
                  cardTypeId: item?._id,
                });
              item?.name === 'GENERAL' &&
                navigation.navigate(ScreenName.cardTypeWiseFolderAndSet, {
                  cartTypeName: item?.name,
                  cardTypeId: item?._id,
                });
            }}
          />
        ))}
      </View>
    ),
    [cardTypeData],
  );

  const BottomSheets = useCallback(() => {
    return (
      <RBSheet
        ref={refRBSheet}
        height={height * 0.57} // Responsive height
        openDuration={250}
        draggable={true}
        customStyles={{
          container: styles.bottomSheetContainer,
        }}>
        <View style={styles.sheetContainer}>
          <IconButton
            name="clock"
            iconComponent={MaterialCommunityIcons}
            selected={selectedIcon === 'timer'}
            onPress={() => setSelectedIcon('timer')}
          />
          <IconButton
            name="notifications"
            iconComponent={Ionicons}
            selected={selectedIcon === 'notification'}
            onPress={() => setSelectedIcon('notification')}
          />
        </View>
        {selectedIcon === 'timer' && <TimerComponent />}
        {selectedIcon === 'notification' && <PushNotificationComponent />}
      </RBSheet>
    );
  }, [selectedIcon]);

  const renderBody = useCallback(
    () => (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
          style={styles.headerContainer}>
          {renderHeaderIcons()}
          <Image
            source={require('../Assets/Img/card.png')}
            style={styles.cardImage}
          />
        </LinearGradient>
        {renderButtons()}
        {BottomSheets()}
      </ScrollView>
    ),
    [renderHeaderIcons, renderButtons, BottomSheets, cardTypeData],
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={Color.transparent} />
      <Loader visible={visible} />
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
  headerIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: scale(85),
    marginTop: verticalScale(55),
    alignSelf: 'center',
  },
  iconTop: {
    width: scale(40),
    height: scale(40),
  },
  cardImage: {
    width: width * 0.85,
    height: verticalScale(215),
    alignSelf: 'center',
    marginTop: verticalScale(25),
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
  buttonsContainer: {
    alignItems: 'center',
    marginTop: moderateScale(70),
  },
  myCardsText: {
    fontSize: moderateScale(20),
    color: Color.Black,
    fontFamily: Font.medium,
  },
  iconBtn: {
    padding: moderateScale(5),
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    borderRadius: scale(5),
  },
  icon: {
    backgroundColor: Color.WhiteDefault,
    padding: moderateScale(5),
    borderRadius: scale(5),
  },
});
