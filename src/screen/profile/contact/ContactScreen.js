import {StyleSheet, Text, View, FlatList, Image} from 'react-native';
import React, {useCallback, useRef, useState, useMemo, useEffect} from 'react';
import CustomeHeader from '../../../custome/CustomeHeader';
import Color from '../../../component/Color';
import {scale, verticalScale} from '../../../custome/Responsive';
import Font from '../../../component/Font';
import Entypo from 'react-native-vector-icons/Entypo';
import {Menu, MenuTrigger, MenuOptions, MenuProvider} from 'react-native-popup-menu';
import ContactModalContent from '../../../component/profile/contact/ContactModalContent';
import ContactBottomSheetContent from '../../../component/profile/contact/ContactBottomSheetContent';
import {apiDelete, apiGet, apiPost} from '../../../Api/ApiService';
import Api from '../../../Api/EndPoint';
import showMessageonTheScreen from '../../../component/ShowMessageOnTheScreen';
import Loader from '../../../component/Loader';
import useTheme from '../../../component/Theme';
import strings from '../../../language/strings';
import NoDataView from '../../../component/NoDataView';
import ActionSheet from 'react-native-actions-sheet';

const ContactScreen = () => {
  const [visible, setVisible] = useState(false);
  const [contactData, setContactData] = useState([]);
  const refContactRBSheet = useRef();
  const colorTheme = useTheme();

  useEffect(() => {
    getContacts(false);
  }, []);

  // ==================================== Api ================================== //

  const getContacts = async (message, messageValue) => {
    try {
      message === false && setVisible(true);
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

  const createContacts = useCallback(async selectedUserId => {
    const rawData = {
      userId: global.user?._id,
      contactUserId: selectedUserId,
    };
    try {
      setVisible(true);
      const response = await apiPost(Api.contacts, '', JSON.stringify(rawData));
      if (response.success === true) {
        getContacts(true, response?.message);
      }
    } catch (error) {
      console.log('error in get contact api', error);
    }
  }, []);

  const deleteContacts = async contactId => {
    try {
      setVisible(true);
      const response = await apiDelete(`${Api.contacts}?_id=${contactId}`);
      if (response.success === true) {
        getContacts(true, response?.message);
      }
    } catch (error) {
      console.log('error in delete contact api', error);
    }
  };

  // ==================================== End ================================== //

  const openContactBottomSheets = () => {
    refContactRBSheet.current.show();
  };

  const closeContactBottomSheet = () => {
    refContactRBSheet.current.hide();
  };

  const renderHeader = useMemo(
    () => (
      <CustomeHeader
        goBack={true}
        title={strings.contact}
        plusButton={true}
        iconColor={Color.White}
        iconStyle={styles.iconStyle}
        containerStyle={[
          styles.headerStyle,
          {backgroundColor: colorTheme.headerTheme},
        ]}
        titleStyle={styles.headerTitleStyle}
        plusIconAction={openContactBottomSheets}
      />
    ),
    [colorTheme.headerTheme],
  );

  const contactBottomSheets = useCallback(() => {
    return (
      <ActionSheet
        ref={refContactRBSheet}
        gestureEnabled={true}
        indicatorStyle={styles.indicatorStyle}
        containerStyle={{
          backgroundColor: colorTheme.background,
          borderTopLeftRadius: scale(30),
          borderTopRightRadius: scale(30),
        }}>
        <View style={styles.sheetContainer}>
          <ContactBottomSheetContent
            closeContactBottomSheet={closeContactBottomSheet}
            createContacts={createContacts}
            colorTheme={colorTheme}
          />
        </View>
      </ActionSheet>
    );
  }, [colorTheme, createContacts]);

  const renderContacts = useCallback(
    ({item, index}) => {
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
          <Menu>
            <MenuTrigger>
              <Entypo
                name="dots-three-vertical"
                size={scale(13)}
                color={Color.Black}
                style={[
                  styles.dotsIcon,
                  {
                    backgroundColor: colorTheme.threeDotIcon,
                  },
                ]}
              />
            </MenuTrigger>
            <MenuOptions customStyles={{optionsContainer: {borderRadius: scale(10), backgroundColor: colorTheme.modelNewBackground}}}>
              <ContactModalContent
                item={item}
                deleteContacts={deleteContacts}
                colorTheme={colorTheme}
              />
            </MenuOptions>
          </Menu>
        </View>
      );
    },
    [
      colorTheme.listAndBoxColor,
      colorTheme.textColor,
      colorTheme.threeDotIcon,
      deleteContacts,
    ],
  );

  return (
    <MenuProvider>
      <View style={[styles.container, {backgroundColor: colorTheme.background}]}>
        <Loader visible={visible} />
        {renderHeader}
        <View style={styles.bodyContainer}>
          {contactData?.length > 0 ? (
            <FlatList
              data={contactData}
              renderItem={renderContacts}
              keyExtractor={(item, index) => index.toString()}
              style={styles.flatListStyle}
            />
          ) : (
            <NoDataView
              content={strings.contactNotfound}
              noDataViewStyle={{marginTop: verticalScale(-70)}}
              noDataTextStyle={{color: colorTheme.textColor}}
            />
          )}
        </View>
        {contactBottomSheets()}
      </View>
    </MenuProvider>
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
  indicatorStyle: {
    marginTop: verticalScale(10),
    backgroundColor: Color.mediumGray,
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
