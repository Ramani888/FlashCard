import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';
import React, {useCallback, useRef, useState, useMemo, useEffect} from 'react';
import CustomeHeader from '../../../custome/CustomeHeader';
import Color from '../../../component/Color';
import {scale, verticalScale} from '../../../custome/Responsive';
import Font from '../../../component/Font';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeModal from '../../../custome/CustomeModal';
import ContactModalContent from '../../../component/profile/contact/ContactModalContent';
import ContactBottomSheetContent from '../../../component/profile/contact/ContactBottomSheetContent';
import RBSheet from 'react-native-raw-bottom-sheet';
import {apiDelete, apiGet, apiPost} from '../../../Api/ApiService';
import Api from '../../../Api/EndPoint';
import showMessageonTheScreen from '../../../component/ShowMessageOnTheScreen';
import Loader from '../../../component/Loader';
import useTheme from '../../../component/Theme';
import strings from '../../../language/strings';

const {height, width} = Dimensions.get('window');

const ContactScreen = () => {
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [contactData, setContactData] = useState([]);
  const [singleContactItem, setSingleContactItem] = useState({});
  const threeDotIconRef = useRef(null);
  const refContactRBSheet = useRef();
  const colorTheme = useTheme();

  useEffect(() => {
    getContacts(false);
  }, []);

  // ==================================== Api ================================== //

  const getContacts = async (message, messageValue) => {
    try {
      message == false && setVisible(true);
      const response = await apiGet(
        `${Api.contacts}?userId=${global.user?._id}`,
      );
      if (response) {
        setContactData(response);
        message && showMessageonTheScreen(messageValue);
      }
    } catch (error) {
      console.log('error in get contact api', error);
    } finally {
      setVisible(false);
    }
  };

  const createContacts = async selectedUserId => {
    const rawData = {
      userId: global.user?._id,
      contactUserId: selectedUserId,
    };
    try {
      setVisible(true);
      const response = await apiPost(Api.contacts, '', JSON.stringify(rawData));
      if (response.success == true) {
        getContacts(true, response?.message);
      }
    } catch (error) {
      console.log('error in get contact api', error);
    }
  };

  const deleteContacts = async contactId => {
    try {
      setVisible(true);
      const response = await apiDelete(`${Api.contacts}?_id=${contactId}`);
      if (response.success == true) {
        getContacts(true, response?.message);
      }
    } catch (error) {
      console.log('error in delete contact api', error);
    }
  };

  // ==================================== End ================================== //

  const openModal = useCallback((item, isLastItem) => {
    threeDotIconRef.current.measureInWindow((x, y, width, height) => {
      const offsetY =
        contactData.length > 7
          ? isLastItem
            ? -height - 15
            : height + 15
          : height + 15;
      setModalPosition({x: x - scale(130), y: y + offsetY});
      setModalVisible(true);
    });
  }, []);

  const closeModal = useCallback(() => setModalVisible(false), []);

  const openContactBottomSheets = () => {
    refContactRBSheet.current.open();
  };

  const closeContactBottomSheet = () => {
    refContactRBSheet.current.close();
  };

  const renderHeader = useMemo(
    () => (
      <CustomeHeader
        goBack={true}
        title={strings.contact}
        plusButton={true}
        iconColor={Color.White}
        iconStyle={styles.iconStyle}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
        plusIconAction={openContactBottomSheets}
      />
    ),
    [],
  );

  const contactBottomSheets = useCallback(() => {
    return (
      <RBSheet
        ref={refContactRBSheet}
        height={height * 0.4}
        openDuration={250}
        draggable={true}
        customStyles={{
          container: [styles.bottomSheetContainer,{backgroundColor: colorTheme.background}],
          draggableIcon: styles.dragableIcon,
        }}>
        <View style={styles.sheetContainer}>
          <ContactBottomSheetContent
            closeContactBottomSheet={closeContactBottomSheet}
            createContacts={createContacts}
            colorTheme={colorTheme}
          />
        </View>
      </RBSheet>
    );
  }, []);

  const renderContacts = useCallback(
    ({item, index}) => {
      const isLastItem = index === contactData.length - 1;

      return (
        <View
          style={[
            styles.contactContainer,
            {backgroundColor: colorTheme.listAndBoxColor},
          ]}>
          <View style={styles.userDetails}>
            <Image source={{uri: item?.picture}} style={styles.profileImage} />
            <Text style={[styles.contactText, {color: colorTheme.textColor}]}>
              {item?.userName}
            </Text>
          </View>
          <Pressable
            ref={threeDotIconRef}
            onPress={() => {
              setSingleContactItem(item);
              openModal(item, isLastItem);
            }}>
            <Entypo
              name="dots-three-vertical"
              size={scale(13)}
              color={Color.Black}
              style={[
                styles.dotsIcon,
                {
                  backgroundColor:colorTheme.threeDotIcon,
                },
              ]}
            />
          </Pressable>
        </View>
      );
    },
    [openModal],
  );

  return (
    <View style={[styles.container, {backgroundColor: colorTheme.background}]}>
      <Loader visible={visible} />
      {renderHeader}
      <View style={styles.bodyContainer}>
        <FlatList
          data={contactData}
          renderItem={renderContacts}
          keyExtractor={(item, index) => index.toString()}
          style={styles.flatListStyle}
        />
      </View>
      {contactBottomSheets()}
      <CustomeModal
        visible={modalVisible}
        onClose={closeModal}
        closeModal={false}
        mainPadding={scale(5)}
        backgroundColor={colorTheme.modelBackground}
        content={
          <ContactModalContent
            closeModal={closeModal}
            item={singleContactItem}
            deleteContacts={deleteContacts}
            colorTheme={colorTheme}
          />
        }
        width={'44%'}
        justifyContent="flex-end"
        borderRadius={20}
        modalContainerStyle={[
          styles.modal,
          {
            top: modalPosition.y,
            left: modalPosition.x,
            backgroundColor: colorTheme.modelBackgroundView,
          },
        ]}
      />
    </View>
  );
};

export default React.memo(ContactScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    height: verticalScale(90),
    alignItems: 'flex-end',
  },
  headerTitleStyle: {
    color: Color.White,
    fontSize: scale(20),
  },
  iconStyle: {
    bottom: verticalScale(1),
  },
  dotsIcon: {
    backgroundColor: Color.WhiteDefault,
    borderRadius: scale(10),
    padding: scale(10),
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
  flatListStyle: {
    flex: 1,
    marginBottom: verticalScale(60),
  },
  contactContainer: {
    flexDirection: 'row',
    backgroundColor: Color.White,
    padding: scale(5),
    marginHorizontal: scale(15),
    marginBottom: verticalScale(12),
    borderRadius: scale(5),
    borderWidth: scale(0.3),
    borderColor: Color.LightGray,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactText: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    textTransform: 'uppercase',
    paddingLeft: scale(7),
  },
  bodyContainer: {
    flex: 1,
    marginTop: verticalScale(15),
  },
  modal: {
    position: 'absolute',
    borderRadius: scale(10),
    backgroundColor: Color.White,
    elevation: scale(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: scale(0.3),
    shadowRadius: scale(4),
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    height: scale(35),
    width: scale(35),
    borderRadius: scale(17.5),
  },
});
