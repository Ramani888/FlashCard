import React, {useState, useCallback, useRef} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  findNodeHandle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Color from '../../component/Color';
import CustomeHeader from '../../custome/CustomeHeader';
import {scale, verticalScale} from 'react-native-size-matters';
import Font from '../../component/Font';
import CustomeInputField from '../../custome/CustomeInputField';
import CustomeModal from '../../custome/CustomeModal';
import ProfileModalContent from '../../component/profile/ProfileModalContent';
import RBSheet from 'react-native-raw-bottom-sheet';
import UserNameBottomSheetsContent from '../../component/profile/UserNameBottomSheetsContent';
import EmailBottomSheetsContent from '../../component/profile/EmailBottomSheetsContent';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../../component/Screen';

const tabData = [
  {tabname: 'Contacts', image: require('../../Assets/Img/userIcon.png')},
  {tabname: 'PDF', image: require('../../Assets/Img/pdf.png')},
  {tabname: 'Notes', image: require('../../Assets/Img/notes.png')},
  {tabname: 'Images', image: require('../../Assets/Img/images.png')},
  {tabname: 'Cloud', image: require('../../Assets/Img/cloud.png')},
  {tabname: 'Support', image: require('../../Assets/Img/support.png')},
];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const refUserNameRBSheet = useRef();
  const refEmailRBSheet = useRef();

  const openModal = useCallback(ref => {
    if (ref.current) {
      ref.current.measureInWindow((x, y, width, height) => {
        setModalPosition({x: x - width * 5, y: y + height + 25});
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
    tabname == 'Contacts' && navigation.navigate(ScreenName.contact)
    tabname == 'Support' && navigation.navigate(ScreenName.support);
    tabname == 'Notes' && navigation.navigate(ScreenName.notes);
  };

  const renderTab = useCallback(
    ({item}) => (
      <Pressable
        style={styles.tabContainer}
        onPress={() => handleTabPress(item?.tabname)}>
        <Image
          source={item?.image}
          style={styles.tabIcon}
          tintColor={Color.White}
        />
        <Text style={styles.tabText}>{item?.tabname}</Text>
      </Pressable>
    ),
    [],
  );

  const userNameBottomSheets = useCallback(() => {
    return (
      <RBSheet
        ref={refUserNameRBSheet}
        height={verticalScale(245)}
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
        height={verticalScale(430)}
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

  return (
    <LinearGradient
      colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
      style={styles.container}>
      <StatusBar translucent backgroundColor={Color.transparent} />
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        profileImage={true}
        edit={true}
        containerStyle={styles.headerStyle}
        openEditModal={openModal}
        setEditRef={ref => (editRef.current = ref)}
      />
      <View style={styles.bodyContainer}>
        <View>
          <Text style={styles.label}>Username</Text>
          <CustomeInputField
            placeholder="Username"
            placeholderTextColor={Color.mediumGray}
            onChangeText={setUserName}
            value={username}
            borderWidth={1}
            borderColor={Color.LightGray}
            height={verticalScale(40)}
            marginTop={verticalScale(5)}
            width="100%"
          />
        </View>

        <View>
          <Text style={styles.label}>Email</Text>
          <CustomeInputField
            placeholder="Email"
            placeholderTextColor={Color.mediumGray}
            onChangeText={setEmail}
            value={email}
            borderWidth={1}
            borderColor={Color.LightGray}
            height={verticalScale(40)}
            marginTop={verticalScale(5)}
            width="100%"
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.subscriptionContainer}>
          <Text style={styles.subscriptionText}>Subscription</Text>
          <View style={styles.subscriptionBox}>
            <Image
              source={require('../../Assets/Img/subscription.png')}
              style={styles.subscriptionImage}
            />
            <Text style={styles.subscriptionTier}>TIER 4</Text>
          </View>
          <View style={styles.separator} />
        </View>
      </View>

      <View>
        <FlatList
          data={tabData}
          renderItem={renderTab}
          numColumns={3}
          key={'_'}
          contentContainerStyle={{paddingHorizontal: scale(15)}}
        />
      </View>

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
  bodyContainer: {
    marginHorizontal: scale(15),
    marginTop: verticalScale(30),
  },
  label: {
    fontSize: scale(14),
    color: Color.White,
    fontFamily: Font.semiBold,
  },
  separator: {
    borderBottomWidth: scale(0.5),
    borderBottomColor: Color.WhiteDefault,
    paddingVertical: verticalScale(10),
  },
  subscriptionContainer: {
    paddingVertical: verticalScale(15),
  },
  subscriptionText: {
    fontSize: scale(20),
    fontFamily: Font.medium,
    color: Color.White,
    textAlign: 'center',
  },
  subscriptionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: scale(1),
    borderColor: Color.WhiteDefault,
    alignSelf: 'center',
    paddingHorizontal: scale(10),
    borderRadius: scale(10),
    height: verticalScale(60),
    marginTop: verticalScale(15),
    marginBottom: verticalScale(3),
  },
  subscriptionImage: {
    width: scale(36),
    height: scale(36),
  },
  subscriptionTier: {
    fontSize: scale(16),
    color: Color.White,
    fontFamily: Font.medium,
    paddingLeft: scale(10),
  },
  tabContainer: {
    alignItems: 'center',
    marginHorizontal: scale(30),
    marginVertical: verticalScale(15),
  },
  tabIcon: {
    width: scale(24),
    height: scale(24),
  },
  tabText: {
    fontSize: scale(14),
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
    gap: scale(50),
    marginVertical: verticalScale(15),
  },
  dragableIcon: {marginTop: verticalScale(20)},
});