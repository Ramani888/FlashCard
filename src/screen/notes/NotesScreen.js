import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Color from '../../component/Color';
import { scale, verticalScale } from '../../custome/Responsive';
import CustomeHeader from '../../custome/CustomeHeader';
import Font from '../../component/Font';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeButton from '../../custome/CustomeButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheetContent from '../../component/BottomSheetContent';
import CustomeModal from '../../custome/CustomeModal';
import NoteModalContent from '../../component/profile/NoteModalContent';
import { apiDelete, apiGet, apiPost, apiPut } from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import Loader from '../../component/Loader';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import { useNavigation } from '@react-navigation/native';
import { ScreenName } from '../../component/Screen';
import NoDataView from '../../component/NoDataView';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';
import ActionSheet from 'react-native-actions-sheet';

const { height, width } = Dimensions.get('window');

const notesData = [{ name: 'Cults' }, { name: 'To do' }, { name: 'Catholics' }];

const NotesScreen = () => {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [editBottomSheet, setEditBottomSheet] = useState(false);
    const [singleNoteData, setSingleNoteData] = useState({});
    const [noteData, setNoteData] = useState([]);
    const [noteName, setNoteName] = useState();
    const [noteStatus, setNoteStatus] = useState(0);
    const [noteColor, setNoteColor] = useState('');
    const [colorView, setColorView] = useState(false);
    const threeDotIconRef = useRef(null);
    const refRBSheet = useRef();
    const colorTheme = useTheme();

    useEffect(() => {
        getNoteData(true);
    }, []);

    // ====================================== Api ===================================== //

    const getNoteData = async (initialLoader, message) => {
        try {
            initialLoader && setVisible(true);
            const response = await apiGet(`${Api.notes}?userId=${global?.user?._id}`);
            setNoteData(response);
            if (!initialLoader && message) {
                showMessageonTheScreen(message);
            }
        } catch (error) {
            console.log('error in get note data', error);
        } finally {
            setVisible(false);
        }
    };

    const createNote = async () => {
        const rawData = {
            userId: global?.user?._id,
            name: noteName,
            color: noteColor,
            note: '',
            isHighlight: colorView,
        };
        try {
            setVisible(true);
            const response = await apiPost(Api.notes, '', JSON.stringify(rawData));
            if (response?.success == true) {
                getNoteData(false, response?.message);
            }
        } catch (error) {
            console.log('error in create note api', error);
        }
    };

    const editNote = async (
        editWithNote,
        noteId,
        name,
        color,
        noteDesc,
        isColorView,
    ) => {
        const rawData = {
            _id: editWithNote ? noteId : singleNoteData?._id,
            userId: global?.user?._id,
            name: editWithNote ? name : noteName,
            color: editWithNote ? color : noteColor,
            note: noteDesc,
            isHighlight: isColorView ? isColorView : colorView,
        };
        try {
            setVisible(true);
            const response = await apiPut(Api.notes, '', JSON.stringify(rawData));
            if (response?.success == true) {
                getNoteData(false, false);
            }
        } catch (error) {
            console.log('error in update note api', error);
        }
    };

    const deleteNote = async noteId => {
        try {
            setVisible(true);
            const response = await apiDelete(`${Api.notes}?_id=${noteId}`);
            if (response?.success == true) {
                getNoteData(false, response?.message);
            }
        } catch (error) {
            console.log('error in delete note api', error);
        }
    };

    // ====================================== End ===================================== //

    const openModal = useCallback((item, isLastItem) => {
        threeDotIconRef.current.measureInWindow((x, y, width, height) => {
            const offsetY =
                notesData?.length > 7
                    ? isLastItem
                        ? -height - 15
                        : height + 15
                    : height + 15;
            setModalPosition({ x: x - scale(120), y: y + offsetY });
            setModalVisible(true);
        });
    }, []);

    const closeModal = useCallback(() => {
        setModalVisible(false);
    }, []);

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
                    borderTopRightRadius: scale(30)
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
        ],
    );

    const renderNotes = useCallback(
        ({ item, index }) => {
            const isLastItem = index === notesData.length - 1;

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
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {!colorView && (
                            <Text style={[styles.color, { backgroundColor: item?.color }]} />
                        )}
                        <Text
                            style={[
                                styles.noteText,
                                { color: item?.isHighlight ? Color.Black : colorTheme.textColor },
                            ]}>
                            {item?.name}
                        </Text>
                    </View>
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
                            style={[
                                styles.dotsIcon,
                                {
                                    backgroundColor: item?.isHighlight
                                        ? Color.White
                                        : colorTheme.threeDotIcon,
                                },
                            ]}
                        />
                    </Pressable>
                </Pressable>
            );
        },
        [openModal, noteData, singleNoteData],
    );

    const renderBody = useCallback(
        () => (
            <View style={styles.bodyContainer}>
                {noteData.length > 0 ? (
                    <FlatList
                        data={noteData}
                        renderItem={renderNotes}
                        keyExtractor={(item, index) => index.toString()}
                        style={{ flex: 1, marginBottom: verticalScale(60) }}
                    />
                ) : (
                    visible === false && (
                        <NoDataView
                            content={strings.noNoteFound}
                            noDataViewStyle={{ marginTop: verticalScale(-70) }}
                        />
                    )
                )}
                {BottomSheets()}
            </View>
        ),
        [renderNotes, BottomSheets, visible],
    );

    return (
        <View style={[styles.container, { backgroundColor: colorTheme.background }]}>
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

            <CustomeModal
                visible={modalVisible}
                onClose={closeModal}
                closeModal={false}
                mainPadding={scale(5)}
                backgroundColor={colorTheme.modelBackground}
                content={
                    <NoteModalContent
                        item={singleNoteData}
                        closeModal={closeModal}
                        openBottomSheet={openBottomSheet}
                        setEditBottomSheet={setEditBottomSheet}
                        deleteData={deleteNote}
                        colorTheme={colorTheme}
                    />
                }
                width={'42%'}
                justifyContent="flex-end"
                borderRadius={20}
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
    indicatorStyle: { marginTop: verticalScale(10), backgroundColor: Color.mediumGray },
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: scale(0.3),
        shadowRadius: scale(4),
    },
    color: {
        width: scale(12),
        height: verticalScale(30),
        borderRadius: scale(10),
        marginLeft: scale(3),
    },
});
