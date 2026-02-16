import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import CustomeHeader from '../../custome/CustomeHeader';
import Color from '../../component/Color';
import {scale, verticalScale} from '../../custome/Responsive';
import CustomeButton from '../../custome/CustomeButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheetContent from '../../component/BottomSheetContent';
import Font from '../../component/Font';
import {useNavigation, useRoute} from '@react-navigation/native';
import {apiGet, apiPost, apiPut} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import Loader from '../../component/Loader';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import NoDataView from '../../component/NoDataView';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';
import ActionSheet from 'react-native-actions-sheet';
import {useAppSelector} from '../../redux/hooks';

const AssignSetScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const refRBSheet = useRef();
  const colorTheme = useTheme();
  const [visible, setVisible] = useState(false);
  const [setData, setSetData] = useState([]);
  const [setName, setSetName] = useState('');
  const [setStatus, setSetStatus] = useState(0);
  const [setColor, setSetColor] = useState('');
  const [colorView, setColorView] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState('');
  const {folderId, cardId, screen} = route.params;
  
  // Get user from Redux state instead of global
  const user = useAppSelector(state => state.auth.user);
  const userId = user?._id;

  useEffect(() => {
    getSetData(false);
  }, [getSetData]);

  // ===================================== Api ===================================== //

  const getSetData = useCallback(
    async (message, messageValue) => {
      message === false && setVisible(true);
      try {
        const url = folderId
          ? `${Api.FolderSet}?userId=${global?.user?._id}&folderId=${folderId}`
          : `${Api.Set}?userId=${global?.user?._id}`;
        const response = await apiGet(url);
        setSetData(response);
        message && showMessageonTheScreen(messageValue);
      } catch (error) {
        console.log('error in get folder api', error);
      } finally {
        setVisible(false);
      }
    },
    [folderId],
  );

  const createSet = useCallback(async () => {
    const rawData = {
      name: setName,
      isPrivate: setStatus,
      color: setColor,
      userId: userId,
      ...(folderId ? {folderId: folderId} : {}),
      isHighlight: colorView,
    };
    setVisible(true);
    try {
      const response = await apiPost(Api.Set, '', JSON.stringify(rawData));
      setSetName('');
      setSetStatus('');
      setSetColor('');
      getSetData(true, response?.message);
    } catch (error) {
      console.log('error in create set api', error);
    }
  }, [colorView, folderId, getSetData, setColor, setName, setStatus]);

  const assignSet = async () => {
    try {
      setVisible(true);
      const response = await apiPut(
        `${Api.moveCard}?setId=${selectedSetId}&cardId=${cardId}`,
      );
      if (response?.success === true) {
        navigation.goBack();
        getSetData(true, response?.message);
      }
    } catch (error) {
      console.log('error in assignSet api', error);
    }
  };

  const assignOtherUserCard = async () => {
    try {
      setVisible(true);
      const response = await apiPut(
        `${Api.mediatorCard}?setId=${selectedSetId}&cardId=${cardId}&userId=${userId}`,
      );
      if (response?.success === true) {
        navigation.goBack();
        getSetData(true, response?.message);
      }
    } catch (error) {
      console.log('error in assignOtherUserCard api', error);
    }
  };

  // ================================== Api =================================== //

  const renderHeader = () => {
    return (
      <CustomeHeader
        goBack={true}
        title={strings.selectSet}
        plusButton={true}
        iconColor={Color.White}
        iconStyle={styles.iconStyle}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
        plusIconAction={openBottomSheet}
      />
    );
  };

  const renderSet = useCallback(
    ({item, index}) => {
      const selected = selectedSetId === item?._id;

      return (
        <View style={styles.itemContainer}>
          <Pressable
            style={[
              styles.setContainer,
              {
                borderColor: selected
                  ? colorTheme.textColor
                  : Color.transparent,
                borderWidth: selected ? scale(1.5) : scale(0),
                backgroundColor: item?.isHighlight
                  ? item.color
                  : colorTheme.listAndBoxColor,
              },
            ]}
            onPress={() => setSelectedSetId(item?._id)}>
            <View style={styles.rowContainer}>
              {!colorView && (
                <Image
                  source={require('../../Assets/Img/bibleSign.png')}
                  style={styles.bibleIcon}
                  tintColor={item?.color}
                />
              )}
              <Text
                style={[
                  styles.setTitle,
                  {
                    color: item?.isHighlight
                      ? Color.Black
                      : colorTheme.textColor,
                  },
                ]}>
                {item?.name}
              </Text>
            </View>
            <View style={styles.rowWithGap}>
              <View style={styles.subSetContainer}>
                <Text
                  style={[
                    styles.subSetText,
                    {
                      color: item?.isHighlight
                        ? Color.Black
                        : colorTheme.textColor,
                    },
                  ]}>
                  {item?.cardCount}
                </Text>
                <Image
                  source={require('../../Assets/Img/cardIcon.png')}
                  style={styles.cardIcon}
                />
              </View>
            </View>
          </Pressable>
          <View style={[styles.folderContainer, {alignSelf: 'flex-start'}]}>
            <Image
              source={require('../../Assets/Img/folder.png')}
              style={styles.folderIcon}
            />
            <Text style={styles.folderText}>
              {item?.folderName ? item?.folderName : ''}
            </Text>
          </View>
        </View>
      );
    },
    [
      selectedSetId,
      colorTheme.listAndBoxColor,
      colorTheme.textColor,
      colorView,
    ],
  );

  const openBottomSheet = () => {
    refRBSheet.current.show();
  };

  const closeBottomSheet = () => {
    refRBSheet.current.hide();
  };

  const BottomSheets = useCallback(() => {
    return (
      <ActionSheet
        ref={refRBSheet}
        gestureEnabled={true}
        indicatorStyle={styles.indicatorStyle}
        containerStyle={{
          backgroundColor: colorTheme.background,
          borderTopLeftRadius: scale(30),
          borderTopRightRadius: scale(30),
        }}>
        <View style={styles.sheetContainer}>
          <BottomSheetContent
            closeBottomSheet={closeBottomSheet}
            title={strings.createSet}
            name={setName}
            setName={setSetName}
            status={setStatus}
            setStatus={setSetStatus}
            color={setColor}
            setColor={setSetColor}
            setColorView={setColorView}
            colorView={colorView}
            create={createSet}
          />
        </View>
      </ActionSheet>
    );
  }, [
    setName,
    setStatus,
    setColor,
    colorView,
    colorTheme.background,
    createSet,
  ]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderBody = () => {
    return (
      <View style={styles.bodyContainer}>
        {setData?.length > 0 ? (
          <FlatList
            data={setData}
            renderItem={renderSet}
            keyExtractor={keyExtractor}
            style={{
              marginTop: verticalScale(10),
              marginBottom: verticalScale(55),
            }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <NoDataView content={strings.setNotFound} />
        )}
        {BottomSheets()}

        <CustomeButton
          buttonColor={Color.theme1}
          buttonWidth="100%"
          buttonHeight={scale(45)}
          title={strings.moveIntoSelected}
          borderRadius={scale(10)}
          fontSize={scale(15)}
          fontColor={Color.White}
          fontFamily={Font.semiBold}
          marginTop={verticalScale(15)}
          position={'absolute'}
          bottom={verticalScale(10)}
          onPress={() => {
            if (selectedSetId) {
              if (screen === 'OtherUserCardScreen') {
                assignOtherUserCard();
              } else {
                assignSet();
              }
            } else {
              showMessageonTheScreen(strings.pleaseSelectTheSet);
            }
          }}
        />
      </View>
    );
  };

  return (
    <View
      style={[styles.maiContainer, {backgroundColor: colorTheme.background1}]}>
      <Loader visible={visible} />
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

export default React.memo(AssignSetScreen);

const styles = StyleSheet.create({
  maiContainer: {flex: 1},
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
  container: {
    marginHorizontal: scale(15),
    marginTop: verticalScale(15),
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    marginHorizontal: verticalScale(15),
    marginVertical: verticalScale(10),
  },
  itemContainer: {
    marginBottom: verticalScale(15),
  },
  setContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Color.White,
    padding: scale(5),
    paddingVertical: verticalScale(5),
    borderRadius: scale(10),
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bibleIcon: {
    width: scale(11),
    height: scale(36),
    borderRadius: scale(10),
  },
  setTitle: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(10),
  },
  rowWithGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(15),
  },
  subSetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  subSetText: {
    fontSize: scale(15),
    color: Color.Black,
  },
  cardIcon: {
    width: scale(16),
    height: scale(13),
  },
  dotsIcon: {
    backgroundColor: Color.WhiteDefault,
    borderRadius: scale(5),
    padding: scale(10),
  },
  folderIcon: {
    width: scale(26),
    height: scale(26),
  },
  folderText: {
    fontSize: scale(12),
    color: Color.Black,
    fontFamily: Font.regular,
    textTransform: 'capitalize',
  },
  folderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    backgroundColor: Color.White,
    height: scale(35),
    borderRadius: scale(10),
    marginTop: verticalScale(5),
    paddingHorizontal: scale(5), // Add some padding if needed
    alignSelf: 'flex-start', // Ensure the width wraps content
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
});
