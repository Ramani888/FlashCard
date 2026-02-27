import React, { useCallback, useEffect, useRef, useState, useMemo, memo } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
} from 'react-native-popup-menu';
import Color from '../Color';
import Font from '../Font';
import { scale, verticalScale } from '../../custome/Responsive';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeButton from '../../custome/CustomeButton';
import ModalContent from './ModalContent';
import BottomSheetContent from '../BottomSheetContent';
import { useNavigation } from '@react-navigation/native';
import { ScreenName } from '../Screen';
import Loader from '../Loader';
import NoDataView from '../NoDataView';
import useTheme from '../Theme';
import strings from '../../language/strings';
import ActionSheet from 'react-native-actions-sheet';
import useSetApi from '../../hooks/useSetApi';
import ConfirmationDialog from '../../custome/ConfirmationDialog';

const { height } = Dimensions.get('window');


// Memoized icon requires
const folderIcon = require('../../Assets/Img/folder.png');
const cardIcon = require('../../Assets/Img/cardIcon.png');

// Memoized SetItem component for better performance
const SetItem = memo(({ item, onPress, onMenuPress, showFolder, colorTheme, colorView, menuOptionsStyle, openBottomSheet, handleDeleteSetPress, handleRemoveFolderPress, folderId, getSetData }) => {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  const handleMenuTriggerPress = useCallback(() => {
    onMenuPress(item);
  }, [item, onMenuPress]);

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
        onPress={handlePress}>
        <View style={styles.rowContainer}>
          {!colorView && (
            <View
              style={[styles.colorBox, { backgroundColor: item?.color }]}
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
            ]}
            numberOfLines={1}>
            {item?.name}
          </Text>
        </View>
        <View style={styles.rowWithGap}>
          <View style={styles.subSetContainer}>
            <Text
              style={[styles.subSetText, { color: colorTheme.textColor1 }]}>
              {item?.cardCount}
            </Text>
            <Image
              source={cardIcon}
              style={styles.cardIcon}
              tintColor={colorTheme.textColor1}
              resizeMode="contain"
            />
          </View>
          <Menu>
            <MenuTrigger onPress={handleMenuTriggerPress}>
              <View style={styles.dotsIcon}>
                <Entypo
                  name="dots-three-vertical"
                  size={scale(13)}
                  color={Color.Black}
                />
              </View>
            </MenuTrigger>
            <MenuOptions customStyles={menuOptionsStyle}>
              <ModalContent
                type={'Set'}
                openBottomSheet={openBottomSheet}
                setEditBottomSheet={() => { }}
                onDeletePress={handleDeleteSetPress}
                onRemoveFolderPress={handleRemoveFolderPress}
                folderId={folderId}
                singleItem={item}
                getSetData={getSetData}
              />
            </MenuOptions>
          </Menu>
        </View>
      </Pressable>
      {showFolder && (
        <View style={[styles.folderContainer, styles.alignSelf]}>
          <Image
            source={folderIcon}
            style={styles.folderIcon}
            resizeMode="contain"
          />
          {item?.folderName ? (
            <Text style={styles.folderText} numberOfLines={1}>
              {item.folderName}
            </Text>
          ) : (
            <Text style={[styles.folderText, {color: Color.LightGray}]} numberOfLines={1}>
              {strings.noFolder || 'No Folder'}
            </Text>
          )}
        </View>
      )}
    </View>
  );
});

SetItem.displayName = 'SetItem';

const SetComponent = ({
  folderId,
  openSetSheet,
  setOpenSetSheet,
  search,
  showFolder
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [editBottomSheet, setEditBottomSheet] = useState(false);
  const refRBSheet = useRef();
  const flatListRef = useRef(null);
  const colorTheme = useTheme();

  // Confirmation dialog state
  const [showDeleteSetDialog, setShowDeleteSetDialog] = useState(false);
  const [showRemoveFolderDialog, setShowRemoveFolderDialog] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  // Use custom hook for API operations
  const {
    setData,
    singleSetData,
    loading,
    setName,
    setSetName,
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
  } = useSetApi({ folderId, search });

  // Memoize menu options style
  const menuOptionsStyle = useMemo(() => ({
    optionsContainer: [styles.menuOptionsContainer, { backgroundColor: colorTheme.modelNewBackground }]
  }), [colorTheme.modelNewBackground]);

  // Dialog handlers
  const handleDeleteSetPress = useCallback(() => {
    setShowDeleteSetDialog(true);
  }, []);

  const confirmDeleteSet = useCallback(() => {
    deleteSet();
    setShowDeleteSetDialog(false);
    setSetToDelete(null);
  }, [deleteSet]);

  const handleRemoveFolderPress = useCallback((setId) => {
    setSetToDelete(setId);
    setShowRemoveFolderDialog(true);
  }, []);

  const confirmRemoveFolder = useCallback(() => {
    if (setToDelete) {
      removeFolder(setToDelete);
    }
    setShowRemoveFolderDialog(false);
    setSetToDelete(null);
  }, [setToDelete, removeFolder]);

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

  // Handler for create set button
  const handleCreateSetPress = useCallback(() => {
    setEditBottomSheet(false);
    prepareForCreate();
    openBottomSheet();
  }, [prepareForCreate, openBottomSheet]);

  // Memoized keyExtractor for FlatList
  const keyExtractor = useCallback((item) => item?._id || String(item?.name), []);

  // Handle item press
  const handleItemPress = useCallback((item) => {
    navigation.navigate(ScreenName.setDetail, {
      setName: item?.name,
      setId: item?._id,
      folderId: folderId,
    });
  }, [navigation, folderId]);

  // Handle menu trigger press
  const handleMenuPress = useCallback((item) => {
    setSingleSetData(item);
  }, [setSingleSetData]);

  const renderSet = useCallback(
    ({ item }) => (
      <SetItem
        item={item}
        onPress={handleItemPress}
        onMenuPress={handleMenuPress}
        showFolder={showFolder}
        colorTheme={colorTheme}
        colorView={colorView}
        menuOptionsStyle={menuOptionsStyle}
        openBottomSheet={openBottomSheet}
        handleDeleteSetPress={handleDeleteSetPress}
        handleRemoveFolderPress={handleRemoveFolderPress}
        folderId={folderId}
        getSetData={getSetData}
      />
    ),
    [handleItemPress, handleMenuPress, showFolder, colorTheme, colorView, menuOptionsStyle, openBottomSheet, handleDeleteSetPress, handleRemoveFolderPress, folderId, getSetData],
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
          ref={flatListRef}
          data={setData}
          renderItem={renderSet}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          style={styles.flatlist}
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + verticalScale(65), verticalScale(75)) }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={false}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
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
        bottom={Math.max(insets.bottom + verticalScale(10), verticalScale(20))}
        onPress={handleCreateSetPress}
      />
      {BottomSheets()}

      <ConfirmationDialog
        isVisible={showDeleteSetDialog}
        title={strings.deleteSet || 'Delete Set'}
        message={strings.deleteSetConfirmMessage || 'Are you sure you want to delete this set? Allcards in this set will also be deleted.'}
        confirmText={strings.delete}
        cancelText={strings.cancel}
        isDanger={true}
        onConfirm={confirmDeleteSet}
        onCancel={() => setShowDeleteSetDialog(false)}
      />

      <ConfirmationDialog
        isVisible={showRemoveFolderDialog}
        title={strings.removeFolder || 'Remove Folder'}
        message={strings.removeFolderConfirmMessage || 'Are you sure you want to remove this set from the folder?'}
        confirmText={strings.remove || 'Remove'}
        cancelText={strings.cancel}
        isDanger={true}
        onConfirm={confirmRemoveFolder}
        onCancel={() => setShowRemoveFolderDialog(false)}
      />
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
  container: { flex: 1 },
  bodyContainer: {
    flex: 1,
    marginHorizontal: scale(15),
    // marginTop: verticalScale(20),
    paddingBottom: verticalScale(55),
  },
  itemContainer: {
    marginBottom: verticalScale(15),
    // Ensure consistent item bounds for better scroll performance
  },
  setContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Color.White,
    padding: scale(5),
    borderRadius: scale(10)
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBox: {
    width: scale(13),
    height: verticalScale(35),
    borderRadius: scale(10),
    marginRight: 0,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  folderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.White,
    minHeight: scale(35),
    borderRadius: scale(10),
    marginTop: verticalScale(5),
    paddingHorizontal: scale(5),
    paddingVertical: scale(3),
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
    marginLeft: scale(5),
    maxWidth: scale(200),
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
  flatlist: { flex: 1, paddingTop: verticalScale(15) },
  alignSelf: { alignSelf: 'flex-start' },
});
