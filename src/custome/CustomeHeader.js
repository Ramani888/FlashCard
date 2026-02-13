import React, {useRef} from 'react';
import {StyleSheet, Text, Pressable, Image, ActivityIndicator, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from './Responsive';
import Color from '../component/Color';
import Font from '../component/Font';
import {Avatar} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import useTheme from '../component/Theme';
import strings from '../language/strings';
import {Menu, MenuTrigger, MenuOptions} from 'react-native-popup-menu';
import LanguageModalContent from '../component/auth/LanguageModalContent';
import ProfileModalContent from '../component/profile/profile/ProfileModalContent';

const CustomeHeader = ({
  goBack,
  title,
  profileImage,
  profileUrl,
  edit,
  language,
  titleStyle,
  headerBackgroundColor,
  containerStyle,
  avtarContainerStyle,
  iconSize = scale(25),
  iconColor = Color.White,
  iconStyle,
  searchIcon,
  setSearch,
  search,
  plusButton,
  plusIconAction,
  threeDotIcon,
  openSetDetailModal,
  setChangeOrder,
  changeOrder,
  updatePosition,
  saveNote,
  videoIconStyle,
  showVideoAd,
  imageFolder,
  setShowFolder,
  showFolder,
  cancel,
  cancelIconStyle,
  onCancel,
  selectedLanguage,
  setSelectedLanguage,
  updateProfilePic,
  handleLogout,
  openUserNameBottomSheets,
  openEmailBottomSheets,
  handleLanguageSaved,
  adReady,
  adLoading,
}) => {
  const navigation = useNavigation();
  const editRef = useRef(null);
  const threeDotIconRef = useRef(null);
  const colorTheme = useTheme();
  const languageRef = useRef();

  return (
    <LinearGradient
      colors={
        headerBackgroundColor
          ? [
              headerBackgroundColor,
              headerBackgroundColor,
              headerBackgroundColor,
            ]
          : colorTheme.headerTheme
      }
      style={[styles.headerContainer, containerStyle]}>
      {goBack && (
        <Pressable
          onPress={() => {
            if (saveNote) {
              saveNote();
            } else {
              navigation.goBack();
            }
          }}
          style={[styles.iconContainer, iconStyle]}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <AntDesign name="arrowleft" size={iconSize} color={iconColor} />
        </Pressable>
      )}

      {changeOrder && (
        <Pressable
          onPress={() => setChangeOrder(false)}
          style={[styles.iconContainer, iconStyle]}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <AntDesign name="close" size={iconSize} color={iconColor} />
        </Pressable>
      )}
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      {profileImage && (
        <Pressable style={styles.avtarContainer}>
          <Avatar
            size="large"
            rounded
            source={{
              uri: profileUrl ? profileUrl : 'https://example.com/avatar.jpg',
            }}
            title="JD"
            containerStyle={styles.avatar}
          />
        </Pressable>
      )}
      {changeOrder && (
        <Pressable
          style={styles.check}
          onPress={() => {
            updatePosition();
            setChangeOrder(false);
          }}>
          <FontAwesome6 name="check" size={scale(23)} color={Color.White} />
        </Pressable>
      )}
      {searchIcon && (
        <Pressable
          style={[styles.searchIcon, avtarContainerStyle]}
          onPress={() => setSearch(!search)}>
          <AntDesign name="search1" size={scale(20)} color={Color.White} />
        </Pressable>
      )}
      {imageFolder && (
        <Pressable
          style={[styles.adIcon, videoIconStyle, searchIcon ? { top: verticalScale(50), right: scale(60) } : { right: scale(15) }]}
          onPress={() => setShowFolder(!showFolder)}>
          <Image
            source={require('../Assets/Img/imageFolder.png')}
            style={styles.imageFolder}
          />
        </Pressable>
      )}
      {edit && (
        <Menu style={styles.editIcon}>
          <MenuTrigger>
            <AntDesign name="edit" size={scale(20)} color={Color.White} />
          </MenuTrigger>
          <MenuOptions customStyles={{optionsContainer: {borderRadius: scale(10), backgroundColor: colorTheme.modelNewBackground}}}>
            <ProfileModalContent
              openUserNameBottomSheets={openUserNameBottomSheets}
              openEmailBottomSheets={openEmailBottomSheets}
              updateProfilePic={updateProfilePic}
              handleLogout={handleLogout}
              colorTheme={colorTheme}
            />
          </MenuOptions>
        </Menu>
      )}
      {language && (
        <Menu style={styles.languageFlag}>
          <MenuTrigger>
            <Image source={selectedLanguage?.flag} style={styles.flagImage} />
          </MenuTrigger>
          <MenuOptions customStyles={{optionsContainer: {borderRadius: scale(10), backgroundColor: colorTheme.modelNewBackground}}}>
            <LanguageModalContent
              setSelectedLanguage={setSelectedLanguage}
              selectedLanguage={selectedLanguage}
              handleLanguageSaved={handleLanguageSaved}
            />
          </MenuOptions>
        </Menu>
      )}
      {plusButton && (
        <Pressable style={styles.plusButton} onPress={plusIconAction}>
          <Entypo name="plus" size={scale(20)} color={Color.White} />
        </Pressable>
      )}
      {title === strings.homeTab2 && (
        <Pressable
          style={[
            styles.adIcon, 
            videoIconStyle,
            !adReady && styles.adIconDisabled
          ]}
          onPress={() => adReady && showVideoAd()}
          disabled={!adReady}>
          {adLoading ? (
            <View style={styles.adLoadingContainer}>
              <ActivityIndicator size="small" color={Color.White} />
            </View>
          ) : (
            <Image
              source={require('../Assets/Img/adsIcon.jpg')}
              style={[
                styles.adImageIcon,
                !adReady && styles.adImageIconDisabled
              ]}
            />
          )}
        </Pressable>
      )}
      {threeDotIcon && (
        <Pressable
          ref={threeDotIconRef}
          onPress={() => openSetDetailModal(threeDotIconRef)}
          style={[styles.dotIconView, iconStyle]}>
          <Entypo
            name="dots-three-vertical"
            size={scale(13)}
            color={Color.White}
            style={styles.dotsIcon}
          />
        </Pressable>
      )}
      {cancel && (
        <Pressable
          style={[styles.adIcon, videoIconStyle]}
          onPress={() => onCancel()}>
          <AntDesign
            name="close"
            size={scale(20)}
            color={Color.White}
            style={[styles.dotsIcon, cancelIconStyle]}
          />
        </Pressable>
      )}
    </LinearGradient>
  );
};

export default React.memo(CustomeHeader);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(60),
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    backgroundColor: Color.White,
  },
  iconContainer: {
    padding: scale(5),
    position: 'absolute',
    left: scale(10),
    paddingBottom: verticalScale(15),
    zIndex: 1,
  },
  title: {
    fontSize: scale(15),
    color: Color.White,
    fontFamily: Font.medium,
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    paddingBottom: verticalScale(12),
  },
  searchIcon: {
    backgroundColor: Color.iconBackground,
    borderRadius: scale(5),
    position: 'absolute',
    right: scale(15),
    bottom: verticalScale(7),
    padding: scale(10),
    elevation: scale(5),
  },
  avtarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    top: verticalScale(15),
    paddingTop: verticalScale(25),
  },
  avatar: {
    backgroundColor: '#BDBDBD',
  },
  editIcon: {
    position: 'absolute',
    right: scale(15),
    bottom: verticalScale(12),
  },
  plusButton: {
    backgroundColor: Color.theme1,
    height: scale(35),
    width: scale(35),
    borderRadius: scale(5),
    position: 'absolute',
    right: scale(15),
    bottom: verticalScale(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotIconView: {
    position: 'absolute',
    right: scale(15),
    top: verticalScale(50),
  },
  dotsIcon: {
    backgroundColor: Color.iconBackground,
    borderRadius: scale(5),
    padding: scale(10),
    marginBottom: verticalScale(5),
  },
  check: {position: 'absolute', right: scale(15), top: verticalScale(54)},
  adImageIcon: {width: scale(28), height: scale(28), borderRadius: scale(4)},
  adImageIconDisabled: {opacity: 0.5},
  adIcon: {position: 'absolute', right: scale(20), top: verticalScale(45)},
  adIconDisabled: {opacity: 0.7},
  adLoadingContainer: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(4),
    backgroundColor: Color.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageFolder: {
    width: scale(48),
    height: scale(48),
    marginTop: verticalScale(-3),
  },
  languageFlag: {
    position: 'absolute',
    right: scale(50),
    bottom: verticalScale(12),
  },
  flagImage: {width: scale(36), height: scale(24)},
});
