import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Color from '../../component/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import CustomeHeader from '../../custome/CustomeHeader';
import Font from '../../component/Font';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeButton from '../../custome/CustomeButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheetContent from '../../component/BottomSheetContent';
import CustomeModal from '../../custome/CustomeModal';
import ModalContent from '../../component/verses/ModalContent';
import NoteModalContent from '../../component/profile/NoteModalContent';

const {height, width} = Dimensions.get('window');

const notesData = [{name: 'Cults'}, {name: 'To do'}, {name: 'Catholics'}];

const NotesScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [editBottomSheet, setEditBottomSheet] = useState(false);
  const [singleNoteData, setSingleNoteData] = useState({});
  const [noteData, setNoteData] = useState([]);
  const [noteName, setNoteName] = useState();
  const [noteStatus, setNoteStatus] = useState(0);
  const [noteColor, setNoteColor] = useState('');
  const threeDotIconRef = useRef(null);
  const refRBSheet = useRef();

  useEffect(() => {
    getNoteData();
  }, []);

  // ====================================== Api ===================================== //

  const getNoteData = () => {};

  const createNote = () => {};

  const editNote = () => {};

  const deleteNote = () => {};

  // ====================================== End ===================================== //

  const openModal = useCallback((item, isLastItem) => {
    threeDotIconRef.current.measureInWindow((x, y, width, height) => {
      const offsetY =
        notesData?.length > 7
          ? isLastItem
            ? -height - 15
            : height + 15
          : height + 15;
      setModalPosition({x: x - width * 3.25, y: y + offsetY});
      setModalVisible(true);
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const openBottomSheet = useCallback(() => {
    refRBSheet.current.open();
  }, []);

  const closeBottomSheet = useCallback(() => {
    refRBSheet.current.close();
  }, []);

  const renderHeader = useCallback(
    () => (
      <CustomeHeader
        goBack={true}
        title={'Notes'}
        iconColor={Color.White}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
      />
    ),
    [],
  );

  const BottomSheets = useCallback(
    () => (
      <RBSheet
        ref={refRBSheet}
        height={height * 0.76}
        openDuration={250}
        draggable={true}
        customStyles={{
          container: styles.bottomSheetContainer,
        }}>
        <View style={styles.sheetContainer}>
          <BottomSheetContent
            closeBottomSheet={closeBottomSheet}
            title={editBottomSheet ? 'EDIT NOTES' : 'CREATE NOTES'}
            name={noteName}
            setName={setNoteName}
            status={noteStatus}
            setStatus={setNoteStatus}
            color={noteColor}
            setColor={setNoteColor}
            create={editBottomSheet ? editNote : createNote}
            initialData={singleNoteData ? singleNoteData : ''}
          />
        </View>
      </RBSheet>
    ),
    [noteName, noteStatus, noteColor, editBottomSheet],
  );

  const renderNotes = useCallback(
    ({item, index}) => {
      const isLastItem = index === notesData.length - 1;

      return (
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>{item?.name}</Text>
          <Pressable
            ref={threeDotIconRef}
            onPress={() => {
              setSingleNoteData(item);
              openModal(item, isLastItem);
            }}>
            <Entypo
              name="dots-three-vertical"
              size={scale(13)}
              color={Color.Black}
              style={styles.dotsIcon}
            />
          </Pressable>
        </View>
      );
    },
    [openModal],
  );

  const renderBody = useCallback(
    () => (
      <View style={styles.bodyContainer}>
        <FlatList
          data={notesData}
          renderItem={renderNotes}
          keyExtractor={(item, index) => index.toString()}
          style={{flex: 1, marginBottom: verticalScale(60)}}
        />
        {BottomSheets()}
      </View>
    ),
    [renderNotes, BottomSheets],
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      {renderHeader()}
      {renderBody()}
      <CustomeButton
        buttonColor={Color.theme1}
        buttonWidth="90%"
        buttonHeight={scale(45)}
        title="CREATE NOTE"
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

      <CustomeModal
        visible={modalVisible}
        onClose={closeModal}
        closeModal={false}
        mainPadding={scale(5)}
        content={
          <NoteModalContent
            closeModal={closeModal}
            openBottomSheet={openBottomSheet}
            setEditBottomSheet={setEditBottomSheet}
            deleteData={deleteNote}
          />
        }
        width={scale(145)}
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
  bottomSheetContainer: {
    alignItems: 'center',
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
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
    paddingLeft: scale(7),
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
});
