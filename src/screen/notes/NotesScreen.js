import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Color from '../../component/Color';
import {scale, verticalScale} from '../../custome/Responsive';
import CustomeHeader from '../../custome/CustomeHeader';
import Font from '../../component/Font';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeButton from '../../custome/CustomeButton';
import BottomSheetContent from '../../component/BottomSheetContent';
import NoteModalContent from '../../component/profile/NoteModalContent';
import {apiDelete, apiGet, apiPost, apiPut} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import Loader from '../../component/Loader';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../../component/Screen';
import NoDataView from '../../component/NoDataView';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';
import ActionSheet from 'react-native-actions-sheet';
import {Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger} from 'react-native-popup-menu';
import {useAppSelector} from '../../redux/hooks';
import ConfirmationDialog from '../../custome/ConfirmationDialog';

const NotesScreen = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [editBottomSheet, setEditBottomSheet] = useState(false);
  const [singleNoteData, setSingleNoteData] = useState({});
  const [noteData, setNoteData] = useState([]);
  const [noteName, setNoteName] = useState();
  const [noteStatus, setNoteStatus] = useState(0);
  const [noteColor, setNoteColor] = useState('');
  const [colorView, setColorView] = useState(false);
  const refRBSheet = useRef();
  const colorTheme = useTheme();
  const [showDeleteNoteDialog, setShowDeleteNoteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  
  // Get user from Redux state instead of global
  const user = useAppSelector(state => state.auth.user);
  const userId = user?._id;

  useEffect(() => {
    if (userId) {
      getNoteData(true);
    }
  }, [userId]);

  // ====================================== Api ===================================== //

  const getNoteData = async (initialLoader, message) => {
    try {
      initialLoader && setVisible(true);
      const response = await apiGet(`${Api.notes}?userId=${userId}`);
      
      // Handle different response structures
      let notes = [];
      if (Array.isArray(response)) {
        notes = response;
      } else if (response?.data && Array.isArray(response.data)) {
        notes = response.data;
      } else if (response?.notes && Array.isArray(response.notes)) {
        notes = response.notes;
      }
      
      setNoteData(notes);
      
      if (!initialLoader && message) {
        showMessageonTheScreen(message);
      }
    } catch (error) {
      console.log('error in get note data', error);
    } finally {
      setVisible(false);
    }
  };

  const createNote = useCallback(async () => {
    const rawData = {
      userId: userId,
      name: noteName,
      color: noteColor,
      note: '',
      isHighlight: colorView,
    };
    try {
      setVisible(true);
      const response = await apiPost(Api.notes, '', JSON.stringify(rawData));
      if (response?.success === true) {
        getNoteData(false, response?.message);
      }
    } catch (error) {
      console.log('error in create note api', error);
    } finally {
      setVisible(false);
    }
  }, [colorView, noteColor, noteName, userId]);

  const editNote = useCallback(
    async (editWithNote, noteId, name, color, noteDesc, isColorView) => {
      const rawData = {
        _id: editWithNote ? noteId : singleNoteData?._id,
        userId: userId,
        name: editWithNote ? name : noteName,
        color: editWithNote ? color : noteColor,
        note: noteDesc,
        isHighlight: isColorView ? isColorView : colorView,
      };
      try {
        setVisible(true);
        const response = await apiPut(Api.notes, '', JSON.stringify(rawData));
        if (response?.success === true) {
          getNoteData(false, false);
        }
      } catch (error) {
        console.log('error in update note api', error);
      } finally {
        setVisible(false);
      }
    },
    [colorView, noteColor, noteName, singleNoteData, userId],
  );

  const deleteNote = useCallback(async noteId => {
    try {
      setVisible(true);
      const response = await apiDelete(`${Api.notes}?_id=${noteId}`);
      if (response?.success === true) {
        getNoteData(false, response?.message);
      }
    } catch (error) {
      console.log('error in delete note api', error);
    } finally {
      setVisible(false);
    }
  }, []);

  const handleDeleteNotePress = useCallback((noteId) => {
    setNoteToDelete(noteId);
    setShowDeleteNoteDialog(true);
  }, []);

  const confirmDeleteNote = useCallback(() => {
    if (noteToDelete) {
      deleteNote(noteToDelete);
    }
    setShowDeleteNoteDialog(false);
    setNoteToDelete(null);
  }, [noteToDelete, deleteNote]);

  // ====================================== End ===================================== //

  const openBottomSheet = useCallback(() => {
    refRBSheet.current.show();
  }, []);

  const closeBottomSheet = useCallback(() => {
    refRBSheet.current.hide();
  }, []);

  const renderHeader = useCallback(
    () => (
      <CustomeHeader
        goBack={true}
        title={strings.homeTab3}
        iconColor={Color.White}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
      />
    ),
    [],
  );

  const BottomSheets = useCallback(
    () => (
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
            title={editBottomSheet ? strings.editNote : strings.createNotes}
            name={noteName}
            setName={setNoteName}
            status={noteStatus}
            setStatus={setNoteStatus}
            color={noteColor}
            setColor={setNoteColor}
            setColorView={setColorView}
            colorView={colorView}
            create={editBottomSheet ? editNote : createNote}
            initialData={singleNoteData ? singleNoteData : ''}
          />
        </View>
      </ActionSheet>
    ),
    [
      noteName,
      noteStatus,
      noteColor,
      editBottomSheet,
      colorView,
      singleNoteData,
      closeBottomSheet,
      colorTheme.background,
      createNote,
      editNote,
    ],
  );

  const renderNotes = useCallback(
    ({item, index}) => {
      return (
        <Pressable
          style={[
            styles.noteContainer,
            {
              backgroundColor: item?.isHighlight
                ? item.color
                : colorTheme.listAndBoxColor,
            },
          ]}
          onPress={() => {
            setSingleNoteData(item);
            navigation.navigate(ScreenName.notesDetail, {
              noteName: item?.name,
              note: item?.note,
              noteId: item?._id,
              noteColor: item?.color,
              colorView: item?.isHighlight,
              editNote,
            });
            global.note = item?.note;
          }}>
          <View style={styles.colorView}>
            {!item?.isHighlight && (
              <Text style={[styles.color, {backgroundColor: item?.color}]} />
            )}
            <Text
              style={[
                styles.noteText,
                {color: item?.isHighlight ? Color.Black : colorTheme.textColor},
              ]}>
              {item?.name}
            </Text>
          </View>
          <Menu>
            <MenuTrigger>
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
            <MenuOptions customStyles={{optionsContainer: {borderRadius: scale(8), backgroundColor: colorTheme.modelNewBackground}}}>
              <NoteModalContent
                item={item}
                openBottomSheet={openBottomSheet}
                setEditBottomSheet={setEditBottomSheet}
                onDeletePress={handleDeleteNotePress}
                setSingleNoteData={setSingleNoteData}
              />
            </MenuOptions>
          </Menu>
        </Pressable>
      );
    },
    [
      colorTheme.listAndBoxColor,
      colorTheme.textColor,
      colorTheme.threeDotIcon,
      colorTheme.modelNewBackground,
      editNote,
      navigation,
      openBottomSheet,
      handleDeleteNotePress,
    ],
  );

  const renderBody = useCallback(
    () => (
      <View style={styles.bodyContainer}>
        {noteData.length > 0 ? (
          <FlatList
            data={noteData}
            renderItem={renderNotes}
            keyExtractor={item => item._id || item.name}
            style={styles.flatlist}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        ) : (
          visible === false && (
            <NoDataView
              content={strings.noNoteFound}
              noDataViewStyle={{marginTop: verticalScale(-70)}}
            />
          )
        )}
        {BottomSheets()}
      </View>
    ),
    [renderNotes, BottomSheets, visible, noteData],
  );

  return (
    <MenuProvider>
      <View style={[styles.container, {backgroundColor: colorTheme.background}]}>
        <StatusBar translucent backgroundColor="transparent" />
        <Loader visible={visible} />
        {renderHeader()}
        {renderBody()}
        <CustomeButton
          buttonColor={Color.theme1}
          buttonWidth="90%"
          buttonHeight={scale(45)}
          title={strings.createNote}
          borderRadius={scale(10)}
          fontSize={scale(15)}
          fontColor={Color.White}
          fontFamily={Font.semiBold}
          marginTop={verticalScale(15)}
          position="absolute"
          alignSelf="center"
          bottom={verticalScale(10)}
          onPress={() => {
            setEditBottomSheet(false);
            setSingleNoteData({});
            openBottomSheet();
          }}
        />

        <ConfirmationDialog
          isVisible={showDeleteNoteDialog}
          title={strings.deleteNote || 'Delete Note'}
          message={strings.deleteNoteConfirmMessage || 'Are you sure you want to delete this note? This action cannot be undone.'}
          confirmText={strings.delete}
          cancelText={strings.cancel}
          isDanger={true}
          onConfirm={confirmDeleteNote}
          onCancel={() => setShowDeleteNoteDialog(false)}
        />
      </View>
    </MenuProvider>
  );
};

export default React.memo(NotesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    height: verticalScale(90),
    alignItems: 'flex-end',
  },
  headerTitleStyle: {
    color: Color.White,
    fontSize: scale(20),
  },
  dotsIcon: {
    backgroundColor: Color.WhiteDefault,
    borderRadius: scale(10),
    padding: scale(10),
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
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: Color.White,
    padding: scale(5),
    marginHorizontal: scale(15),
    marginBottom: verticalScale(12),
    borderRadius: scale(5),
    borderWidth: scale(0.3),
    borderColor: Color.LightGray,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteText: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    textTransform: 'uppercase',
    paddingLeft: scale(10),
    width: widthPercentageToDP(75),
  },
  bodyContainer: {
    flex: 1,
    marginTop: verticalScale(15),
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
  color: {
    width: scale(12),
    height: verticalScale(30),
    borderRadius: scale(10),
    marginLeft: scale(3),
  },
  colorView: {flexDirection: 'row', alignItems: 'center'},
  flatlist: {flex: 1, marginBottom: verticalScale(60)},
});
