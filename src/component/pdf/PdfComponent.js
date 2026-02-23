import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useRef, useState, memo, useEffect} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo';
import {scale, verticalScale} from '../../custome/Responsive';
import Color from '../Color';
import Font from '../Font';
import {Menu, MenuTrigger, MenuOptions, MenuProvider} from 'react-native-popup-menu';
import PdfModalContent from './PdfModalContent';
import CustomeButton from '../../custome/CustomeButton';
import PdfBottomSheetContent from './PdfBottomSheetContent';
import {apiDelete, apiGet, apiPost, apiPut} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import Loader from '../Loader';
import showMessageonTheScreen from '../ShowMessageOnTheScreen';
import NoDataView from '../NoDataView';
import RNFetchBlob from 'react-native-blob-util';
import {ScreenName} from '../Screen';
import moment from 'moment';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import useTheme from '../Theme';
import strings from '../../language/strings';
import ActionSheet from 'react-native-actions-sheet';
import {useAppSelector} from '../../redux/hooks';
import ConfirmationDialog from '../../custome/ConfirmationDialog';

const PdfComponent = memo(({folderId}) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [pdfData, setPdfData] = useState(false);
  const [editBottomSheet, setEditBottomSheet] = useState(false);
  const [pdfName, setPdfName] = useState('');
  const [pdfColor, setPdfColor] = useState('');
  const [pdfId, setPdfId] = useState('');
  const [singlePdfData, setSinglePdfData] = useState({});
  const [colorView, setColorView] = useState(false);
  const refRBSheet = useRef(null);
  const colorTheme = useTheme();
  
  // Get user from Redux state instead of global
  const user = useAppSelector(state => state.auth.user);
  const userId = user?._id;

  // Confirmation dialog state
  const [showDeletePdfDialog, setShowDeletePdfDialog] = useState(false);
  const [pdfIdToDelete, setPdfIdToDelete] = useState(null);

  useEffect(() => {
    getPdf(false);
  }, [isFocused, getPdf]);

  // ================================= Api =============================== //

  const getPdf = useCallback(
    async (message, messageValue) => {
      try {
        message === false && setVisible(true);
        const url = folderId
          ? `${Api.FolderPdf}?userId=${userId}&folderId=${folderId}`
          : `${Api.pdf}?userId=${userId}`;
        const response = await apiGet(url);
        if (response) {
          setPdfData(response?.data || response || []);
          message && showMessageonTheScreen(messageValue);
        }
      } catch (error) {
        console.log('error in getpdf api', error);
      } finally {
        setVisible(false);
      }
    },
    [folderId, userId],
  );

  const createPdf = useCallback(
    async (pdfId, pdf) => {
      var formdata = new FormData();
      formdata.append('userId', userId);
      formdata.append('color', pdfColor);
      formdata.append('name', pdfName);
      formdata.append('pdf', pdf);
      formdata.append('isHighlight', colorView);
      try {
        setVisible(true);
        const response = await apiPost(Api.pdf, '', formdata);
        if (response?.success === true) {
          getPdf(true, response?.message);
        }
      } catch (error) {
        console.log('error in upload pdf api', error);
      }
    },
    [colorView, getPdf, pdfColor, pdfName, userId],
  );

  const editPdf = useCallback(
    async (pdfId, pdf) => {
      var formdata = new FormData();
      formdata.append('_id', pdfId);
      formdata.append('userId', userId);
      formdata.append('color', pdfColor);
      formdata.append('name', pdfName);
      formdata.append('pdf', pdf?.name ? pdf : '');
      formdata.append('isHighlight', colorView);
      try {
        setVisible(true);
        const response = await apiPut(Api.pdf, '', formdata);
        if (response?.success === true) {
          getPdf(true, response?.message);
        }
      } catch (error) {
        console.log('error in upload pdf api', error);
      }
    },
    [colorView, getPdf, pdfColor, pdfName],
  );

  const deletePdf = async pdfId => {
    try {
      setVisible(true);
      const response = await apiDelete(`${Api.pdf}?_id=${pdfId}`);
      if (response?.success === true) {
        getPdf(true, response?.message);
      }
    } catch (error) {
      console.log('error in delete pdf api', error);
    }
  };

  const handleDeletePdfPress = useCallback((pdfId) => {
    setPdfIdToDelete(pdfId);
    setShowDeletePdfDialog(true);
  }, []);

  const confirmDeletePdf = useCallback(() => {
    if (pdfIdToDelete) {
      deletePdf(pdfIdToDelete);
    }
    setShowDeletePdfDialog(false);
    setPdfIdToDelete(null);
  }, [pdfIdToDelete, deletePdf]);

  // ================================= End =============================== //

  const PdfView = useCallback(
    pdfUrl => {
      setVisible(true);
      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'pdf',
        path:
          RNFetchBlob.fs.dirs.DocumentDir +
          '/' +
          `pdf_${moment().format('YYYYMMDD_HHmmss')}.pdf`,
      })
        .fetch('GET', pdfUrl)
        .then(res => {
          console.log('PDF downloaded at:', res.path());
          setVisible(false);
          navigation.navigate(ScreenName.viewPdfScreen, {url: res.path()});
        })
        .catch(error => {
          console.log('Error downloading PDF:', error);
        });
    },
    [navigation],
  );

  const openBottomSheet = () => {
    refRBSheet.current.show();
  };

  const closeBottomSheet = () => {
    refRBSheet.current.hide();
  };

  const BottomSheets = useCallback(() => {
    return (
      //   <RBSheet
      //     ref={refRBSheet}
      //     height={verticalScale(510)}
      //     openDuration={250}
      //     draggable={true}
      //     closeOnDragDown={true}
      //     closeOnPressMask={true}
      //     customStyles={{
      //       container: [styles.bottomSheetContainer,{backgroundColor:colorTheme.background}],
      //     }}>
      //     <View style={styles.sheetContainer}>
      //       <PdfBottomSheetContent
      //         closeBottomSheet={closeBottomSheet}
      //         title={editBottomSheet ? strings.editPdf : strings.uploadPdf}
      //         setName={setPdfName}
      //         name={pdfName}
      //         setColor={setPdfColor}
      //         color={pdfColor}
      //         setColorView={setColorView}
      //         colorView={colorView}
      //         initialData={singlePdfData ? singlePdfData : ''}
      //         create={editBottomSheet ? editPdf : createPdf}
      //       />
      //     </View>
      //   </RBSheet>

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
          <PdfBottomSheetContent
            closeBottomSheet={closeBottomSheet}
            title={editBottomSheet ? strings.editPdf : strings.uploadPdf}
            setName={setPdfName}
            name={pdfName}
            setColor={setPdfColor}
            color={pdfColor}
            setColorView={setColorView}
            colorView={colorView}
            initialData={singlePdfData ? singlePdfData : ''}
            create={editBottomSheet ? editPdf : createPdf}
          />
        </View>
      </ActionSheet>
    );
  }, [
    pdfName,
    pdfColor,
    editBottomSheet,
    singlePdfData,
    colorView,
    colorTheme,
    createPdf,
    editPdf,
  ]);

  const renderPdf = useCallback(
    ({item, index}) => {
      const isLastItem = index === pdfData.length - 1;
      return (
        <View style={styles.itemContainer}>
          <Pressable
            style={[
              styles.folderItem,
              {
                backgroundColor: item?.isHighlight
                  ? item.color
                  : colorTheme.listAndBoxColor,
              },
            ]}
            onPress={() => PdfView(item?.url)}>
            <View style={styles.folderInfo}>
              {!colorView && (
                <View
                  style={[styles.iconColor, {backgroundColor: item.color}]}
                />
              )}
              <Text
                style={[
                  styles.folderName,
                  {
                    color: item?.isHighlight
                      ? Color.Black
                      : colorTheme.textColor,
                  },
                ]}>
                {item.name}
              </Text>
            </View>
            <Menu>
              <MenuTrigger
                onPress={() => {
                  setSinglePdfData(item);
                  setPdfId(item?._id);
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
                  type={'Pdf'}
                  openBottomSheet={openBottomSheet}
                  setEditBottomSheet={setEditBottomSheet}
                  onDeletePress={handleDeletePdfPress}
                  pdfId={item?._id}
                  colorTheme={colorTheme}
                  downloadPdf={downloadPdf}
                  singlePdfData={item}
                />
              </MenuOptions>
            </Menu>
          </Pressable>
          <View style={[styles.folderContainer, styles.alignself]}>
            <Image
              source={require('../../Assets/Img/folder.png')}
              style={styles.folderIcon}
            />
            <Text style={styles.folderText}>
              {item?.folderName ? item?.folderName : ''}
            </Text>
          </View>
        </View>
      );
    },
    [pdfData, PdfView, colorTheme, colorView, openBottomSheet, handleDeletePdfPress, downloadPdf],
  );

  const renderBody = () => {
    return (
      <View style={styles.listContainer}>
        {pdfData?.length > 0 ? (
          <FlatList
            data={pdfData}
            renderItem={renderPdf}
            keyExtractor={item => item.name}
            showsVerticalScrollIndicator={false}
            style={styles.flatlist}
            contentContainerStyle={{paddingBottom: Math.max(insets.bottom + verticalScale(70), verticalScale(80))}}
          />
        ) : (
          visible === false && (
            <NoDataView
              content={strings.pdfNotFound}
              noDataViewStyle={{marginTop: verticalScale(-70)}}
            />
          )
        )}
        {BottomSheets()}
      </View>
    );
  };

  const updateCredit = async (credit, type) => {
    const rawData = {userId: userId, credit: credit, type: type};
    try {
      setVisible(true);
      const response = await apiPut(Api.credit, '', JSON.stringify(rawData));
      if (response.success) {
        getProfileData(false);
      }
    } catch (error) {
      console.error('Error updating credit:', error);
    } finally {
      setVisible(false);
    }
  };

  const downloadPdf = async (pdfUrl, fileName = 'downloaded.pdf', onSuccess, onError) => {
    try {
      setVisible(true);
      const { fs } = RNFetchBlob;
      const downloadPath = fs.dirs.DownloadDir + '/' + fileName;
      const res = await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'pdf',
        path: downloadPath,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: downloadPath,
          description: 'PDF',
        },
      }).fetch('GET', pdfUrl);

      setVisible(false);
      showMessageonTheScreen('PDF downloaded successfully');
      // Call updateCredit here after successful download
      updateCredit(1, 'debited');
      if (onSuccess) onSuccess(res.path());
    } catch (error) {
      setVisible(false);
      showMessageonTheScreen('Failed to download PDF');
      if (onError) onError(error);
      console.log('Error downloading PDF:', error);
    }
  };

  return (
    <MenuProvider>
      <View style={styles.container}>
        <Loader visible={visible} />
        {renderBody()}
        <CustomeButton
          buttonColor={Color.theme1}
          buttonWidth="90%"
          buttonHeight={scale(45)}
          title={strings.uploadPdf}
          borderRadius={scale(10)}
          fontSize={scale(15)}
          fontColor={Color.White}
          fontFamily={Font.semiBold}
          marginTop={verticalScale(15)}
          position="absolute"
          alignSelf="center"
          bottom={Math.max(insets.bottom + verticalScale(10), verticalScale(20))}
          onPress={() => {
            setEditBottomSheet(false);
            setSinglePdfData({});
            openBottomSheet();
          }}
        />
        
        <ConfirmationDialog
          isVisible={showDeletePdfDialog}
          title={strings.deletePdf || 'Delete PDF'}
          message={strings.deletePdfConfirmMessage || 'Are you sure you want to delete this PDF? This action cannot be undone.'}
          confirmText={strings.delete}
          cancelText={strings.cancel}
          isDanger={true}
          onConfirm={confirmDeletePdf}
          onCancel={() => setShowDeletePdfDialog(false)}
        />
      </View>
    </MenuProvider>
  );
});

export default PdfComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    marginTop: verticalScale(15),
  },
  itemContainer: {
    marginHorizontal: scale(10),
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
  folderName: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(10),
    width: scale(290),
    // backgroundColor:'red'
  },
  dotsIcon: {
    backgroundColor: Color.WhiteDefault,
    borderRadius: scale(5),
    padding: scale(10),
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
  indicatorStyle: {
    marginTop: verticalScale(12),
    backgroundColor: Color.mediumGray,
  },
  sheetContainer: {
    flexDirection: 'row',
    gap: scale(50),
    marginVertical: verticalScale(15),
  },
  iconColor: {
    width: scale(11),
    height: scale(35),
    borderRadius: scale(8),
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  folderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: scale(10),
    backgroundColor: Color.White,
    height: scale(35),
    borderRadius: scale(10),
    marginTop: verticalScale(-5),
    marginBottom: verticalScale(10),
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
  alignSelf: {alignSelf: 'flex-start'},
  flatlist: {flex: 1, paddingBottom: 10},
});
