import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Color from '../Color';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeButton from '../../custome/CustomeButton';
import Font from '../Font';
import {Menu, MenuTrigger, MenuOptions, MenuProvider} from 'react-native-popup-menu';
import ImageModalContent from './ImageModalContent';
import ImageBottomSheetContent from './ImageBottomSheetContent';
import {apiDelete, apiGet, apiPost} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import Loader from '../Loader';
import showMessageonTheScreen from '../ShowMessageOnTheScreen';
import NoDataView from '../NoDataView';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';
import useTheme from '../Theme';
import strings from '../../language/strings';
import ActionSheet from 'react-native-actions-sheet';
import { scale } from 'react-native-size-matters';
import {useAppSelector} from '../../redux/hooks';

const ImageComponent = ({folderId, showFolder}) => {
  const navigation = useNavigation();
  const refRBSheet = useRef(null);
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [imageData, setImageData] = useState([]);
  const [imageId, setImageId] = useState('');
  const [editImageBottomsheet, setEditImageBottomsheet] = useState(false);
  const colorTheme = useTheme();
  
  // Get user from Redux state instead of global
  const user = useAppSelector(state => state.auth.user);
  const userId = user?._id;

  useEffect(() => {
    getImagesData(false);
  }, [isFocused, getImagesData]);

  const getImagesData = useCallback(
    async (message, messageValue) => {
      try {
        message === false && setVisible(true);
        const url = folderId
          ? `${Api.folderImage}?userId=${userId}&folderId=${folderId}`
          : `${Api.Images}?userId=${userId}`;
        const response = await apiGet(url);
        if (response) {
          setImageData(response?.data || response || []);
          message && showMessageonTheScreen(messageValue);
        }
      } catch (error) {
        console.log('error in get images data api', error);
      } finally {
        setVisible(false);
      }
    },
    [folderId, userId],
  );

  const uploadeImage = useCallback(
    async imageFile => {
      var formdata = new FormData();
      formdata.append('image', imageFile);
      formdata.append('userId', userId);
      try {
        setVisible(true);
        const response = await apiPost(Api.Images, '', formdata);
        console.log('response', response);
        if (response?.success === true) {
          getImagesData(true, response?.message);
        }
      } catch (error) {
        console.log('error in upload image api', error);
      }
    },
    [getImagesData, userId],
  );

  const deleteImage = async imageId => {
    try {
      setVisible(true);
      const response = await apiDelete(`${Api.Images}?_id=${imageId}`);
      if (response?.success === true) {
        getImagesData(true, response?.message);
      }
    } catch (error) {
      console.log('error in delete pdf api', error);
    }
  };

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
          borderTopLeftRadius: wp('7%'),
          borderTopRightRadius: wp('7%'),
        }}>
        <View style={styles.sheetContainer}>
          <ImageBottomSheetContent
            closeBottomSheet={closeBottomSheet}
            title={strings.uploadImages}
            uploadeImage={uploadeImage}
            colorTheme={colorTheme}
          />
        </View>
      </ActionSheet>
    );
  }, [uploadeImage, colorTheme]);

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
            <View style={styles.menuTriggerWrapper}>
              <Menu>
                <MenuTrigger
                  onPress={() => {
                    setImageId(item?._id);
                  }}>
                  <Entypo
                    name="dots-three-vertical"
                    size={wp('3%')}
                    color={Color.Black}
                    style={styles.dotsIcon}
                  />
                </MenuTrigger>
                <MenuOptions customStyles={{optionsContainer: {borderRadius: scale(10), backgroundColor: colorTheme.modelNewBackground}}}>
                  <ImageModalContent
                    type={'Image'}
                    openBottomSheet={openBottomSheet}
                    setEditBottomSheet={setEditImageBottomsheet}
                    deleteItem={deleteImage}
                    imageId={item?._id}
                    colorTheme={colorTheme}
                  />
                </MenuOptions>
              </Menu>
            </View>
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
    [imageData, showFolder, navigation, openBottomSheet, deleteImage, colorTheme],
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
            style={{marginHorizontal: wp(0.5)}}
            contentContainerStyle={{paddingBottom: Math.max(insets.bottom + hp('8%'), hp('10%'))}}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          visible === false && <NoDataView content={strings.imageNotFound} />
        )}
        {BottomSheets()}
      </View>
    );
  };

  return (
    <MenuProvider>
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
          bottom={Math.max(insets.bottom + hp('1.5%'), hp('2.5%'))}
          onPress={() => {
            openBottomSheet();
          }}
        />
      </View>
    </MenuProvider>
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
  menuTriggerWrapper: {
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
  indicatorStyle: {marginTop: hp('2'), backgroundColor: Color.mediumGray},
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
    // marginLeft: wp('2%'),
    marginTop: hp(0.6),
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
    width: wp('29%'),
    paddingRight: wp('1%'),
  },
});
