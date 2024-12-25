import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import CustomeHeader from '../../custome/CustomeHeader';
import CustomeButton from '../../custome/CustomeButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheetContent from '../../component/BottomSheetContent';
import Color from '../../component/Color';
import Font from '../../component/Font';
import Loader from '../../component/Loader';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import {apiGet, apiPost, apiPut} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import {scale, verticalScale} from '../../custome/Responsive';
import NoDataView from '../../component/NoDataView';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';

const {height, width} = Dimensions.get('window');

const AssignFolderScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const refRBSheet = useRef(null);
  const [visible, setVisible] = useState(false);
  const [folderData, setFolderData] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [folderStatus, setFolderStatus] = useState(0);
  const [folderColor, setFolderColor] = useState('');
  const [colorView, setColorView] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [noFolderClick, setNofolderClick] = useState(false);
  const colorTheme = useTheme();
  const {setId, screen} = route.params;

  useEffect(() => {
    getFolderData();
  }, []);

  // ============================ API Calls ============================ //

  const getFolderData = async (message = false, messageValue) => {
    if (!message) setVisible(true);
    try {
      const response = await apiGet(
        `${Api.Folder}?userId=${global?.user?._id}`,
      );
      setFolderData(response);
      if (message) showMessageonTheScreen(messageValue);
    } catch (error) {
      console.error('Error in fetching folder data', error);
    } finally {
      setVisible(false);
    }
  };

  const createFolder = async () => {
    const rawData = {
      name: folderName,
      isPrivate: folderStatus,
      color: folderColor,
      userId: global?.user?._id,
      isHighlight: colorView,
    };
    setVisible(true);
    try {
      const response = await apiPost(Api.Folder, '', JSON.stringify(rawData));
      setFolderName('');
      setFolderStatus(0);
      setFolderColor('');
      getFolderData(true, response?.message);
    } catch (error) {
      console.error('Error in creating folder', error);
    }
  };

  const assignFolder = async () => {
    try {
      setVisible(true);
      const response = await apiPut(
        `${Api.assignedFolder}?folderId=${selectedFolderId}&setId=${setId}`,
      );
      if (response?.success) {
        navigation.goBack();
        getFolderData(true, response?.message);
      }
    } catch (error) {
      console.error('Error in assigning folder', error);
    }
  };

  const assignOtherSet = async () => {
    try {
      setVisible(true);
      const response = await apiPut(
        `${Api.mediatorUserSet}?folderId=${selectedFolderId}&setId=${setId}&userId=${global?.user?._id}`,
      );
      console.log('response', response);
      if (response?.success) {
        navigation.goBack();
        getFolderData(true, response?.message);
      }
    } catch (error) {
      console.error('Error in assigning folder', error);
    }
  };
  // ?userId&setId&folderId
  // =================================================================== //

  const renderFolder = useCallback(
    ({item, index}) => {
      const selected = selectedFolderId === item?._id;
      return (
        <Pressable
          style={[
            styles.folderItem,
            {
              borderColor: selected ? Color.Black : Color.transparent,
              borderWidth: selected ? scale(1.5) : scale(0),
              backgroundColor: item?.isHighlight
                ? item.color
                : colorTheme.listAndBoxColor,
            },
          ]}
          onPress={() => {
            setSelectedFolderId(item?._id);
            setNofolderClick(false);
          }}>
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
    [selectedFolderId],
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
        plusIconAction={() => refRBSheet.current.open()}
      />
    ),
    [],
  );

  const BottomSheets = useCallback(
    () => (
      <RBSheet
        ref={refRBSheet}
        height={verticalScale(410)}
        openDuration={250}
        customStyles={{
          container: [
            styles.bottomSheetContainer,
            {backgroundColor: colorTheme.background},
          ],
        }}>
        <View style={styles.sheetContainer}>
          <BottomSheetContent
            closeBottomSheet={() => refRBSheet.current.close()}
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
      </RBSheet>
    ),
    [folderName, folderStatus, folderColor, colorView],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <View style={[styles.container, {backgroundColor: colorTheme.background1}]}>
      <Loader visible={visible} />
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
        {screen == 'OtherUserScreen' && (
          <Pressable
            style={[
              styles.noFolderView,
              {borderWidth: noFolderClick ? 1.5 : 0, borderColor: Color.Black},
            ]}
            onPress={() => {
              setSelectedFolderId('');
              setNofolderClick(!noFolderClick);
            }}>
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
          // position="absolute"
          bottom={verticalScale(10)}
          onPress={() => {
            if (selectedFolderId || noFolderClick) {
              screen == 'OtherUserScreen' ? assignOtherSet() : assignFolder();
            } else {
              showMessageonTheScreen(strings.pleaseSelectFolder);
            }
          }}
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
  bottomSheetContainer: {
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
    maxHeight: verticalScale(410),
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
