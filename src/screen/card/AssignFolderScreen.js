import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import CustomeHeader from '../../custome/CustomeHeader';
import CustomeButton from '../../custome/CustomeButton';
import BottomSheetContent from '../../component/BottomSheetContent';
import Color from '../../component/Color';
import Font from '../../component/Font';
import {useLoader} from '../../context';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import {apiGet, apiPost, apiPut} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import {scale, verticalScale} from '../../custome/Responsive';
import NoDataView from '../../component/NoDataView';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';
import ActionSheet from 'react-native-actions-sheet';
import {useAppSelector} from '../../redux/hooks';

const AssignFolderScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const refRBSheet = useRef(null);
  const {showLoader, hideLoader} = useLoader();
  const insets = useSafeAreaInsets();
  const [folderData, setFolderData] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [folderStatus, setFolderStatus] = useState(0);
  const [folderColor, setFolderColor] = useState('');
  const [colorView, setColorView] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [noFolderClick, setNofolderClick] = useState(false);
  const colorTheme = useTheme();
  const {setId, folderId, screen} = route.params;
  
  // Get user from Redux state instead of global
  const user = useAppSelector(state => state.auth.user);
  const userId = user?._id;

  // ============================ API Calls ============================ //

  const getFolderData = useCallback(async (message = false, messageValue) => {
    if (!message) {
      showLoader();
    }
    try {
      const response = await apiGet(
        `${Api.Folder}?userId=${userId}`,
      );
      setFolderData(response?.data || response || []);
      if (message) {
        showMessageonTheScreen(messageValue);
      }
    } catch (error) {
      console.error('Error in fetching folder data', error);
      showMessageonTheScreen('Failed to fetch folders');
    } finally {
      hideLoader();
    }
  }, [userId, showLoader, hideLoader]);

  useEffect(() => {
    if (userId) {
      getFolderData();
    }
  }, [userId, getFolderData]);

  useEffect(() => {
    if (folderId) {
      setSelectedFolderId(folderId);
    }
  }, [folderId]);

  const createFolder = useCallback(async () => {
    if (!folderName?.trim()) {
      showMessageonTheScreen('Please enter folder name');
      return;
    }

    const rawData = {
      name: folderName,
      isPrivate: folderStatus,
      color: folderColor,
      userId: userId,
      isHighlight: colorView,
    };
    showLoader();
    try {
      const response = await apiPost(Api.Folder, '', JSON.stringify(rawData));
      setFolderName('');
      setFolderStatus(0);
      setFolderColor('');
      setColorView(false);
      refRBSheet.current?.hide();
      getFolderData(true, response?.message);
    } catch (error) {
      console.error('Error in creating folder', error);
      showMessageonTheScreen('Failed to create folder');
    } finally {
      hideLoader();
    }
  }, [colorView, folderColor, folderName, folderStatus, userId, showLoader, hideLoader, getFolderData]);

  const assignFolder = useCallback(async () => {
    try {
      showLoader();
      const response = await apiPut(
        `${Api.assignedFolder}?folderId=${selectedFolderId}&setId=${setId}`,
      );
      if (response?.success) {
        showMessageonTheScreen(response?.message);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error in assigning folder', error);
      showMessageonTheScreen('Failed to assign folder');
    } finally {
      hideLoader();
    }
  }, [selectedFolderId, setId, showLoader, hideLoader, navigation]);

  const assignOtherSet = useCallback(async () => {
    try {
      showLoader();
      const response = await apiPut(
        `${Api.mediatorUserSet}?folderId=${selectedFolderId}&setId=${setId}&userId=${userId}`,
      );
      if (response?.success) {
        showMessageonTheScreen(response?.message);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error in assigning folder', error);
      showMessageonTheScreen('Failed to assign folder');
    } finally {
      hideLoader();
    }
  }, [selectedFolderId, setId, userId, showLoader, hideLoader, navigation]);
  // ?userId&setId&folderId
  // =================================================================== //

  const handleFolderSelect = useCallback((folderId) => {
    setSelectedFolderId(folderId);
    setNofolderClick(false);
  }, []);

  const handleNoFolderPress = useCallback(() => {
    setSelectedFolderId('');
    setNofolderClick(prev => !prev);
  }, []);

  const handleAssignPress = useCallback(() => {
    if (selectedFolderId || noFolderClick) {
      screen === 'OtherUserScreen' ? assignOtherSet() : assignFolder();
    } else {
      showMessageonTheScreen(strings.pleaseSelectFolder);
    }
  }, [selectedFolderId, noFolderClick, screen, assignOtherSet, assignFolder]);

  const renderFolder = useCallback(
    ({item, index}) => {
      const selected = selectedFolderId === item?._id;
      return (
        <Pressable
          style={[
            styles.folderItem,
            {
              borderColor: selected ? colorTheme.textColor : Color.transparent,
              borderWidth: selected ? scale(1.5) : scale(0),
              backgroundColor: item?.isHighlight
                ? item.color
                : colorTheme.listAndBoxColor,
            },
          ]}
          onPress={() => handleFolderSelect(item?._id)}>
          <View style={styles.folderInfo}>
            {!colorView && (
              <View style={[styles.iconColor, {backgroundColor: item.color}]} />
            )}
            <Text
              style={[
                styles.folderName,
                {color: item?.isHighlight ? Color.Black : colorTheme.textColor},
              ]}>
              {item?.name}
            </Text>
          </View>
        </Pressable>
      );
    },
    [
      selectedFolderId,
      colorTheme.listAndBoxColor,
      colorTheme.textColor,
      colorView,
      handleFolderSelect,
    ],
  );

  const renderHeader = useMemo(
    () => (
      <CustomeHeader
        goBack={true}
        title={strings.selectFolder}
        plusButton={true}
        iconColor={Color.White}
        iconStyle={styles.iconStyle}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
        plusIconAction={() => refRBSheet.current.show()}
      />
    ),
    [],
  );

  const BottomSheets = useCallback(
    () => (
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
            closeBottomSheet={() => refRBSheet.current.hide()}
            title={strings.createFolder}
            name={folderName}
            setName={setFolderName}
            status={folderStatus}
            setStatus={setFolderStatus}
            color={folderColor}
            setColor={setFolderColor}
            setColorView={setColorView}
            colorView={colorView}
            create={createFolder}
          />
        </View>
      </ActionSheet>
    ),
    [
      folderName,
      folderStatus,
      folderColor,
      colorView,
      colorTheme.background,
      createFolder,
    ],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <View style={[styles.container, {backgroundColor: colorTheme.background1}]}>
      {renderHeader}
      <View style={styles.bodyContainer}>
        {folderData?.length > 0 ? (
          <FlatList
            data={folderData}
            renderItem={renderFolder}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.flatListContainer}
          />
        ) : (
          <NoDataView
            content={strings.folderNotFound}
            noDataViewStyle={{marginTop: verticalScale(-70)}}
          />
        )}
        {BottomSheets()}
        {screen === 'OtherUserScreen' && (
          <Pressable
            style={[
              styles.noFolderView,
              {
                borderWidth: noFolderClick ? 1.5 : 0,
                borderColor: colorTheme.textColor,
              },
            ]}
            onPress={handleNoFolderPress}>
            <Text style={styles.noFolderText}>{strings.noFolder}</Text>
          </Pressable>
        )}
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
          bottom={Math.max(insets.bottom + verticalScale(10), verticalScale(20))}
          onPress={handleAssignPress}
        />
      </View>
    </View>
  );
};

export default React.memo(AssignFolderScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Color.White,
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
  bodyContainer: {
    flex: 1,
    marginHorizontal: verticalScale(15),
    marginVertical: verticalScale(10),
  },
  folderContainer: {
    backgroundColor: Color.SandyBrown,
    borderRadius: scale(10),
    padding: scale(10),
  },
  folderText: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
  },
  flatListContainer: {
    paddingVertical: verticalScale(10),
  },
  folderItem: {
    flexDirection: 'row',
    padding: scale(4),
    borderRadius: scale(10),
    marginBottom: verticalScale(10),
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconColor: {
    width: scale(13),
    height: scale(40),
    borderRadius: scale(8),
  },
  folderName: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(10),
    textTransform: 'uppercase',
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
  colorBox: {
    width: scale(13),
    height: verticalScale(35),
    borderRadius: scale(10),
  },
  noFolderView: {
    height: verticalScale(45),
    backgroundColor: 'rgba(159, 159, 159, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(10),
    marginBottom: verticalScale(10),
  },
  noFolderText: {
    fontSize: scale(15),
    color: Color.theme1,
    fontFamily: Font.semiBold,
    textTransform: 'uppercase',
  },
});
