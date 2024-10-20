import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Color from '../../component/Color';
import CustomeHeader from '../../custome/CustomeHeader';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import Font from '../../component/Font';
import CustomeInputField from '../../custome/CustomeInputField';
import CustomeModal from '../../custome/CustomeModal';
import ProfileModalContent from '../../component/profile/profile/ProfileModalContent';
import RBSheet from 'react-native-raw-bottom-sheet';
import UserNameBottomSheetsContent from '../../component/profile/profile/UserNameBottomSheetsContent';
import EmailBottomSheetsContent from '../../component/profile/profile/EmailBottomSheetsContent';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../../component/Screen';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import Loader from '../../component/Loader';
import CustomeButton from '../../custome/CustomeButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiPost, apiPut} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import * as Progress from 'react-native-progress';

const {width, height} = Dimensions.get('window');

const tabData = [
  {tabname: 'Contacts', image: require('../../Assets/Img/userIcon.png')},
  {tabname: 'Cloud', image: require('../../Assets/Img/cloud.png')},
  {tabname: 'Support', image: require('../../Assets/Img/support.png')},
  {tabname: 'Privacy & Terms', image: require('../../Assets/Img/privacy.png')},
  {tabname: 'About Us', image: require('../../Assets/Img/notes.png')},
];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [profileUpdate, setProfileUpdate] = useState(false);
  const refUserNameRBSheet = useRef();
  const refEmailRBSheet = useRef();

  useEffect(() => {
    setEmail(global.user?.email);
    setUserName(global.user?.userName);
  }, []);

  // =================================== Api =================================== //

  const updateProfilePic = async file => {
    var formdata = new FormData();
    formdata.append('picture', file);
    formdata.append('_id', global.user?._id);
    try {
      setVisible(true);
      const response = await apiPut(Api.profilePic, '', formdata);
      if (response?.success == true) {
        showMessageonTheScreen(response?.message);
        global.user = response.user;
        setProfileUpdate(true);
      }
    } catch (error) {
      console.log('error in updateProfilePicture api', error);
    } finally {
      setVisible(false);
    }
  };

  // =================================== End =================================== //

  const openModal = useCallback(ref => {
    if (ref.current) {
      ref.current.measureInWindow((x, y, width, height) => {
        setModalPosition({x: x - width * 5, y: y + height + 10});
        setModalVisible(true);
      });
    }
  }, []);

  const closeModal = useCallback(() => setModalVisible(false), []);

  const openUserNameBottomSheets = () => {
    refUserNameRBSheet.current.open();
  };

  const closeUserNameBottomSheet = () => {
    refUserNameRBSheet.current.close();
  };

  const openEmailBottomSheets = () => {
    refEmailRBSheet.current.open();
  };

  const closeEmailBottomSheet = () => {
    refEmailRBSheet.current.close();
  };

  const handleTabPress = tabname => {
    tabname == 'Contacts' && navigation.navigate(ScreenName.contact);
    tabname == 'Support' && navigation.navigate(ScreenName.support);
    // tabname == 'Cloud' && navigation.navigate(ScreenName.cloud);
    tabname == 'Privacy & Terms' && navigation.navigate(ScreenName.privacy);
    tabname == 'About Us' && navigation.navigate(ScreenName.aboutUs);
  };

  const handleLogout = async () => {
    try {
      setVisible(true);
      const user = await AsyncStorage.removeItem('user');
      showMessageonTheScreen('User Logout Successfully');
      global.user = user;
      navigation.navigate(ScreenName.signIn);
    } catch (error) {
      console.log('error in logout', error);
    } finally {
      setVisible(false);
    }
  };

  const renderHeader = useCallback(() => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        profileImage={true}
        profileUrl={global.user?.picture}
        edit={true}
        containerStyle={styles.headerStyle}
        openEditModal={openModal}
      />
    );
  }, [profileUpdate]);

  const renderTab = useCallback(({item}) => {
    const privacyTab = item.tabname === 'Privacy & Terms';
    const aboutUsTab = item.tabname === 'About Us';
    return (
      <Pressable
        style={[
          styles.tabContainer,
          privacyTab && styles.privacyTab,
          aboutUsTab && styles.aboutUsTab,
        ]}
        onPress={() => handleTabPress(item?.tabname)}>
        <Image
          source={item?.image}
          style={styles.tabIcon}
          tintColor={Color.White}
          resizeMode="contain"
        />
        <Text style={styles.tabText}>{item?.tabname}</Text>
      </Pressable>
    );
  }, []);

  const userNameBottomSheets = useCallback(() => {
    return (
      <RBSheet
        ref={refUserNameRBSheet}
        height={height * 0.34}
        openDuration={250}
        draggable={true}
        customStyles={{
          container: styles.bottomSheetContainer,
          draggableIcon: styles.dragableIcon,
        }}>
        <View style={styles.sheetContainer}>
          <UserNameBottomSheetsContent
            closeUserNameBottomSheet={closeUserNameBottomSheet}
          />
        </View>
      </RBSheet>
    );
  }, []);

  const emailBottomSheets = useCallback(() => {
    return (
      <RBSheet
        ref={refEmailRBSheet}
        height={height * 0.6}
        openDuration={250}
        draggable={true}
        customStyles={{
          container: styles.bottomSheetContainer,
          draggableIcon: styles.dragableIcon,
        }}>
        <View style={styles.sheetContainer}>
          <EmailBottomSheetsContent
            closeEmailBottomSheet={closeEmailBottomSheet}
          />
        </View>
      </RBSheet>
    );
  }, []);

  const currentStorage = 2.3;
  const totalStorage = 3;

  const progress = currentStorage / totalStorage;

  return (
    <LinearGradient
      colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
      style={styles.container}>
      <StatusBar translucent backgroundColor={Color.transparent} />
      <Loader visible={visible} />
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {renderHeader()}

        <View style={styles.bodyContainer}>
          <View>
            <Text style={styles.label}>Username</Text>
            <CustomeInputField
              placeholder="Username"
              placeholderTextColor={Color.mediumGray}
              onChangeText={setUserName}
              value={username}
              editable={false}
              borderWidth={1}
              borderColor={Color.LightGray}
              height={scale(40)}
              marginTop={verticalScale(5)}
              width="100%"
              inputContainerStyles={styles.inputContainer}
              inputStyles={styles.inputStyles}
            />
          </View>

          <View>
            <Text style={styles.label}>Email</Text>
            <CustomeInputField
              placeholder="Email"
              placeholderTextColor={Color.mediumGray}
              onChangeText={setEmail}
              value={email}
              editable={false}
              borderWidth={1}
              borderColor={Color.LightGray}
              height={scale(40)}
              marginTop={verticalScale(5)}
              width="100%"
              inputContainerStyles={styles.inputContainer}
              inputStyles={styles.inputStyles}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.subscriptionContainer}>
            <View style={styles.subscriptionBoxContainer}>
              <Text style={styles.subscriptionText}>Subscription</Text>
              <Pressable
                style={styles.subscriptionBox}
                onPress={() => navigation.navigate(ScreenName.subscription)}>
                <Image
                  source={require('../../Assets/Img/subscription.png')}
                  style={styles.subscriptionImage}
                />
                <Text style={styles.subscriptionTier}>TIER 1</Text>
              </Pressable>
            </View>
            <View style={styles.subscriptionRightView}>
              <View style={styles.aiCreditsContainer}>
                <Text style={styles.aiCreditsText}>AI CREDITS</Text>
                <Text style={styles.aiCreditsText}>50</Text>
              </View>
              <View style={styles.aiCreditsContainer}>
                <Text style={styles.aiCreditsText}>
                  STORAGE ({currentStorage}/{totalStorage} GB)
                </Text>
                <Progress.Bar
                  progress={progress}
                  width={150}
                  style={{marginTop: verticalScale(10)}}
                  color={Color.theme1}
                  height={verticalScale(15)}
                />
              </View>
            </View>
          </View>

          <View style={styles.separator} />
        </View>

        <FlatList
          data={tabData}
          renderItem={renderTab}
          numColumns={3}
          key={'_'}
          contentContainerStyle={{
            paddingHorizontal: scale(15),
            marginTop: verticalScale(20),
          }}
        />

        {userNameBottomSheets()}
        {emailBottomSheets()}

        <CustomeModal
          visible={modalVisible}
          onClose={closeModal}
          closeModal={false}
          mainPadding={scale(5)}
          content={
            <ProfileModalContent
              closeModal={closeModal}
              openUserNameBottomSheets={openUserNameBottomSheets}
              openEmailBottomSheets={openEmailBottomSheets}
              updateProfilePic={updateProfilePic}
              handleLogout={handleLogout}
            />
          }
          width={scale(120)}
          justifyContent="flex-end"
          borderRadius={scale(10)}
          modalContainerStyle={[
            styles.modal,
            {
              top: modalPosition.y,
              left: modalPosition.x,
            },
          ]}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default React.memo(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    backgroundColor: Color.transparent,
    height: verticalScale(90),
    alignItems: 'flex-end',
  },
  inputContainer: {
    width: '100%',
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    paddingHorizontal: scale(8),
    backgroundColor: Color.White,
    borderRadius: scale(10),
    marginTop: verticalScale(5),
    marginBottom: verticalScale(10),
    height: verticalScale(45),
  },
  inputStyles: {
    height: scale(45),
    fontSize: moderateScale(13),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(5),
  },
  bodyContainer: {
    marginHorizontal: scale(15),
    marginTop: verticalScale(30),
  },
  label: {
    fontSize: moderateScale(14),
    color: Color.White,
    fontFamily: Font.semiBold,
  },
  separator: {
    borderBottomWidth: scale(0.5),
    borderBottomColor: Color.WhiteDefault,
    paddingVertical: verticalScale(10),
  },
  subscriptionContainer: {
    paddingTop: verticalScale(25),
    paddingBottom: verticalScale(8),
    flexDirection: 'row',
  },
  subscriptionBoxContainer: {
    width: '42%',
    borderWidth: scale(2),
    borderColor: '#146D8B',
    padding: scale(10),
    borderRadius: scale(10),
  },
  subscriptionText: {
    fontSize: moderateScale(16),
    fontFamily: Font.medium,
    color: Color.White,
    textAlign: 'center',
  },
  subscriptionBox: {
    gap: verticalScale(5),
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: scale(10),
    borderRadius: scale(10),
    height: verticalScale(60),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  subscriptionImage: {
    width: scale(36),
    height: scale(36),
  },
  subscriptionTier: {
    fontSize: moderateScale(16),
    color: Color.White,
    fontFamily: Font.medium,
    paddingLeft: scale(10),
  },
  subscriptionRightView: {gap: verticalScale(10), width: '55%'},
  aiCreditsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scale(2),
    borderColor: '#146D8B',
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(5),
    marginLeft: scale(10),
    borderRadius: scale(10),
  },
  aiCreditsText: {
    fontSize: moderateScale(15),
    fontFamily: Font.medium,
    color: Color.White,
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
  tabText: {
    fontSize: moderateScale(14),
    fontFamily: Font.regular,
    color: Color.WhiteDefault,
    paddingTop: verticalScale(5),
  },
  modal: {
    position: 'absolute',
    backgroundColor: Color.White,
    elevation: scale(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: scale(0.3),
    shadowRadius: scale(4),
    borderRadius: scale(10),
  },
  bottomSheetContainer: {
    alignItems: 'center',
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
  },
  sheetContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: verticalScale(15),
  },
  dragableIcon: {marginTop: verticalScale(20)},
  privacyTab: {
    marginLeft: scale(30),
  },
  aboutUsTab: {
    marginRight: scale(20),
  },
});
