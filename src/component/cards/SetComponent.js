import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
} from 'react-native-popup-menu';
import Color from '../Color';
import Font from '../Font';
import {scale, verticalScale} from '../../custome/Responsive';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeButton from '../../custome/CustomeButton';
import ModalContent from './ModalContent';
import BottomSheetContent from '../BottomSheetContent';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';
import Loader from '../Loader';
import NoDataView from '../NoDataView';
import useTheme from '../Theme';
import strings from '../../language/strings';
import ActionSheet from 'react-native-actions-sheet';
import useSetApi from '../../hooks/useSetApi';

const {height} = Dimensions.get('window');
const ITEM_HEIGHT = verticalScale(60); // Approximate height for getItemLayout

const SetComponent = ({
  folderId,
  openSetSheet,
  setOpenSetSheet,
  setLoading,
  search,
  showFolder
}) => {
  const navigation = useNavigation();
  const [editBottomSheet, setEditBottomSheet] = useState(false);
  const refRBSheet = useRef();
  const colorTheme = useTheme();

  // Use custom hook for API operations
  const {
    setData,
    singleSetData,
    loading,
    setName,
    setSetName,
    setStatus,
    setSetStatus,
    setColor,
    setSetColor,
    colorView,
    setColorView,
    getSetData,
    createSet,
    editSet,
    deleteSet,
    removeFolder,
    prepareForEdit,
    prepareForCreate,
    setSingleSetData,
  } = useSetApi({folderId, search, setExternalLoading: setLoading});

  // Memoize menu options style
  const menuOptionsStyle = useMemo(() => ({
    optionsContainer: [styles.menuOptionsContainer, {backgroundColor: colorTheme.modelNewBackground}]
  }), [colorTheme.modelNewBackground]);

  // Handle openSetSheet prop changes
  useEffect(() => {
    if (openSetSheet) {
      setEditBottomSheet(false);
      prepareForCreate();
      openBottomSheet();
    }
  }, [openSetSheet, prepareForCreate]);

  const openBottomSheet = useCallback(() => {
    refRBSheet.current?.show();
  }, []);

  const closeBottomSheet = useCallback(() => {
    refRBSheet.current?.hide();
    setOpenSetSheet(false);
  }, [setOpenSetSheet]);

  // Memoized keyExtractor for FlatList
  const keyExtractor = useCallback((item, index) => item?._id || index.toString(), []);

  // getItemLayout for FlatList optimization
  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  const renderSet = useCallback(
    ({item}) => {
      return (
        <View style={styles.itemContainer}>
          <Pressable
            style={[
              styles.setContainer,
              {
                backgroundColor: item?.isHighlight
                  ? item.color
                  : colorTheme.listAndBoxColor,
              },
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
              <Text
                style={[
                  styles.setTitle,
                  {
                    color: item?.isHighlight
                      ? Color.Black
                      : colorTheme.textColor,
                  },
                ]}>
                {item?.name}
              </Text>
            </View>
            <View style={styles.rowWithGap}>
              <View style={styles.subSetContainer}>
                <Text
                  style={[styles.subSetText, {color: colorTheme.textColor1}]}>
                  {item?.cardCount}
                </Text>
                <Image
                  source={require('../../Assets/Img/cardIcon.png')}
                  style={styles.cardIcon}
                  tintColor={colorTheme.textColor1}
                />
              </View>
              <Menu>
                <MenuTrigger
                  onPress={() => {
                    setSingleSetData(item);
                  }}>
                  <Entypo
                    name="dots-three-vertical"
                    size={scale(13)}
                    color={Color.Black}
                    style={styles.dotsIcon}
                  />
                </MenuTrigger>
                <MenuOptions customStyles={menuOptionsStyle}>
                  <ModalContent
                    type={'Set'}
                    openBottomSheet={openBottomSheet}
                    setEditBottomSheet={setEditBottomSheet}
                    deleteData={deleteSet}
                    folderId={folderId}
                    singleItem={item}
                    getSetData={getSetData}
                    handleRemoveFolder={removeFolder}
                  />
                </MenuOptions>
              </Menu>
            </View>
          </Pressable>
          {showFolder && (
            <View style={[styles.folderContainer, styles.alignSelf]}>
              <Image
                source={require('../../Assets/Img/folder.png')}
                style={styles.folderIcon}
              />
              <Text
                style={[
                  styles.folderText,
                  {marginLeft: item?.folderName ? scale(5) : 0},
                ]}>
                {item?.folderName ? item?.folderName : ''}
              </Text>
            </View>
          )}
        </View>
      );
    },
    [colorTheme, colorView, folderId, navigation, showFolder, menuOptionsStyle, openBottomSheet, deleteSet, getSetData, removeFolder, setSingleSetData],
  );

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
            title={editBottomSheet ? strings.editSet : strings.createSet}
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
      </ActionSheet>
    );
  }, [
    setName,
    setStatus,
    setColor,
    editBottomSheet,
    colorView,
    singleSetData,
    closeBottomSheet,
    colorTheme,
    createSet,
    editSet,
  ]);

  const renderBody = () => (
    <View style={styles.bodyContainer}>
      {setData?.length > 0 ? (
        <FlatList
          data={setData}
          renderItem={renderSet}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          style={styles.flatlist}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      ) : (
        !loading && <NoDataView content={strings.setNotFound} />
      )}
      <CustomeButton
        buttonColor={Color.theme1}
        buttonWidth="100%"
        buttonHeight={scale(45)}
        title={strings.createSet}
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={Color.White}
        fontFamily={Font.semiBold}
        marginTop={verticalScale(15)}
        position={'absolute'}
        bottom={verticalScale(10)}
        onPress={() => {
          setEditBottomSheet(false);
          prepareForCreate();
          openBottomSheet();
        }}
      />
      {BottomSheets()}
    </View>
  );

  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      {renderBody()}
    </View>
  );
};

export default React.memo(SetComponent);

const styles = StyleSheet.create({
  container: {flex: 1},
  bodyContainer: {
    flex: 1,
    marginHorizontal: scale(15),
    // marginTop: verticalScale(20),
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
  menuOptionsContainer: {
    backgroundColor: Color.White,
    borderRadius: scale(10),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  folderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  indicatorStyle: {
    marginTop: verticalScale(10),
    backgroundColor: Color.mediumGray,
  },
  sheetContainer: {
    flexDirection: 'row',
    gap: scale(50),
    marginVertical: height * 0.01,
  },
  flatlist: {flex: 1, paddingTop: verticalScale(15)},
  alignSelf: {alignSelf: 'flex-start'},
});
