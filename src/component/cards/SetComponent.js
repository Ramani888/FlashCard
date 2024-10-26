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
import Color from '../Color';
import Font from '../Font';
import {scale, verticalScale} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeButton from '../../custome/CustomeButton';
import CustomeModal from '../../custome/CustomeModal';
import ModalContent from './ModalContent';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheetContent from '../BottomSheetContent';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';
import {apiDelete, apiGet, apiPost, apiPut} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import Loader from '../Loader';
import showMessageonTheScreen from '../ShowMessageOnTheScreen';
import {useSelector} from 'react-redux';
import NoDataView from '../NoDataView';

const {height, width} = Dimensions.get('window');

const SetComponent = ({
  folderId,
  openSetSheet,
  setOpenSetSheet,
  setLoading,
  search,
}) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [editBottomSheet, setEditBottomSheet] = useState(false);
  const [singleSetData, setSingleSetData] = useState({});
  const [visible, setVisible] = useState(false);
  const [setData, setSetData] = useState([]);
  const [setName, setSetName] = useState();
  const [setStatus, setSetStatus] = useState(0);
  const [setColor, setSetColor] = useState('');
  const [colorView, setColorView] = useState(false);
  const [setId, setSetId] = useState('');
  const threeDotIconRef = useRef(null);
  const refRBSheet = useRef();

  useEffect(() => {
    getSetData(false);
  }, [isFocused]);

  useEffect(() => {
    getSetData(true, '');
  }, [search]);

  useEffect(() => {
    if (singleSetData) {
      setSetName(singleSetData?.name);
      setSetStatus(singleSetData?.isPrivate == true ? 1 : 0);
      setSetColor(singleSetData?.color);
    }
  }, [singleSetData]);

  useEffect(() => {
    if (openSetSheet) {
      setEditBottomSheet(false);
      setSingleSetData({});
      openBottomSheet();
    }
  }, [openSetSheet]);

  // ===================================== Api ===================================== //

  const getSetData = async (message, messageValue) => {
    message == false && setVisible(true);
    search && setLoading(true);
    try {
      const url = folderId
        ? `${Api.FolderSet}?userId=${global?.user?._id}&folderId=${folderId}&search=${search}`
        : `${Api.Set}?userId=${global?.user?._id}&search=${search}`;
      const response = await apiGet(url);
      setSetData(response);
      messageValue && showMessageonTheScreen(messageValue);
    } catch (error) {
      console.log('error in get folder api', error);
    } finally {
      setVisible(false);
      setLoading(false);
    }
  };

  const createSet = async () => {
    const rawData = {
      name: setName,
      isPrivate: setStatus,
      color: setColor,
      userId: global?.user?._id,
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
  };

  const editSet = async () => {
    const rawData = {
      _id: singleSetData?._id,
      name: setName,
      isPrivate: setStatus,
      color: setColor,
      userId: global?.user?._id,
      isHighlight: colorView,
    };
    closeModal();
    setVisible(true);
    try {
      const response = await apiPut(Api.Set, '', JSON.stringify(rawData));
      setSetName('');
      setSetStatus(0);
      setSetColor('');
      getSetData(true, response?.message);
    } catch (error) {
      console.log('error in edit Set api', error);
    }
  };

  const deleteSet = async () => {
    try {
      setVisible(true);
      const response = await apiDelete(`${Api.Set}?_id=${singleSetData?._id}`);
      getSetData(true, response?.message);
    } catch (error) {
      console.log('error in delete set api', error);
    }
  };

  // ===================================== Api ===================================== //

  const openModal = (item, isLastItem) => {
    threeDotIconRef.current.measureInWindow((x, y, width, height) => {
      const offsetY = isLastItem ? -height - 15 : height + 15;
      setModalPosition({x: x - width * 3.45, y: y + offsetY});
      setModalVisible(true);
    });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openBottomSheet = () => {
    refRBSheet.current.open();
  };

  const closeBottomSheet = () => {
    refRBSheet.current.close();
    setOpenSetSheet(false);
  };

  const renderSet = useCallback(
    ({item, index}) => {
      const isLastItem = index === setData.length - 1;

      return (
        <View style={styles.itemContainer}>
          <Pressable
            style={[
              styles.setContainer,
              {backgroundColor: item?.isHighlight ? item.color : Color.White},
            ]}
            onPress={() =>
              navigation.navigate(ScreenName.setDetail, {
                setName: item?.name,
                setId: item?._id,
                folderId: folderId,
              })
            }>
            <View style={styles.rowContainer}>
              {!colorView && (
                <Text
                  style={[styles.colorBox, {backgroundColor: item?.color}]}
                />
              )}
              <Text style={styles.setTitle}>{item?.name}</Text>
            </View>
            <View style={styles.rowWithGap}>
              <View style={styles.subSetContainer}>
                <Text style={styles.subSetText}>{item?.cardCount}</Text>
                <Image
                  source={require('../../Assets/Img/cardIcon.png')}
                  style={styles.cardIcon}
                  tintColor={Color.Black}
                />
              </View>
              <Pressable
                ref={threeDotIconRef}
                onPress={() => {
                  setSingleSetData(item);
                  setSetId(item?._id);
                  openModal(item, isLastItem);
                }}>
                <Entypo
                  name="dots-three-vertical"
                  size={scale(13)}
                  color={Color.Black}
                  style={styles.dotsIcon}
                />
              </Pressable>
            </View>
          </Pressable>
          <View style={[styles.folderContainer, {alignSelf: 'flex-start'}]}>
            <Image
              source={require('../../Assets/Img/folder.png')}
              style={styles.folderIcon}
            />
            <Text style={[styles.folderText,{marginLeft: item?.folderName ? scale(5) : 0 }]}>
              {item?.folderName ? item?.folderName : ''}
            </Text>
          </View>
        </View>
      );
    },
    [setData],
  );

  const BottomSheets = useCallback(() => {
    return (
      <RBSheet
        ref={refRBSheet}
        height={height * 0.74}
        openDuration={250}
        draggable={true}
        customStyles={{
          container: styles.bottomSheetContainer,
        }}>
        <View style={styles.sheetContainer}>
          <BottomSheetContent
            closeBottomSheet={closeBottomSheet}
            title={editBottomSheet ? 'EDIT SET' : 'CREATE SET'}
            name={setName}
            setName={setSetName}
            status={setStatus}
            setStatus={setSetStatus}
            color={setColor}
            setColor={setSetColor}
            setColorView={setColorView}
            colorView={colorView}
            create={editBottomSheet ? editSet : createSet}
            initialData={singleSetData ? singleSetData : ''}
          />
        </View>
      </RBSheet>
    );
  }, [setName, setStatus, setColor, editBottomSheet, colorView, singleSetData]);

  const renderBody = () => (
    <View style={styles.bodyContainer}>
      {setData?.length > 0 ? (
        <FlatList
          data={setData}
          renderItem={renderSet}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
        />
      ) : (
        visible == false && <NoDataView content={'Set not found'} />
      )}
      <CustomeButton
        buttonColor={Color.theme1}
        buttonWidth="100%"
        buttonHeight={scale(45)}
        title="CREATE SET"
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={Color.White}
        fontFamily={Font.semiBold}
        marginTop={verticalScale(15)}
        position={'absolute'}
        bottom={verticalScale(10)}
        onPress={() => {
          setEditBottomSheet(false);
          setSingleSetData({});
          openBottomSheet();
        }}
      />
      {BottomSheets()}
    </View>
  );

  return (
    <View style={{flex: 1}}>
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
            type={'Set'}
            openBottomSheet={openBottomSheet}
            setEditBottomSheet={setEditBottomSheet}
            deleteData={deleteSet}
            folderId={folderId}
            setId={setId}
            singleItem={singleSetData}
            getSetData={getSetData}
          />
        }
        width={'43.5%'}
        height={scale(195)}
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

export default React.memo(SetComponent);

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    marginHorizontal: scale(15),
    marginTop: verticalScale(20),
    paddingBottom: verticalScale(55),
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
    borderRadius: scale(10),
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bibleIcon: {
    width: scale(13),
    height: scale(40),
  },
  colorBox: {
    width: scale(13),
    height: verticalScale(35),
    borderRadius: scale(10),
  },
  setTitle: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(10),
    width: scale(200),
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
  folderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: scale(10),
    backgroundColor: Color.White,
    height: scale(35),
    borderRadius: scale(10),
    marginTop: verticalScale(5),
    paddingHorizontal: scale(5),
    alignSelf: 'flex-start',
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
    marginVertical: height*0.01,
  },
});
