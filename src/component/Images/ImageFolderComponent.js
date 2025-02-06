import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import CustomeButton from '../../custome/CustomeButton';
import Color from '../Color';
import {scale, verticalScale} from '../../custome/Responsive';
import Font from '../Font';
import Api from '../../Api/EndPoint';
import {apiDelete, apiGet, apiPost, apiPut} from '../../Api/ApiService';
import showMessageonTheScreen from '../ShowMessageOnTheScreen';
import CustomeModal from '../../custome/CustomeModal';
import BottomSheetContent from '../BottomSheetContent';
import Entypo from 'react-native-vector-icons/Entypo';
import Loader from '../Loader';
import ImageModalContent from './ImageModalContent';
import NoDataView from '../NoDataView';
import useTheme from '../Theme';
import strings from '../../language/strings';
import ActionSheet from 'react-native-actions-sheet';

const {height} = Dimensions.get('window');

const ImageFolderComponent = ({onFolderClick}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [editBottomSheet, setEditBottomSheet] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pdfFolderdata, setPdfFolderData] = useState([]);
  const [singleFolderItem, setSingleFolderItem] = useState({});
  const [folderName, setFolderName] = useState('');
  const [folderStatus, setFolderStatus] = useState(0);
  const [folderColor, setFolderColor] = useState('');
  const [colorView, setColorView] = useState(false);
  const threeDotIconRef = useRef(null);
  const refRBSheet = useRef();
  const colorTheme = useTheme();

  useEffect(() => {
    getImageFolderData(false);
  }, []);

  // ================================== Api =================================== //

  const getImageFolderData = async (message, messageValue) => {
    message === false && setVisible(true);
    try {
      const response = await apiGet(
        `${Api.imageFolder}?userId=${global?.user?._id}`,
      );
      setPdfFolderData(response);
      message && showMessageonTheScreen(messageValue);
    } catch (error) {
      console.log('error in get pdf folder api', error);
    } finally {
      setVisible(false);
    }
  };

  const createImageFolder = useCallback(async () => {
    const rawData = {
      name: folderName,
      color: folderColor,
      userId: global?.user?._id,
      isHighlight: colorView,
    };
    setVisible(true);
    try {
      const response = await apiPost(
        Api.imageFolder,
        '',
        JSON.stringify(rawData),
      );
      setFolderName('');
      setFolderStatus(0);
      setFolderColor('');
      getImageFolderData(true, response?.message);
    } catch (error) {
      console.log('error in create pdf folder api', error);
    }
  }, [colorView, folderColor, folderName]);

  const editImageFolder = useCallback(async () => {
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
      const response = await apiPut(
        Api.imageFolder,
        '',
        JSON.stringify(rawData),
      );
      setFolderName('');
      setFolderStatus(0);
      setFolderColor('');
      getImageFolderData(true, response?.message);
    } catch (error) {
      console.log('error in edit pdf folder api', error);
    }
  }, [closeModal, colorView, folderColor, folderName, singleFolderItem]);

  const deletePdfFolder = async () => {
    try {
      setVisible(true);
      const response = await apiDelete(
        `${Api.imageFolder}?_id=${singleFolderItem?._id}`,
      );
      getImageFolderData(true, response?.message);
    } catch (error) {
      console.log('error in delete pdf folder api', error);
    }
  };

  // ================================== Api =================================== //

  const openModal = useCallback((item, isLastItem) => {
    threeDotIconRef.current.measureInWindow((x, y, width, height) => {
      const offsetY = isLastItem ? -height - 15 : height + 15;
      setModalPosition({x: x - scale(117), y: y + offsetY});
      setModalVisible(true);
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

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
            create={editBottomSheet ? editImageFolder : createImageFolder}
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
    colorTheme,
    createImageFolder,
    editImageFolder,
    singleFolderItem,
  ]);

  const renderFolder = useCallback(
    ({item, index}) => {
      const isLastItem = index === pdfFolderdata.length - 1;

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
              style={[
                styles.dotsIcon,
                {
                  backgroundColor: item?.isHighlight
                    ? Color.White
                    : colorTheme.threeDotIcon,
                },
              ]}
            />
          </Pressable>
        </Pressable>
      );
    },
    [openModal, colorTheme, colorView, onFolderClick, pdfFolderdata],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderBody = () => {
    return (
      <View style={styles.bodyContainer}>
        <Pressable
          style={styles.folderContainer}
          onPress={() => onFolderClick('')}>
          <Text style={styles.folderText}>{strings.allImages}</Text>
        </Pressable>

        {pdfFolderdata?.length > 0 ? (
          <FlatList
            data={pdfFolderdata}
            renderItem={renderFolder}
            keyExtractor={keyExtractor}
            style={styles.flatlist}
            showsVerticalScrollIndicator={false}
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
    <View style={styles.mainContainer}>
      <Loader visible={visible} />
      {renderBody()}
      <CustomeModal
        visible={modalVisible}
        onClose={closeModal}
        closeModal={false}
        mainPadding={scale(5)}
        backgroundColor={colorTheme.modelBackground}
        content={
          <ImageModalContent
            closeModal={closeModal}
            type={'Folder'}
            openBottomSheet={openBottomSheet}
            setEditBottomSheet={setEditBottomSheet}
            deleteItem={deletePdfFolder}
            singleItem={singleFolderItem}
            colorTheme={colorTheme}
          />
        }
        width={scale(155)}
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

export default ImageFolderComponent;

const styles = StyleSheet.create({
  mainContainer: {flex: 1},
  container: {
    marginHorizontal: scale(15),
    marginTop: verticalScale(15),
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    marginHorizontal: scale(15),
    marginTop: verticalScale(15),
  },
  flatlist: {marginTop: verticalScale(10), marginBottom: height * 0.1},
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
    width: '85%',
  },
  dotsIcon: {
    backgroundColor: Color.WhiteDefault,
    borderRadius: scale(5),
    padding: scale(10),
  },
  modal: {
    position: 'absolute',
  },
  sheetContainer: {
    flexDirection: 'row',
    gap: scale(50),
    marginVertical: verticalScale(15),
  },
  indicatorStyle: {
    marginTop: verticalScale(10),
    backgroundColor: Color.mediumGray,
  },
});
