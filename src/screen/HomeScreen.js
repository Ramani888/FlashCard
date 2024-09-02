import React, {useCallback, useRef, useState, memo} from 'react';
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Color from '../component/Color';
import {scale, verticalScale} from 'react-native-size-matters';
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
        size={scale(15)}
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
  const [selectedIcon, setSelectedIcon] = useState('timer');

  const icons = {
    earthIcon: require('../Assets/Img/earthIcon.png'),
    clockIcon: require('../Assets/Img/clock.png'),
    userIcon: require('../Assets/Img/user.png'),
  };

  const renderHeaderIcons = useCallback(
    () => (
      <View style={styles.headerIconsContainer}>
        <Pressable>
          <Image source={icons.earthIcon} style={styles.earthIcon} />
        </Pressable>
        <Pressable onPress={() => refRBSheet.current.open()}>
          <Image source={icons.clockIcon} style={styles.earthIcon} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate(ScreenName.profile)}>
          <Image source={icons.userIcon} style={styles.earthIcon} />
        </Pressable>
      </View>
    ),
    [],
  );

  const renderButtons = useCallback(
    () => (
      <View style={styles.buttonsContainer}>
        <Text style={styles.myCardsText}>MY CARDS</Text>
        {['VERSES', 'Q + As', 'GENERAL'].map((title, index) => (
          <CustomeButton
            key={index}
            buttonColor={Color.theme1}
            buttonWidth={scale(310)}
            buttonHeight={scale(45)}
            title={title}
            borderRadius={scale(10)}
            fontSize={scale(15)}
            fontColor={Color.White}
            fontFamily={Font.semiBold}
            marginTop={index === 0 ? verticalScale(25) : verticalScale(15)}
            onPress={() => {
              title == 'VERSES' && navigation.navigate(ScreenName.verses);
              title == 'Q + As' && navigation.navigate(ScreenName.qaScreen);
            }}
          />
        ))}
      </View>
    ),
    [],
  );

  const BottomSheets = useCallback(() => {
    return (
      <RBSheet
        ref={refRBSheet}
        height={verticalScale(375)}
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
      <View>
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
      </View>
    ),
    [renderHeaderIcons, renderButtons, BottomSheets],
  );

  return (
    <View>
      <StatusBar translucent backgroundColor={Color.transparent} />
      {renderBody()}
    </View>
  );
};

export default React.memo(HomeScreen);

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Color.theme1,
    height: verticalScale(290),
  },
  headerIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: scale(170),
    marginTop: verticalScale(55),
    alignSelf: 'center',
  },
  earthIcon: {
    width: scale(50),
    height: scale(50),
  },
  cardImage: {
    width: scale(310),
    height: scale(215),
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
    marginTop: verticalScale(80),
  },
  myCardsText: {
    fontSize: scale(20),
    color: Color.Black,
    fontFamily: Font.medium,
  },
  iconBtn: {
    padding: scale(5),
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    borderRadius: scale(5),
  },
  icon: {
    backgroundColor: Color.WhiteDefault,
    padding: scale(5),
    borderRadius: scale(5),
  },
});
