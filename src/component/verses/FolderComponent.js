import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useMemo, useRef, useState, useCallback, useEffect} from 'react';
import Color from '../Color';
import Font from '../Font';
import {scale, verticalScale} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeModal from '../../custome/CustomeModal';
import ModalContent from './ModalContent';
import CustomeButton from '../../custome/CustomeButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheetContent from '../BottomSheetContent';
import {useNavigation} from '@react-navigation/native';
import {apiDelete, apiGet, apiPost, apiPut} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import Loader from '../Loader';
import showMessageonTheScreen from '../ShowMessageOnTheScreen';
import {useSelector} from 'react-redux';

const {height, width} = Dimensions.get('window');

const FolderComponent = ({onFolderClick, handleCreateSetClick}) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [editBottomSheet, setEditBottomSheet] = useState(false);
  const [visible, setVisible] = useState(false);
  const [folderData, setFolderData] = useState([]);
  const [singleFolderItem, setSingleFolderItem] = useState({});
  const [folderName, setFolderName] = useState('');
  const [folderStatus, setFolderStatus] = useState(0);
  const [folderColor, setFolderColor] = useState('');
  const threeDotIconRef = useRef(null);
  const refRBSheet = useRef();
  const {cardTypeId} = useSelector(state => state.myState);

  useEffect(() => {
    getFolderData();
  }, []);

  useEffect(() => {
    if (singleFolderItem) {
      setFolderName(singleFolderItem?.name);
      setFolderStatus(singleFolderItem?.isPrivate == true ? 1 : 0);
      setFolderColor(singleFolderItem?.color);
    }
  }, [singleFolderItem]);

  // ================================== Api =================================== //

  const getFolderData = async (message = '') => {
    !message && setVisible(true);
    try {
      const response = await apiGet(
        `${Api.Folder}?userId=${global?.user?._id}`,
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
      color: folderColor,
      userId: global?.user?._id,
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

  const editFolder = async () => {
    const rawData = {
      _id: singleFolderItem?._id,
      name: folderName,
      color: folderColor,
      userId: global?.user?._id,
    };
    closeModal();
    setVisible(true);
    try {
      const response = await apiPut(Api.Folder, '', JSON.stringify(rawData));
      setFolderName('');
      setFolderStatus(0);
      setFolderColor('');
      getFolderData(response?.message);
    } catch (error) {
      console.log('error in edit folder api', error);
    }
  };

  const deleteFolder = async () => {
    try {
      setVisible(true);
      const response = await apiDelete(
        `${Api.Folder}?_id=${singleFolderItem?._id}`,
      );
      getFolderData(response?.message);
    } catch (error) {
      console.log('error in delete folder api', error);
    }
  };

  // ================================== End =================================== //

  const openModal = useCallback((item, isLastItem) => {
    threeDotIconRef.current.measureInWindow((x, y, width, height) => {
      const offsetY = isLastItem ? -height - 15 : height + 15;
      setModalPosition({x: x - width * 3.3, y: y + offsetY});
      setModalVisible(true);
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const renderFolder = useCallback(
    ({item, index}) => {
      const isLastItem = index === folderData.length - 1;
      return (
        <Pressable
          style={styles.folderItem}
          onPress={() => {
            onFolderClick(item._id);
          }}>
          <View style={styles.folderInfo}>
            <View style={[styles.iconColor, {backgroundColor: item.color}]} />
            <Text style={styles.folderName}>{item.name}</Text>
          </View>
          <Pressable
            ref={threeDotIconRef}
            onPress={() => {
              setSingleFolderItem(item);
              openModal(item, isLastItem);
            }}>
            <Entypo
              name="dots-three-vertical"
              size={scale(13)}
              color={Color.Black}
              style={styles.dotsIcon}
            />
          </Pressable>
        </Pressable>
      );
    },
    [openModal],
  );

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
        height={height * 0.65}
        openDuration={250}
        draggable={true}
        customStyles={{
          container: styles.bottomSheetContainer,
        }}>
        <View style={styles.sheetContainer}>
          <BottomSheetContent
            closeBottomSheet={closeBottomSheet}
            title={editBottomSheet ? 'EDIT FOLDER' : 'CREATE FOLDER'}
            name={folderName}
            setName={setFolderName}
            status={folderStatus}
            setStatus={setFolderStatus}
            color={folderColor}
            setColor={setFolderColor}
            create={editBottomSheet ? editFolder : createFolder}
            initialData={singleFolderItem ? singleFolderItem : ''}
          />
        </View>
      </RBSheet>
    );
  }, [folderName, folderStatus, folderColor, editBottomSheet]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderBody = () => {
    return (
      <View style={{flex: 1}}>
        <Pressable
          style={styles.folderContainer}
          onPress={() => onFolderClick('')}>
          <Text style={styles.folderText}>ALL SETS</Text>
        </Pressable>

        <FlatList
          data={folderData}
          renderItem={renderFolder}
          keyExtractor={keyExtractor}
          style={styles.flatlist}
        />
        {BottomSheets()}

        <CustomeButton
          buttonColor={Color.theme1}
          buttonWidth="100%"
          buttonHeight={scale(45)}
          title="CREATE FOLDER"
          borderRadius={scale(10)}
          fontSize={scale(15)}
          fontColor={Color.White}
          fontFamily={Font.semiBold}
          marginTop={verticalScale(15)}
          position={'absolute'}
          bottom={verticalScale(10)}
          onPress={() => {
            setEditBottomSheet(false);
            setSingleFolderItem({});
            openBottomSheet();
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Loader visible={visible} />
      {renderBody()}
      <CustomeModal
        visible={modalVisible}
        onClose={closeModal}
        closeModal={false}
        mainPadding={scale(5)}
        content={
          <ModalContent
            closeModal={closeModal}
            type={'Folder'}
            openBottomSheet={openBottomSheet}
            setEditBottomSheet={setEditBottomSheet}
            deleteData={deleteFolder}
            handleCreateSetClick={handleCreateSetClick}
            singleItem={singleFolderItem}
          />
        }
        width={scale(145)}
        height={scale(165)}
        justifyContent="flex-end"
        borderRadius={20}
        modalContainerStyle={[
          styles.modal,
          {top: modalPosition.y, left: modalPosition.x},
        ]}
      />
    </View>
  );
};

export default FolderComponent;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(15),
    marginTop: verticalScale(15),
    flex: 1,
  },
  flatlist: {marginTop: verticalScale(10), marginBottom: verticalScale(55)},
  folderContainer: {
    backgroundColor: Color.White,
    borderRadius: scale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(7),
  },
  folderText: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(15),
    paddingVertical: verticalScale(3.5),
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
  modal: {
    position: 'absolute',
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
