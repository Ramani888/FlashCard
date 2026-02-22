import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import CustomeButton from '../../custome/CustomeButton';
import Color from '../Color';
import {scale, verticalScale} from '../../custome/Responsive';
import Font from '../Font';
import Api from '../../Api/EndPoint';
import {apiDelete, apiGet, apiPost, apiPut} from '../../Api/ApiService';
import showMessageonTheScreen from '../ShowMessageOnTheScreen';
import {Menu, MenuTrigger, MenuOptions, MenuProvider} from 'react-native-popup-menu';
import PdfModalContent from './PdfModalContent';
import BottomSheetContent from '../BottomSheetContent';
import Entypo from 'react-native-vector-icons/Entypo';
import Loader from '../Loader';
import NoDataView from '../NoDataView';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import useTheme from '../Theme';
import strings from '../../language/strings';
import ActionSheet from 'react-native-actions-sheet';
import {useAppSelector} from '../../redux/hooks';
import ConfirmationDialog from '../../custome/ConfirmationDialog';

const PdfFolderComponent = ({onFolderClick}) => {
  const [editBottomSheet, setEditBottomSheet] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pdfFolderdata, setPdfFolderData] = useState([]);
  const [singleFolderItem, setSingleFolderItem] = useState({});
  const [folderName, setFolderName] = useState('');
  const [folderStatus, setFolderStatus] = useState(0);
  const [folderColor, setFolderColor] = useState('');
  const [colorView, setColorView] = useState(false);
  const refRBSheet = useRef();
  const colorTheme = useTheme();
  
  // Get user from Redux state instead of global
  const user = useAppSelector(state => state.auth.user);
  const userId = user?._id;

  // Confirmation dialog state
  const [showDeleteFolderDialog, setShowDeleteFolderDialog] = useState(false);

  useEffect(() => {
    if (userId) {
      getPdfFolderData(false);
    }
  }, [userId]);

  // ================================== Api =================================== //

  const getPdfFolderData = async (message, messageValue) => {
    message === false && setVisible(true);
    try {
      const response = await apiGet(
        `${Api.pdfFolder}?userId=${userId}`,
      );
      setPdfFolderData(response?.data || response || []);
      message && showMessageonTheScreen(messageValue);
    } catch (error) {
      console.log('error in get pdf folder api', error);
    } finally {
      setVisible(false);
    }
  };

  const createPdfFolder = useCallback(
    async (message, messageValue) => {
      const rawData = {
        name: folderName,
        color: folderColor,
        userId: userId,
        isHighlight: colorView,
      };
      setVisible(true);
      try {
        const response = await apiPost(
          Api.pdfFolder,
          '',
          JSON.stringify(rawData),
        );
        setFolderName('');
        setFolderStatus(0);
        setFolderColor('');
        getPdfFolderData(true, response?.message);
      } catch (error) {
        console.log('error in create pdf folder api', error);
      }
    },
    [colorView, folderColor, folderName, userId],
  );

  const editPdfFolder = useCallback(
    async (message, messageValue) => {
      const rawData = {
        _id: singleFolderItem?._id,
        name: folderName,
        color: folderColor,
        userId: userId,
        isHighlight: colorView,
      };
      setVisible(true);
      try {
        const response = await apiPut(
          Api.pdfFolder,
          '',
          JSON.stringify(rawData),
        );
        setFolderName('');
        setFolderStatus(0);
        setFolderColor('');
        getPdfFolderData(true, response?.message);
      } catch (error) {
        console.log('error in edit pdf folder api', error);
      }
    },
    [colorView, folderColor, folderName, singleFolderItem, userId],
  );

  const deletePdfFolder = async () => {
    try {
      setVisible(true);
      const response = await apiDelete(
        `${Api.pdfFolder}?_id=${singleFolderItem?._id}`,
      );
      getPdfFolderData(true, response?.message);
    } catch (error) {
      console.log('error in delete pdf folder api', error);
    }
  };

  const handleDeleteFolderPress = useCallback(() => {
    setShowDeleteFolderDialog(true);
  }, []);

  const confirmDeleteFolder = useCallback(() => {
    deletePdfFolder();
    setShowDeleteFolderDialog(false);
  }, [deletePdfFolder]);

  // ================================== Api =================================== //

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
            create={editBottomSheet ? editPdfFolder : createPdfFolder}
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
    createPdfFolder,
    editPdfFolder,
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
          <Menu>
            <MenuTrigger
              onPress={() => {
                setSingleFolderItem(item);
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
            </MenuTrigger>
            <MenuOptions customStyles={{optionsContainer: {borderRadius: scale(10), backgroundColor: colorTheme.modelNewBackground}}}>
              <PdfModalContent
                type={'Folder'}
                openBottomSheet={openBottomSheet}
                setEditBottomSheet={setEditBottomSheet}
                onDeletePress={handleDeleteFolderPress}
                pdfId={item._id}
                colorTheme={colorTheme}
              />
            </MenuOptions>
          </Menu>
        </Pressable>
      );
    },
    [colorTheme, colorView, onFolderClick, pdfFolderdata, openBottomSheet, handleDeleteFolderPress],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderBody = () => {
    return (
      <View style={styles.bodyContainer}>
        <Pressable
          style={styles.folderContainer}
          onPress={() => onFolderClick('')}>
          <Text style={styles.folderText}>{strings.allPdf}</Text>
        </Pressable>
        {pdfFolderdata?.length > 0 ? (
          <FlatList
            data={pdfFolderdata}
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
    <MenuProvider>
      <View style={styles.mainContainer}>
        <Loader visible={visible} />
        {renderBody()}
        
        <ConfirmationDialog
          isVisible={showDeleteFolderDialog}
          title={strings.deleteFolder || 'Delete Folder'}
          message={strings.deletePdfFolderConfirmMessage || 'Are you sure you want to delete this folder? All PDFs in this folder will also be deleted.'}
          confirmText={strings.delete}
          cancelText={strings.cancel}
          isDanger={true}
          onConfirm={confirmDeleteFolder}
          onCancel={() => setShowDeleteFolderDialog(false)}
        />
      </View>
    </MenuProvider>
  );
};

export default PdfFolderComponent;

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
    width: scale(11),
    height: scale(35),
    borderRadius: scale(8),
  },
  folderName: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(10),
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
