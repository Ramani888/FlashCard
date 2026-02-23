import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState, useCallback, useMemo, memo} from 'react';
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
import ConfirmationDialog from '../../custome/ConfirmationDialog';

const ITEM_HEIGHT = verticalScale(70); // Updated for accurate item height including margins

// Memoized no data style
const noDataStyle = {marginTop: verticalScale(-70)};

// Memoized FolderItem component for better performance
const FolderItem = memo(({item, onPress, onMenuPress, colorView, colorTheme, menuOptionsStyle, openBottomSheet, handleDeleteFolderPress, handleCreateSetClick}) => {
  const handlePress = useCallback(() => {
    onPress(item._id);
  }, [item._id, onPress]);

  const handleMenuTriggerPress = useCallback(() => {
    onMenuPress(item);
  }, [item, onMenuPress]);

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
      onPress={handlePress}>
      <View style={styles.folderInfo}>
        {!colorView && (
          <View style={[styles.iconColor, {backgroundColor: item.color}]} />
        )}
        <Text
          style={[
            styles.folderName,
            {color: item?.isHighlight ? Color.Black : colorTheme.textColor},
          ]}
          numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <Menu>
        <MenuTrigger onPress={handleMenuTriggerPress}>
          <View style={styles.menuIconContainer}>
            <Entypo
              name="dots-three-vertical"
              size={scale(15)}
              color={item?.isHighlight ? Color.Black : colorTheme.textColor}
              style={styles.dotsIcon}
            />
          </View>
        </MenuTrigger>
        <MenuOptions customStyles={menuOptionsStyle}>
          <ModalContent
            type={'Folder'}
            openBottomSheet={openBottomSheet}
            setEditBottomSheet={() => {}}
            onDeletePress={handleDeleteFolderPress}
            handleCreateSetClick={handleCreateSetClick}
            singleItem={item}
          />
        </MenuOptions>
      </Menu>
    </Pressable>
  );
});

FolderItem.displayName = 'FolderItem';

const FolderComponent = ({
  onFolderClick,
  handleCreateSetClick,
  search,
  setSearchValue,
}) => {
  const [editBottomSheet, setEditBottomSheet] = useState(false);
  const refRBSheet = useRef();
  const colorTheme = useTheme();

  // Confirmation dialog state
  const [showDeleteFolderDialog, setShowDeleteFolderDialog] = useState(false);

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
  } = useFolderApi({search});

  // Memoize menu options style
  const menuOptionsStyle = useMemo(() => ({
    optionsContainer: [styles.menuOptionsContainer, {backgroundColor: colorTheme.modelNewBackground}]
  }), [colorTheme.modelNewBackground]);

  // Dialog handlers
  const handleDeleteFolderPress = useCallback(() => {
    setShowDeleteFolderDialog(true);
  }, []);

  const confirmDeleteFolder = useCallback(() => {
    deleteFolder();
    setShowDeleteFolderDialog(false);
  }, [deleteFolder]);

  const openBottomSheet = useCallback(() => {
    refRBSheet.current?.show();
  }, []);

  const closeBottomSheet = useCallback(() => {
    refRBSheet.current?.hide();
  }, []);

  // Handler for create folder button
  const handleCreateFolderPress = useCallback(() => {
    setEditBottomSheet(false);
    prepareForCreate();
    openBottomSheet();
  }, [prepareForCreate, openBottomSheet]);

  // Memoized keyExtractor for FlatList
  const keyExtractor = useCallback((item) => item?._id || String(item?.name), []);

  // getItemLayout for FlatList optimization - fixed item heights for better performance
  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  // Handle folder press
  const handleFolderPress = useCallback((folderId) => {
    onFolderClick(folderId);
    setSearchValue('');
  }, [onFolderClick, setSearchValue]);

  // Handle menu trigger press
  const handleMenuPress = useCallback((item) => {
    setSingleFolderItem(item);
  }, [setSingleFolderItem]);

  const renderFolder = useCallback(
    ({item}) => (
      <FolderItem
        item={item}
        onPress={handleFolderPress}
        onMenuPress={handleMenuPress}
        colorView={colorView}
        colorTheme={colorTheme}
        menuOptionsStyle={menuOptionsStyle}
        openBottomSheet={openBottomSheet}
        handleDeleteFolderPress={handleDeleteFolderPress}
        handleCreateSetClick={handleCreateSetClick}
      />
    ),
    [handleFolderPress, handleMenuPress, colorView, colorTheme, menuOptionsStyle, openBottomSheet, handleDeleteFolderPress, handleCreateSetClick],
  );

  // Handle "All Set" folder press
  const handleAllSetPress = useCallback(() => {
    onFolderClick('');
    setSearchValue('');
  }, [onFolderClick, setSearchValue]);

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
        <View style={styles.contentArea}>
          <Pressable
            style={styles.folderContainer}
            onPress={handleAllSetPress}>
            <Text style={styles.folderText}>{strings.allSet}</Text>
          </Pressable>

          {folderData?.length > 0 ? (
            <FlatList
              data={folderData}
              renderItem={renderFolder}
              keyExtractor={keyExtractor}
              getItemLayout={getItemLayout}
              style={styles.flatlist}
              contentContainerStyle={styles.flatlistContent}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews={true}
              updateCellsBatchingPeriod={100}
              legacyImplementation={false}
            />
          ) : (
            !loading && (
              <NoDataView
                content={strings.folderNotFound}
                noDataViewStyle={noDataStyle}
              />
            )
          )}
        </View>

        {BottomSheets()}

        <View style={styles.buttonContainer}>
          <CustomeButton
            buttonColor={Color.theme1}
            buttonWidth="100%"
            buttonHeight={scale(45)}
            title={strings.createFolder}
            borderRadius={scale(10)}
            fontSize={scale(15)}
            fontColor={Color.White}
            fontFamily={Font.semiBold}
            onPress={handleCreateFolderPress}
          />
        </View>
        
        <ConfirmationDialog
          isVisible={showDeleteFolderDialog}
          title={strings.deleteFolder || 'Delete Folder'}
          message={strings.deleteFolderConfirmMessage || 'Are you sure you want to delete this folder? All sets and cards in this folder will also be deleted.'}
          confirmText={strings.delete}
          cancelText={strings.cancel}
          isDanger={true}
          onConfirm={confirmDeleteFolder}
          onCancel={() => setShowDeleteFolderDialog(false)}
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
  bodyContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentArea: {
    flex: 1,
  },
  flatlist: {
    marginTop: verticalScale(10),
    flex: 1,
  },
  flatlistContent: {
    paddingBottom: verticalScale(10),
  },
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
    marginBottom: verticalScale(10)
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: scale(8),
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
    flex: 1,
  },
  menuIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: scale(40),
    minHeight: scale(40),
  },
  dotsIcon: {
    backgroundColor: Color.WhiteDefault,
    borderRadius: scale(5),
    padding: scale(8),
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
  buttonContainer: {
    paddingVertical: verticalScale(10),
    backgroundColor: 'transparent',
    marginTop: verticalScale(10),
  },
});
