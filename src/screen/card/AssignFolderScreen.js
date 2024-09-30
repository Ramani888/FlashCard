import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import CustomeHeader from '../../custome/CustomeHeader';
import CustomeButton from '../../custome/CustomeButton';
import Entypo from 'react-native-vector-icons/Entypo';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheetContent from '../../component/BottomSheetContent';
import Color from '../../component/Color';
import Font from '../../component/Font';
import Loader from '../../component/Loader';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import { apiGet, apiPost, apiPut } from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import { scale, verticalScale } from 'react-native-size-matters';

const {height, width} = Dimensions.get('window');

const AssignFolderScreen = () => {
  const navigation = useNavigation()
  const route = useRoute();
  const refRBSheet = useRef(null); 
  const { setId } = route.params;

  const [visible, setVisible] = useState(false);
  const [folderData, setFolderData] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [folderStatus, setFolderStatus] = useState(0);
  const [folderColor, setFolderColor] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');

  useEffect(() => {
    getFolderData();
  }, []);

  // ============================ API Calls ============================ //

  const getFolderData = async (message = false, messageValue) => {
    if (!message) setVisible(true);
    try {
      const response = await apiGet(`${Api.Folder}?userId=${global?.user?._id}`);
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
      const response = await apiPut(`${Api.assignedFolder}?folderId=${selectedFolderId}&setId=${setId}`);
      if (response?.success) {
        navigation.goBack()
        getFolderData(true, response?.message);
      }
    } catch (error) {
      console.error('Error in assigning folder', error);
    }
  };
  // =================================================================== //

  const renderFolder = useCallback(
    ({ item, index }) => {
      const selected = selectedFolderId === item?._id;
      return (
        <Pressable
          style={[styles.folderItem, { backgroundColor: selected ? Color.DarkGray : Color.White }]}
          onPress={() => setSelectedFolderId(item?._id)}
        >
          <View style={styles.folderInfo}>
            <View style={[styles.iconColor, { backgroundColor: item.color }]} />
            <Text style={styles.folderName}>{item?.name}</Text>
          </View>
        </Pressable>
      );
    },
    [selectedFolderId]
  );

  const renderHeader = useMemo(
    () => (
      <CustomeHeader
        goBack={true}
        title="SELECT FOLDER"
        plusButton={true}
        iconColor={Color.White}
        iconStyle={styles.iconStyle}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
        plusIconAction={() => refRBSheet.current.open()}
      />
    ),
    []
  );

  const BottomSheets = useCallback(() => (
    <RBSheet
      ref={refRBSheet}
      height={height*0.65}
      openDuration={250}
      customStyles={{ container: styles.bottomSheetContainer }}
    >
      <View style={styles.sheetContainer}>
        <BottomSheetContent
          closeBottomSheet={() => refRBSheet.current.close()}
          title="CREATE FOLDER"
          name={folderName}
          setName={setFolderName}
          status={folderStatus}
          setStatus={setFolderStatus}
          color={folderColor}
          setColor={setFolderColor}
          create={createFolder}
        />
      </View>
    </RBSheet>
  ), [folderName, folderStatus, folderColor]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <View style={styles.container}>
      <Loader visible={visible} />
      {renderHeader}
      <View style={styles.bodyContainer}>
        <FlatList
          data={folderData}
          renderItem={renderFolder}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.flatListContainer}
        />
        {BottomSheets()}
        <CustomeButton
          buttonColor={Color.theme1}
          buttonWidth="100%"
          buttonHeight={scale(45)}
          title="MOVE INTO SELECTED"
          borderRadius={scale(10)}
          fontSize={scale(15)}
          fontColor={Color.White}
          fontFamily={Font.semiBold}
          marginTop={verticalScale(15)}
          position="absolute"
          bottom={verticalScale(10)}
          onPress={assignFolder}
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
  },
  bottomSheetContainer: {
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
  },
  sheetContainer: {
    flexDirection: 'row',
    gap: scale(50),
    marginVertical: verticalScale(15),
  },
});
