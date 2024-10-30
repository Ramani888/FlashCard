import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
// import {scale, verticalScale} from 'react-native-size-matters';
import {scale, verticalScale} from '../../custome/Responsive';
import Color from '../Color';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeButton from '../../custome/CustomeButton';
import Font from '../Font';
import CustomeModal from '../../custome/CustomeModal';
import ImageModalContent from './ImageModalContent';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImageBottomSheetContent from './ImageBottomSheetContent';
import {apiDelete, apiGet, apiPost, apiPut} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import Loader from '../Loader';
import showMessageonTheScreen from '../ShowMessageOnTheScreen';
import NoDataView from '../NoDataView';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';

const {height, width} = Dimensions.get('window');

const ImageComponent = ({folderId}) => {
  const navigation = useNavigation();
  const threeDotIconRef = useRef(null);
  const refRBSheet = useRef(null);
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [imageData, setImageData] = useState([]);
  const [imageId, setImageId] = useState('');
  const [editImageBottomsheet, setEditImageBottomsheet] = useState(false);

  useEffect(() => {
    getImagesData(false);
  }, [isFocused]);

  // ==================================== Api ==================================== //

  const getImagesData = async (message, messageValue) => {
    try {
      message == false && setVisible(true);
      const url = folderId
        ? `${Api.folderImage}?userId=${global?.user?._id}&folderId=${folderId}`
        : `${Api.Images}?userId=${global?.user?._id}`;
      const response = await apiGet(url);
      if (response) {
        setImageData(response);
        message && showMessageonTheScreen(messageValue);
      }
    } catch (error) {
      console.log('error in get images data api', error);
    } finally {
      setVisible(false);
    }
  };

  const uploadeImage = async imageFile => {
    var formdata = new FormData();
    formdata.append('image', imageFile);
    formdata.append('userId', global.user?._id);
    try {
      setVisible(true);
      const response = await apiPost(Api.Images, '', formdata);
      if (response?.success == true) {
        getImagesData(true, response?.message);
      }
    } catch (error) {
      console.log('error in upload image api', error);
    }
  };

  const deleteImage = async imageId => {
    try {
      setVisible(true);
      const response = await apiDelete(`${Api.Images}?_id=${imageId}`);
      if (response?.success == true) {
        getImagesData(true, response?.message);
      }
    } catch (error) {
      console.log('error in delete pdf api', error);
    }
  };

  // ==================================== Api ==================================== //

  const openModal = useCallback((isLastItem, index) => {
    const xOffset = index % 3 === 0;
    console.log('xOffset', xOffset);

    threeDotIconRef.current.measureInWindow((x, y, width, height) => {
      setModalPosition({
        x: x - (xOffset ? width * 2.7 : width * 3.8),
        y: y + (height + 5),
      });
      setModalVisible(true);
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
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
        height={verticalScale(235)}
        openDuration={250}
        draggable={true}
        customStyles={{
          container: styles.bottomSheetContainer,
        }}>
        <View style={styles.sheetContainer}>
          <ImageBottomSheetContent
            closeBottomSheet={closeBottomSheet}
            title={'UPLOADE IMAGES'}
            uploadeImage={uploadeImage}
          />
        </View>
      </RBSheet>
    );
  }, [uploadeImage]);

  const renderImage = useCallback(
    ({item, index}) => {
      const isLastItem = index === imageData.length - 1;
      return (
        <View>
          <View style={styles.imageContainer}>
            <Pressable
              onPress={() =>
                navigation.navigate(ScreenName.viewFullImage, {
                  data: imageData,
                  imageIndex: index,
                })
              }>
              <Image
                source={{uri: item?.url}}
                style={styles.image}
                resizeMode="cover"
              />
            </Pressable>
            <Pressable
              ref={threeDotIconRef}
              onPress={() => {
                setImageId(item?._id);
                openModal(isLastItem, index);
              }}
              style={styles.pressableIcon}>
              <Entypo
                name="dots-three-vertical"
                size={scale(13)}
                color={Color.Black}
                style={styles.dotsIcon}
              />
            </Pressable>
          </View>
          <View
            style={[styles.folderContainer, item?.folderName && styles.folder]}>
            <Image
              source={require('../../Assets/Img/folder.png')}
              style={[
                styles.folderIcon,
                {marginRight: item?.folderName ? '' : scale(-10)},
              ]}
            />
            <Text
              style={[
                styles.folderText,
                {width: item?.folderName?.length > 12 ? scale(68) : ''},
              ]}>
              {item?.folderName ? item?.folderName : ''}
            </Text>
          </View>
        </View>
      );
    },
    [imageData],
  );

  const renderBody = () => {
    return (
      <View style={styles.bodyContainer}>
        {imageData?.length > 0 ? (
          <FlatList
            data={imageData}
            renderItem={renderImage}
            numColumns={3}
            keyExtractor={(_, index) => index.toString()}
            style={{marginBottom: verticalScale(10)}}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          visible == false && <NoDataView content={'Image not found'} />
        )}
        {BottomSheets()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Loader visible={visible} />
      {renderBody()}
      <CustomeButton
        buttonColor={Color.theme1}
        buttonWidth="90%"
        buttonHeight={scale(45)}
        title="UPLOAD IMAGES"
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={Color.White}
        fontFamily={Font.semiBold}
        marginTop={verticalScale(15)}
        position="absolute"
        alignSelf="center"
        bottom={verticalScale(10)}
        onPress={() => {
          openBottomSheet();
        }}
      />
      <CustomeModal
        visible={modalVisible}
        onClose={closeModal}
        closeModal={false}
        mainPadding={scale(5)}
        content={
          <ImageModalContent
            closeModal={closeModal}
            type={'Image'}
            openBottomSheet={openBottomSheet}
            setEditBottomSheet={setEditImageBottomsheet}
            deleteItem={deleteImage}
            imageId={imageId}
          />
        }
        width={'40%'}
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

export default React.memo(ImageComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    marginBottom: verticalScale(60),
  },
  imageContainer: {
    margin: scale(5.5),
    position: 'relative',
  },
  image: {
    width: scale(105),
    height: scale(105),
    borderRadius: scale(10),
  },
  pressableIcon: {
    position: 'absolute',
    right: scale(5),
    top: verticalScale(5),
  },
  dotsIcon: {
    backgroundColor: Color.WhiteDefault,
    borderRadius: scale(5),
    padding: scale(7),
  },
  bottomSheetContainer: {
    // flex:0.6,
    alignItems: 'center',
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
  },
  sheetContainer: {
    flexDirection: 'row',
    gap: scale(50),
    marginVertical: verticalScale(10),
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
  folderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
    backgroundColor: Color.White,
    borderRadius: scale(5),
    marginRight: scale(6),
    alignSelf: 'flex-start',
    marginLeft: scale(6),
  },
  folderIcon: {
    width: scale(26),
    height: scale(26),
  },
  folderText: {
    fontSize: scale(11),
    color: Color.Black,
    fontFamily: Font.regular,
    textTransform: 'capitalize',
    marginRight: scale(5),
    width: scale(60),
  },
  folder: {
    width: scale(102),
    paddingRight: scale(5),
  },
});
