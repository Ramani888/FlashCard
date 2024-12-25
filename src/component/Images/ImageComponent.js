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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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
import useTheme from '../Theme';
import strings from '../../language/strings';

const ImageComponent = ({folderId, showFolder}) => {
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
  const colorTheme = useTheme();

  useEffect(() => {
    getImagesData(false);
  }, [isFocused]);

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

  const openModal = useCallback((isLastItem, index) => {
    const xOffset = index % 3 === 0;

    threeDotIconRef.current.measureInWindow((x, y, width, height) => {
      setModalPosition({
        x: x - (xOffset ? wp('22%') : wp('32%')),
        y: y + hp('4%'),
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
        height={hp('33.2%')}
        openDuration={250}
        draggable={true}
        customStyles={{
          container: [
            styles.bottomSheetContainer,
            {backgroundColor: colorTheme.background},
          ],
        }}>
        <View style={styles.sheetContainer}>
          <ImageBottomSheetContent
            closeBottomSheet={closeBottomSheet}
            title={strings.uploadImages}
            uploadeImage={uploadeImage}
            colorTheme={colorTheme}
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
                size={wp('3%')}
                color={Color.Black}
                style={styles.dotsIcon}
              />
            </Pressable>
          </View>
          {showFolder && (
            <View
              style={[
                styles.folderContainer,
                item?.folderName && styles.folder,
              ]}>
              <Image
                source={require('../../Assets/Img/folder.png')}
                style={styles.folderIcon}
              />
              <Text
                style={[
                  styles.folderText,
                  {width: item?.folderName?.length > 12 ? wp('23%') : 'auto'},
                ]}>
                {item?.folderName ? item?.folderName : ''}
              </Text>
            </View>
          )}
        </View>
      );
    },
    [imageData,showFolder],
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
            style={{marginBottom: hp('2%'), marginHorizontal: wp(0.5)}}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          visible == false && <NoDataView content={strings.imageNotFound} />
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
        buttonHeight={hp('6%')}
        title={strings.uploadImages}
        borderRadius={wp('3%')}
        fontSize={wp('4%')}
        fontColor={Color.White}
        fontFamily={Font.semiBold}
        marginTop={hp('2%')}
        position="absolute"
        alignSelf="center"
        bottom={hp('1.5%')}
        onPress={() => {
          openBottomSheet();
        }}
      />
      <CustomeModal
        visible={modalVisible}
        onClose={closeModal}
        closeModal={false}
        mainPadding={wp('1.5%')}
        backgroundColor={colorTheme.modelBackground}
        content={
          <ImageModalContent
            closeModal={closeModal}
            type={'Image'}
            openBottomSheet={openBottomSheet}
            setEditBottomSheet={setEditImageBottomsheet}
            deleteItem={deleteImage}
            imageId={imageId}
            colorTheme={colorTheme}
          />
        }
        width={wp('40%')}
        justifyContent="flex-end"
        borderRadius={wp('5%')}
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

export default React.memo(ImageComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    marginBottom: hp('7%'),
    marginHorizontal: wp('3%'),
  },
  imageContainer: {
    marginTop: hp('1.2%'),
    marginRight: wp('3%'),
    position: 'relative',
  },
  image: {
    width: wp('29%'),
    height: wp('28%'),
    borderRadius: wp('2%'),
  },
  pressableIcon: {
    position: 'absolute',
    right: wp('1.5%'),
    top: hp('1%'),
  },
  dotsIcon: {
    backgroundColor: Color.WhiteDefault,
    borderRadius: wp('1%'),
    padding: wp('1.5%'),
  },
  bottomSheetContainer: {
    alignItems: 'center',
    borderTopLeftRadius: wp('7%'),
    borderTopRightRadius: wp('7%'),
  },
  sheetContainer: {
    flexDirection: 'row',
    gap: wp('13%'),
    marginVertical: hp('1%'),
  },
  modal: {
    position: 'absolute',
    borderRadius: wp('2.5%'),
    backgroundColor: Color.White,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  folderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.White,
    borderRadius: wp('1.5%'),
    marginRight: wp('1%'),
    alignSelf: 'flex-start',
    marginLeft: wp('2%'),
    marginTop: hp(0.6),
    marginLeft: wp(0),
  },
  folderIcon: {
    width: wp('6%'),
    height: wp('6%'),
  },
  folderText: {
    fontSize: wp('3%'),
    color: Color.Black,
    fontFamily: Font.regular,
    textTransform: 'capitalize',
    // marginRight: wp('1%'),
  },
  folder: {
    width: wp('29.5%'),
    paddingRight: wp('1%'),
  },
});
