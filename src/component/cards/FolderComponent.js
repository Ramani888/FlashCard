import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState, useCallback, useMemo} from 'react';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
} from 'react-native-popup-menu';
import Color from '../Color';
import Font from '../Font';
import {scale, verticalScale} from '../../custome/Responsive';
import Entypo from 'react-native-vector-icons/Entypo';
import ModalContent from './ModalContent';
import CustomeButton from '../../custome/CustomeButton';
import BottomSheetContent from '../BottomSheetContent';
import Loader from '../Loader';
import NoDataView from '../NoDataView';
import useTheme from '../Theme';
import strings from '../../language/strings';
import ActionSheet from 'react-native-actions-sheet';
import useFolderApi from '../../hooks/useFolderApi';

const ITEM_HEIGHT = verticalScale(55); // Approximate height for getItemLayout

const FolderComponent = ({
  onFolderClick,
  handleCreateSetClick,
  setLoading,
  search,
  setSearchValue,
}) => {
  const [editBottomSheet, setEditBottomSheet] = useState(false);
  const refRBSheet = useRef();
  const colorTheme = useTheme();

  // Use custom hook for API operations
  const {
    folderData,
    singleFolderItem,
    loading,
    folderName,
    setFolderName,
    folderStatus,
    setFolderStatus,
    folderColor,
    setFolderColor,
    colorView,
    setColorView,
    createFolder,
    editFolder,
    deleteFolder,
    prepareForEdit,
    prepareForCreate,
    setSingleFolderItem,
  } = useFolderApi({search, setExternalLoading: setLoading});

  // Memoize menu options style
  const menuOptionsStyle = useMemo(() => ({
    optionsContainer: [styles.menuOptionsContainer, {backgroundColor: colorTheme.modelNewBackground}]
  }), [colorTheme.modelNewBackground]);

  const openBottomSheet = useCallback(() => {
    refRBSheet.current?.show();
  }, []);

  const closeBottomSheet = useCallback(() => {
    refRBSheet.current?.hide();
  }, []);

  // Memoized keyExtractor for FlatList
  const keyExtractor = useCallback((item, index) => item?._id || index.toString(), []);

  const renderFolder = useCallback(
    ({item}) => {
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
          <Menu>
            <MenuTrigger
              onPress={() => {
                setSingleFolderItem(item);
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
                type={'Folder'}
                openBottomSheet={openBottomSheet}
                setEditBottomSheet={setEditBottomSheet}
                deleteData={deleteFolder}
                handleCreateSetClick={handleCreateSetClick}
                singleItem={item}
              />
            </MenuOptions>
          </Menu>
        </Pressable>
      );
    },
    [
      colorView,
      colorTheme.listAndBoxColor,
      colorTheme.textColor,
      onFolderClick,
      setSearchValue,
      menuOptionsStyle,
      openBottomSheet,
      deleteFolder,
      handleCreateSetClick,
      setSingleFolderItem,
    ],
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
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
          />
        ) : (
          !loading && (
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
            prepareForCreate();
            openBottomSheet();
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      {renderBody()}
    </View>
  );
};

export default React.memo(FolderComponent);

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
  menuOptionsContainer: {
    borderRadius: scale(10),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
