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

const AssignImageFolder = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const refRBSheet = useRef(null);
  const {imageId} = route.params;
  const {showLoader, hideLoader} = useLoader();
  const insets = useSafeAreaInsets();
  const [folderData, setFolderData] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [folderColor, setFolderColor] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [colorView, setColorView] = useState(false);
  const colorTheme = useTheme();
  
  // Get user from Redux state instead of global
  const user = useAppSelector(state => state.auth.user);
  const userId = user?._id;

  useEffect(() => {
    if (userId) {
      getImageFolderData(false);
    }
  }, [userId]);

  // ============================ API Calls ============================ //

  const getImageFolderData = async (message, messageValue) => {
    message === false && showLoader();
    try {
      const response = await apiGet(
        `${Api.imageFolder}?userId=${userId}`,
      );
      setFolderData(response?.data || response || []);
      message && showMessageonTheScreen(messageValue);
    } catch (error) {
      console.log('error in get pdf folder api', error);
    } finally {
      hideLoader();
    }
  };

  const createImageFolder = useCallback(
    async (message, messageValue) => {
      const rawData = {
        name: folderName,
        color: folderColor,
        userId: userId,
        isHighlight: colorView,
      };
      showLoader();
      try {
        const response = await apiPost(
          Api.imageFolder,
          '',
          JSON.stringify(rawData),
        );
        setFolderName('');
        setFolderColor('');
        getImageFolderData(true, response?.message);
      } catch (error) {
        console.log('error in create pdf folder api', error);
      }
    },
    [colorView, folderColor, folderName, userId, showLoader, getImageFolderData],
  );

  const assignImageFolder = async () => {
    try {
      showLoader();
      const response = await apiPut(
        `${Api.assignImageFolder}?_id=${imageId}&folderId=${selectedFolderId}`,
      );
      if (response?.success) {
        navigation.goBack();
        getImageFolderData(true, response?.message);
      }
    } catch (error) {
      console.error('Error in assigning folder', error);
    }
  };

  // =================================================================== //

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
          onPress={() => setSelectedFolderId(item?._id)}>
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
            color={folderColor}
            setColor={setFolderColor}
            setColorView={setColorView}
            colorView={colorView}
            create={createImageFolder}
          />
        </View>
      </ActionSheet>
    ),
    [
      folderName,
      folderColor,
      colorView,
      colorTheme.background,
      createImageFolder,
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
          position="absolute"
          bottom={Math.max(insets.bottom + verticalScale(10), verticalScale(20))}
          onPress={() => {
            if (selectedFolderId) {
              assignImageFolder();
            } else {
              showMessageonTheScreen(strings.pleaseSelectFolder);
            }
          }}
        />
      </View>
    </View>
  );
};

export default React.memo(AssignImageFolder);

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
    padding: scale(7),
    borderRadius: scale(10),
    marginBottom: verticalScale(10),
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconColor: {
    width: scale(13),
    height: scale(30),
    borderRadius: scale(8),
  },
  folderName: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(10),
    width: '95%',
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
