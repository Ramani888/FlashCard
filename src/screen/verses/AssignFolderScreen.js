import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import CustomeHeader from '../../custome/CustomeHeader';
import Color from '../../component/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import CustomeButton from '../../custome/CustomeButton';
import Entypo from 'react-native-vector-icons/Entypo';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheetContent from '../../component/BottomSheetContent';
import Font from '../../component/Font';
import {useRoute} from '@react-navigation/native';
import {apiGet, apiPost} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import Loader from '../../component/Loader';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';

const AssignFolderScreen = () => {
  const route = useRoute();
  const refRBSheet = useRef();
  const [visible, setVisible] = useState(false);
  const [folderData, setFolderData] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [folderStatus, setFolderStatus] = useState(0);
  const [folderColor, setFolderColor] = useState('');
  const {cardTypeId} = route.params;

  useEffect(() => {
    getFolderData();
  }, []);

  // ================================== Api =================================== //

  const getFolderData = async (message = '') => {
    !message && setVisible(true);
    try {
      const response = await apiGet(
        `${Api.Folder}?cardTypeId=${cardTypeId}&userId=66da263e4d3998cb710a0487`,
      );
      setFolderData(response);
      message && showMessageonTheScreen(message);
    } catch (error) {
      console.log('error in get folder api', error);
    } finally {
      setVisible(false);
    }
  };

  const createFolder = async () => {
    const rawData = {
      name: folderName,
      isPrivate: folderStatus,
      color: folderColor,
      cardTypeId: cardTypeId,
      userId: '66da263e4d3998cb710a0487',
    };
    setVisible(true);
    try {
      const response = await apiPost(Api.Folder, '', JSON.stringify(rawData));
      setFolderName('');
      setFolderStatus(0);
      setFolderColor('');
      getFolderData(response?.message);
    } catch (error) {
      console.log('error in create folder api', error);
    }
  };

  // ================================== Api =================================== //

  const renderHeader = () => {
    return (
      <CustomeHeader
        goBack={true}
        title={'SELECT FOLDER'}
        plusButton={true}
        iconColor={Color.White}
        iconStyle={styles.iconStyle}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
        plusIconAction={openBottomSheet}
      />
    );
  };

  const renderFolder = useCallback(({item, index}) => {
    const isLastItem = index === folderData.length - 1;
    return (
      <Pressable style={styles.folderItem} onPress={() => ''}>
        <View style={styles.folderInfo}>
          <View style={[styles.iconColor, {backgroundColor: item.color}]} />
          <Text style={styles.folderName}>{item?.name}</Text>
        </View>
      </Pressable>
    );
  }, []);

  const openBottomSheet = () => {
    refRBSheet.current.open();
  };

  const closeBottomSheet = () => {
    refRBSheet.current.close();
  };

  const BottomSheets = useCallback(() => {
    return (
      <RBSheet
        ref={refRBSheet}
        height={verticalScale(510)}
        openDuration={250}
        draggable={true}
        customStyles={{
          container: styles.bottomSheetContainer,
        }}>
        <View style={styles.sheetContainer}>
          <BottomSheetContent
            closeBottomSheet={closeBottomSheet}
            title={'CREATE FOLDER'}
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
    );
  }, [folderName, folderStatus, folderColor]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderBody = () => {
    return (
      <View
        style={{
          flex: 1,
          marginHorizontal: verticalScale(15),
          marginVertical: verticalScale(10),
        }}>
        <View style={styles.folderContainer}>
          <Text style={styles.folderText}>TRINITY</Text>
        </View>

        <FlatList
          data={folderData}
          renderItem={renderFolder}
          keyExtractor={keyExtractor}
          style={{marginTop: verticalScale(10)}}
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
          position={'absolute'}
          bottom={verticalScale(10)}
          onPress={() => refRBSheet.current.open()}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Loader visible={visible} />
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

export default React.memo(AssignFolderScreen);

const styles = StyleSheet.create({
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
  folderContainer: {
    backgroundColor: Color.SandyBrown,
    borderRadius: scale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(10),
  },
  folderText: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(15),
  },

  folderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(7),
    backgroundColor: Color.White,
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
  dotsIcon: {
    backgroundColor: Color.WhiteDefault,
    borderRadius: scale(5),
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
});
