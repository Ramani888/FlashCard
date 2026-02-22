import React, {useRef, useMemo, useCallback, useState} from 'react';
import {StyleSheet, Text, Pressable, Image, ActivityIndicator, View} from 'react-native';
import PropTypes from 'prop-types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {Avatar} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import {Menu, MenuTrigger, MenuOptions} from 'react-native-popup-menu';
import ToggleSwitch from 'toggle-switch-react-native';
import {scale, verticalScale} from './Responsive';
import Color from '../component/Color';
import Font from '../component/Font';
import useTheme from '../component/Theme';
import strings from '../language/strings';
import LanguageModalContent from '../component/auth/LanguageModalContent';
import ProfileModalContent from '../component/profile/profile/ProfileModalContent';
import {ScreenName} from '../component/Screen';
import useThemeToggle from '../hooks/useThemeToggle';
import ConfirmationDialog from './ConfirmationDialog';

// Constants
const HIT_SLOP = {top: 10, bottom: 10, left: 10, right: 10};
const DEFAULT_AVATAR_URL = 'https://example.com/avatar.jpg';
const ICON_SIZE_DEFAULT = scale(25);
const ADS_ICON = require('../Assets/Img/adsIcon.jpg');

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
  iconSize = ICON_SIZE_DEFAULT,
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
  handleLogout,
  handleDeleteAccount,
  handleLanguageSaved,
  adReady,
  adLoading,
  isSetAndFolder
}) => {
  const navigation = useNavigation();
  const threeDotIconRef = useRef(null);
  const colorTheme = useTheme();
  const {isDarkMode, toggleTheme} = useThemeToggle();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);

  // Memoize gradient colors
  const gradientColors = useMemo(() => {
    if (headerBackgroundColor) {
      return [headerBackgroundColor, headerBackgroundColor, headerBackgroundColor];
    }
    return colorTheme.headerTheme;
  }, [headerBackgroundColor, colorTheme.headerTheme]);

  // Memoize menu options style
  const menuOptionsStyle = useMemo(() => ({
    optionsContainer: {
      borderRadius: scale(10), 
      backgroundColor: colorTheme.modelNewBackground
    }
  }), [colorTheme.modelNewBackground]);

  // Memoize avatar source
  const avatarSource = useMemo(() => ({
    uri: profileUrl || DEFAULT_AVATAR_URL
  }), [profileUrl]);

  // Memoize ad icon style
  const adIconComputedStyle = useMemo(() => [
    styles.adIcon, 
    videoIconStyle,
    !adReady && styles.adIconDisabled
  ], [videoIconStyle, adReady]);

  const adImageComputedStyle = useMemo(() => [
    styles.adImageIcon,
    !adReady && styles.adImageIconDisabled
  ], [adReady]);

  // Handle back press
  const handleBackPress = useCallback(() => {
    if (saveNote) {
      saveNote();
    } else {
      navigation.goBack();
    }
  }, [saveNote, navigation]);

  // Search toggle handlers
  const handleSearchToggle = useCallback(() => {
    setSearch(!search);
  }, [setSearch, search]);

  const handleFolderToggle = useCallback(() => {
    setShowFolder(!showFolder);
  }, [setShowFolder, showFolder]);

  // Change order handlers
  const handleCloseChangeOrder = useCallback(() => {
    setChangeOrder(false);
  }, [setChangeOrder]);

  const handleConfirmChangeOrder = useCallback(() => {
    updatePosition();
    setChangeOrder(false);
  }, [updatePosition, setChangeOrder]);

  // Logout handlers
  const onLogoutPress = useCallback(() => {
    setShowLogoutDialog(true);
  }, []);

  const confirmLogout = useCallback(() => {
    handleLogout();
    setShowLogoutDialog(false);
  }, [handleLogout]);

  const closeLogoutDialog = useCallback(() => {
    setShowLogoutDialog(false);
  }, []);

  // Delete account handlers
  const onDeleteAccountPress = useCallback(() => {
    setShowDeleteAccountDialog(true);
  }, []);

  const confirmDeleteAccount = useCallback(() => {
    handleDeleteAccount();
    setShowDeleteAccountDialog(false);
  }, [handleDeleteAccount]);

  const closeDeleteAccountDialog = useCallback(() => {
    setShowDeleteAccountDialog(false);
  }, []);

  // Navigation handlers
  const navigateToProfile = useCallback(() => {
    navigation.navigate(ScreenName.profile);
  }, [navigation]);

  const navigateToNotes = useCallback(() => {
    navigation.navigate(ScreenName.notes);
  }, [navigation]);

  // Ad handler
  const handleAdPress = useCallback(() => {
    if (adReady) {
      showVideoAd();
    }
  }, [adReady, showVideoAd]);

  // Three dot handler
  const handleThreeDotPress = useCallback(() => {
    openSetDetailModal(threeDotIconRef);
  }, [openSetDetailModal]);

  return (
    <LinearGradient colors={gradientColors} style={[styles.headerContainer, containerStyle]}>
      {/* Back Button */}
      {goBack && !changeOrder && (
        <Pressable
          onPress={handleBackPress}
          style={[styles.backIconContainer, iconStyle]}
          hitSlop={HIT_SLOP}>
          <AntDesign name="arrowleft" size={iconSize} color={iconColor} />
        </Pressable>
      )}

      {/* Change Order Close Button */}
      {changeOrder && (
        <Pressable
          onPress={handleCloseChangeOrder}
          style={[styles.backIconContainer, iconStyle]}
          hitSlop={HIT_SLOP}>
          <AntDesign name="close" size={iconSize} color={iconColor} />
        </Pressable>
      )}

      {/* Title */}
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}

      {/* Profile Image */}
      {profileImage && (
        <Pressable style={styles.avtarContainer}>
          <Avatar
            size="large"
            rounded
            source={avatarSource}
            title="JD"
            containerStyle={styles.avatar}
          />
        </Pressable>
      )}

      {/* Change Order Confirm Button */}
      {changeOrder && (
        <Pressable style={styles.check} onPress={handleConfirmChangeOrder}>
          <FontAwesome6 name="check" size={scale(23)} color={Color.White} />
        </Pressable>
      )}

      {/* Search Icon (standalone) */}
      {searchIcon && !isSetAndFolder && (
        <Pressable
          style={[styles.searchIcon, avtarContainerStyle]}
          onPress={handleSearchToggle}>
          <AntDesign name="search1" size={scale(20)} color={Color.White} />
        </Pressable>
      )}

      {/* Edit Profile Menu */}
      {edit && (
        <Menu style={styles.editIcon}>
          <MenuTrigger>
            <AntDesign name="edit" size={scale(20)} color={Color.White} />
          </MenuTrigger>
          <MenuOptions customStyles={menuOptionsStyle}>
            <ProfileModalContent
              onLogoutPress={onLogoutPress}
              onDeleteAccountPress={onDeleteAccountPress}
              colorTheme={colorTheme}
            />
          </MenuOptions>
        </Menu>
      )}

      {/* Language Selector */}
      {language && (
        <Menu style={styles.languageFlag}>
          <MenuTrigger>
            <Image source={selectedLanguage?.flag} style={styles.flagImage} />
          </MenuTrigger>
          <MenuOptions customStyles={menuOptionsStyle}>
            <LanguageModalContent
              setSelectedLanguage={setSelectedLanguage}
              selectedLanguage={selectedLanguage}
              handleLanguageSaved={handleLanguageSaved}
            />
          </MenuOptions>
        </Menu>
      )}

      {/* Plus Button */}
      {plusButton && (
        <Pressable style={styles.plusButton} onPress={plusIconAction}>
          <Entypo name="plus" size={scale(20)} color={Color.White} />
        </Pressable>
      )}

      {/* Ad Button */}
      {title === strings.homeTab2 && (
        <Pressable
          style={adIconComputedStyle}
          onPress={handleAdPress}
          disabled={!adReady}>
          {adLoading ? (
            <View style={styles.adLoadingContainer}>
              <ActivityIndicator size="small" color={Color.White} />
            </View>
          ) : (
            <Image source={ADS_ICON} style={adImageComputedStyle} />
          )}
        </Pressable>
      )}

      {/* Three Dot Menu */}
      {threeDotIcon && (
        <Pressable
          ref={threeDotIconRef}
          onPress={handleThreeDotPress}
          style={[styles.dotIconView, iconStyle]}>
          <Entypo
            name="dots-three-vertical"
            size={scale(13)}
            color={Color.White}
            style={styles.dotsIcon}
          />
        </Pressable>
      )}

      {/* Cancel Button */}
      {cancel && (
        <Pressable style={[styles.adIcon, videoIconStyle]} onPress={onCancel}>
          <AntDesign
            name="close"
            size={scale(20)}
            color={Color.White}
            style={[styles.dotsIcon, cancelIconStyle]}
          />
        </Pressable>
      )}

      {/* Set and Folder Actions */}
      {isSetAndFolder && (
        <View style={styles.iconWrapper}>
          <ToggleSwitch
            isOn={isDarkMode}
            onColor="#04041599"
            offColor="#FFFFFF99"
            size="medium"
            onToggle={toggleTheme}
          />

          <Pressable style={styles.headerActionIcon} onPress={navigateToProfile}>
            <AntDesign name="user" size={scale(20)} color={Color.White} />
          </Pressable>

          <Pressable style={styles.headerActionIcon} onPress={navigateToNotes}>
            <Ionicons name="reader-outline" size={scale(20)} color={Color.White} />
          </Pressable>

          {imageFolder && (
            <Pressable style={styles.headerActionIcon} onPress={handleFolderToggle}>
              <Feather name="folder-minus" size={scale(20)} color={Color.White} />
            </Pressable>
          )}
          
          <Pressable style={styles.headerActionIcon} onPress={handleSearchToggle}>
            <AntDesign name="search1" size={scale(20)} color={Color.White} />
          </Pressable>
        </View>
      )}

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        isVisible={showLogoutDialog}
        title={strings.logout || 'Logout'}
        message={strings.logoutConfirmMessage || 'Are you sure you want to logout from your account?'}
        confirmText={strings.logout || 'Logout'}
        cancelText={strings.cancel}
        isDanger={false}
        onConfirm={confirmLogout}
        onCancel={closeLogoutDialog}
      />

      {/* Delete Account Confirmation Dialog */}
      <ConfirmationDialog
        isVisible={showDeleteAccountDialog}
        title={strings.deleteAccountConfirmTitle || 'Delete Account'}
        message={strings.deleteAccountConfirmMessage}
        confirmText={strings.delete}
        cancelText={strings.cancel}
        isDanger={true}
        onConfirm={confirmDeleteAccount}
        onCancel={closeDeleteAccountDialog}
      />
    </LinearGradient>
  );
};

// PropTypes for type safety
CustomeHeader.propTypes = {
  goBack: PropTypes.bool,
  title: PropTypes.string,
  profileImage: PropTypes.bool,
  profileUrl: PropTypes.string,
  edit: PropTypes.bool,
  language: PropTypes.bool,
  titleStyle: PropTypes.object,
  headerBackgroundColor: PropTypes.string,
  containerStyle: PropTypes.object,
  avtarContainerStyle: PropTypes.object,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  iconStyle: PropTypes.object,
  searchIcon: PropTypes.bool,
  setSearch: PropTypes.func,
  search: PropTypes.bool,
  plusButton: PropTypes.bool,
  plusIconAction: PropTypes.func,
  threeDotIcon: PropTypes.bool,
  openSetDetailModal: PropTypes.func,
  setChangeOrder: PropTypes.func,
  changeOrder: PropTypes.bool,
  updatePosition: PropTypes.func,
  saveNote: PropTypes.func,
  videoIconStyle: PropTypes.object,
  showVideoAd: PropTypes.func,
  imageFolder: PropTypes.bool,
  setShowFolder: PropTypes.func,
  showFolder: PropTypes.bool,
  cancel: PropTypes.bool,
  cancelIconStyle: PropTypes.object,
  onCancel: PropTypes.func,
  selectedLanguage: PropTypes.object,
  setSelectedLanguage: PropTypes.func,
  handleLogout: PropTypes.func,
  handleDeleteAccount: PropTypes.func,
  handleLanguageSaved: PropTypes.func,
  adReady: PropTypes.bool,
  adLoading: PropTypes.bool,
  isSetAndFolder: PropTypes.bool,
};

// Custom comparison function for React.memo
const arePropsEqual = (prevProps, nextProps) => {
  // If these key props change, re-render
  if (
    prevProps.title !== nextProps.title ||
    prevProps.goBack !== nextProps.goBack ||
    prevProps.changeOrder !== nextProps.changeOrder ||
    prevProps.search !== nextProps.search ||
    prevProps.showFolder !== nextProps.showFolder ||
    prevProps.adReady !== nextProps.adReady ||
    prevProps.adLoading !== nextProps.adLoading ||
    prevProps.profileUrl !== nextProps.profileUrl ||
    prevProps.searchIcon !== nextProps.searchIcon ||
    prevProps.isSetAndFolder !== nextProps.isSetAndFolder ||
    prevProps.edit !== nextProps.edit ||
    prevProps.language !== nextProps.language ||
    prevProps.plusButton !== nextProps.plusButton ||
    prevProps.threeDotIcon !== nextProps.threeDotIcon ||
    prevProps.cancel !== nextProps.cancel ||
    prevProps.imageFolder !== nextProps.imageFolder ||
    prevProps.profileImage !== nextProps.profileImage
  ) {
    return false;
  }

  // Check if selectedLanguage changed
  if (prevProps.selectedLanguage?.flag !== nextProps.selectedLanguage?.flag) {
    return false;
  }

  // Props are equal, skip re-render
  return true;
};

export default React.memo(CustomeHeader, arePropsEqual);

const styles = StyleSheet.create({
  // Container
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(60),
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    backgroundColor: Color.White,
  },
  
  // Navigation Icons
  backIconContainer: {
    padding: scale(5),
    position: 'absolute',
    left: scale(10),
    paddingBottom: verticalScale(15),
    zIndex: 1,
  },
  check: {
    position: 'absolute', 
    right: scale(15), 
    top: verticalScale(54)
  },
  
  // Title
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
  
  // Avatar
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
  
  // Action Icons Wrapper
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: scale(20),
    paddingRight: scale(20),
    width: '100%',
  },
  headerActionIcon: {
    backgroundColor: Color.iconBackground,
    borderRadius: scale(12),
    padding: scale(10),
    elevation: scale(5),
  },
  
  // Single Action Icons
  searchIcon: {
    backgroundColor: Color.iconBackground,
    borderRadius: scale(5),
    position: 'absolute',
    right: scale(15),
    bottom: verticalScale(7),
    padding: scale(10),
    elevation: scale(5),
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
  
  // Three Dots Menu
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
  
  // Ad Related
  adIcon: {
    position: 'absolute', 
    right: scale(20), 
    top: verticalScale(45)
  },
  adIconDisabled: {
    opacity: 0.7
  },
  adImageIcon: {
    width: scale(28), 
    height: scale(28), 
    borderRadius: scale(4)
  },
  adImageIconDisabled: {
    opacity: 0.5
  },
  adLoadingContainer: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(4),
    backgroundColor: Color.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Language Flag
  languageFlag: {
    position: 'absolute',
    right: scale(50),
    bottom: verticalScale(12),
  },
  flagImage: {
    width: scale(36), 
    height: scale(24)
  },
});
