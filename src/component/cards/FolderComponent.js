import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState, useCallback, useEffect} from 'react';
import Color from '../Color';
import Font from '../Font';
import {scale, verticalScale} from '../../custome/Responsive';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeModal from '../../custome/CustomeModal';
import ModalContent from './ModalContent';
import CustomeButton from '../../custome/CustomeButton';
import BottomSheetContent from '../BottomSheetContent';
import {apiDelete, apiGet, apiPost, apiPut} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import Loader from '../Loader';
import showMessageonTheScreen from '../ShowMessageOnTheScreen';
import NoDataView from '../NoDataView';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import useTheme from '../Theme';
import strings from '../../language/strings';
import ActionSheet from 'react-native-actions-sheet';

const FolderComponent = ({
  onFolderClick,
  handleCreateSetClick,
  setLoading,
  search,
  setSearchValue,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [editBottomSheet, setEditBottomSheet] = useState(false);
  const [visible, setVisible] = useState(false);
  const [folderData, setFolderData] = useState([]);
  const [singleFolderItem, setSingleFolderItem] = useState({});
  const [folderName, setFolderName] = useState('');
  const [folderStatus, setFolderStatus] = useState(0);
  const [folderColor, setFolderColor] = useState('');
  const [colorView, setColorView] = useState(false);
  const threeDotIconRef = useRef(null);
  const refRBSheet = useRef();
  const colorTheme = useTheme();

  useEffect(() => {
    getFolderData(false);
  }, [getFolderData]);

  useEffect(() => {
    getFolderData(true, '');
  }, [search, getFolderData]);

  useEffect(() => {
    if (singleFolderItem) {
      setFolderName(singleFolderItem?.name);
      setFolderStatus(singleFolderItem?.isPrivate === true ? 1 : 0);
      setFolderColor(singleFolderItem?.color);
    }
  }, [singleFolderItem]);

  // ================================== Api =================================== //

  const getFolderData = useCallback(
    async (message, messageValue) => {
      message === false && setVisible(true);
      search && setLoading(true);
      try {
        const response = await apiGet(
          `${Api.Folder}?userId=${global?.user?._id}&search=${search}`,
        );
        setFolderData(response);
        messageValue && showMessageonTheScreen(messageValue);
      } catch (error) {
        console.log('error in get folder api', error);
      } finally {
        setVisible(false);
        setLoading(false);
      }
    },
    [search, setLoading],
  );

  const createFolder = useCallback(async () => {
    const rawData = {
      name: folderName,
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
      console.log('error in create folder api', error);
    }
  }, [colorView, folderColor, folderName, getFolderData]);

  const editFolder = useCallback(async () => {
    const rawData = {
      _id: singleFolderItem?._id,
      name: folderName,
      color: folderColor,
      userId: global?.user?._id,
      isHighlight: colorView,
    };
    closeModal();
    setVisible(true);
    try {
      const response = await apiPut(Api.Folder, '', JSON.stringify(rawData));
      setFolderName('');
      setFolderStatus(0);
      setFolderColor('');
      getFolderData(true, response?.message);
    } catch (error) {
      console.log('error in edit folder api', error);
    }
  }, [
    closeModal,
    colorView,
    folderColor,
    folderName,
    getFolderData,
    singleFolderItem,
  ]);

  const deleteFolder = async () => {
    try {
      setVisible(true);
      const response = await apiDelete(
        `${Api.Folder}?_id=${singleFolderItem?._id}`,
      );
      getFolderData(true, response?.message);
    } catch (error) {
      console.log('error in delete folder api', error);
    }
  };

  // ================================== End =================================== //

  const openModal = useCallback((item, isLastItem) => {
    threeDotIconRef.current.measureInWindow((x, y, width, height) => {
      const offsetY = isLastItem ? -height - 15 : height + 15;
      setModalPosition({x: x - width * 3.2, y: y + offsetY});
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
          style={[
            styles.folderItem,
            {
              backgroundColor: item?.isHighlight
                ? item.color
                : colorTheme.listAndBoxColor,
            },
          ]}
          onPress={() => {
            onFolderClick(item._id);
            setSearchValue('');
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
              {item.name}
            </Text>
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
    [
      openModal,
      colorView,
      colorTheme.listAndBoxColor,
      colorTheme.textColor,
      folderData,
      onFolderClick,
      setSearchValue,
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
            title={editBottomSheet ? strings.editFolder : strings.createFolder}
            name={folderName}
            setName={setFolderName}
            status={folderStatus}
            setStatus={setFolderStatus}
            color={folderColor}
            setColor={setFolderColor}
            setColorView={setColorView}
            colorView={colorView}
            create={editBottomSheet ? editFolder : createFolder}
            initialData={singleFolderItem ? singleFolderItem : ''}
          />
        </View>
      </ActionSheet>
    );
  }, [
    folderName,
    folderStatus,
    folderColor,
    editBottomSheet,
    colorView,
    singleFolderItem,
    colorTheme.background,
    createFolder,
    editFolder,
  ]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderBody = () => {
    return (
      <View style={styles.bodyContainer}>
        <Pressable
          style={styles.folderContainer}
          onPress={() => {
            onFolderClick('');
            setSearchValue('');
          }}>
          <Text style={styles.folderText}>{strings.allSet}</Text>
        </Pressable>

        {folderData?.length > 0 ? (
          <FlatList
            data={folderData}
            renderItem={renderFolder}
            keyExtractor={keyExtractor}
            style={styles.flatlist}
          />
        ) : (
          visible === false && (
            <NoDataView
              content={strings.folderNotFound}
              noDataViewStyle={{marginTop: verticalScale(-70)}}
            />
          )
        )}

        {BottomSheets()}

        <CustomeButton
          buttonColor={Color.theme1}
          buttonWidth="100%"
          buttonHeight={scale(45)}
          title={strings.createFolder}
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
        backgroundColor={colorTheme.modelBackground}
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
        width={wp('40%')}
        justifyContent="flex-end"
        borderRadius={20}
        modalContainerStyle={[
          styles.modal,
          {backgroundColor: colorTheme.modelBackgroundView},
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
  bodyContainer: {flex: 1},
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
    width: scale(200),
  },
  dotsIcon: {
    backgroundColor: Color.WhiteDefault,
    borderRadius: scale(5),
    padding: scale(10),
  },
  modal: {
    position: 'absolute',
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
