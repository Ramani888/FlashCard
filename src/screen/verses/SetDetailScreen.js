import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeHeader from '../../custome/CustomeHeader';
import Color from '../../component/Color';
import Font from '../../component/Font';
import CustomeModal from '../../custome/CustomeModal';
import SetDetailModalContent from '../../component/verses/SetDetailModalContent';
import CardModalContent from '../../component/verses/CardModalContent';
import {apiDelete, apiGet, apiPut} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import Loader from '../../component/Loader';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import CardGridLayout from '../../component/verses/CardGridLayout';
import SimpleLayout from '../../component/verses/SimpleLayout';
import {useSelector} from 'react-redux';
import AddNoteModalContent from '../../component/verses/AddNoteModalContent';

const SetDetailScreen = () => {
  const route = useRoute();
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [cardModalPosition, setCardModalPosition] = useState({x: 0, y: 0});
  const [noteModalPosition, setNoteModalPosition] = useState({x: 0, y: 0});
  const [cardData, setCardData] = useState([]);
  const [item, setItem] = useState({});
  const [layout, setLayout] = useState('single');
  const {setName} = route.params;
  const threeDotIconRef = useRef();
  const {setId, folderId} = route.params;
  const {cardTypeName, cardTypeId} = useSelector(state => state.myState);

  useEffect(() => {
    getCardData(false, false);
  }, [isFocused]);

  // ====================================== Api ===================================== //

  const getCardData = async (update, isBlur, deleteCard) => {
    try {
      if (!update && !deleteCard) {
        setVisible(true);
      }
      const response = await apiGet(
        `${Api.card}?setId=${setId}&folderId=${folderId}&cardTypeId=${cardTypeId}&userId=${global.user?._id}`,
      );
      setCardData(response);
      if (update) {
        isBlur
          ? showMessageonTheScreen('card is blured')
          : showMessageonTheScreen('card is unBlured');
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setVisible(false);
    }
  };

  const updateCard = async (cardId, top, bottom, note, isBlur) => {
    setVisible(true);
    const rawData = {
      _id: cardId,
      userId: global?.user?._id,
      cardTypeId: cardTypeId,
      folderId: folderId,
      setId: setId,
      top: top,
      bottom: bottom,
      note: note,
      isBlur: isBlur,
    };
    try {
      const response = await apiPut(Api.card, '', JSON.stringify(rawData));
      if (response) {
        getCardData(true, isBlur);
      }
    } catch (error) {
      console.log('error in update card', error);
    }
  };

  const blurAllCard = async isBlur => {
    try {
      setVisible(true);
      const response = await apiPut(
        `${Api.blurAllCard}?setId=${setId}&isBlur=${isBlur}`,
      );
      console.log('response', response);
      if (response?.success == true) {
        getCardData(false);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const deleteCard = async cardId => {
    try {
      setVisible(true);
      const response = await apiDelete(`${Api.card}?_id=${cardId}`);
      if (response?.success == true) {
        getCardData(false, '', true);
        showMessageonTheScreen(response?.message);
      }
    } catch (error) {
      console.log('error in delete card', error);
    }
  };

  // ====================================== End ===================================== //

  const changeOrder = () => {
    const newData = [...cardData].reverse();
    setCardData(newData);
  };

  const openModal = useCallback(ref => {
    if (ref.current) {
      ref.current.measureInWindow((x, y, width, height) => {
        setModalPosition({x: x - width * 3.5, y: y + height + 10});
        setModalVisible(true);
      });
    }
  }, []);

  const closeModal = useCallback(() => setModalVisible(false), []);

  const openCardModal = useCallback(() => {
    if (threeDotIconRef.current) {
      threeDotIconRef.current.measureInWindow((x, y, width, height) => {
        setCardModalPosition({x: x - width * 3.9, y: y + height + 10});
        setCardModalVisible(true);
      });
    }
  }, []);

  const closeCardModal = useCallback(() => setCardModalVisible(false), []);

  const openNoteModal = useCallback(
    (ref, cardHeight) => {
      console.log('cardHeight',cardHeight)
      if (ref.current) {
        ref.current.measureInWindow((x, y, width, height) => {
          layout == 'single'
            ? setNoteModalPosition({x: x - width * 6, y: y + cardHeight * 0.35})
            : setNoteModalPosition({
                x: x - width * 4.6,
                y: y + cardHeight * 0.2,
              });
          setNoteModalVisible(true);
        });
      }
    },
    [layout],
  );

  const closeNoteModal = useCallback(() => setNoteModalVisible(false), []);

  const header = useMemo(
    () => (
      <CustomeHeader
        goBack={true}
        threeDotIcon={true}
        headerBackgroundColor={Color.transparent}
        title={
          <View style={styles.titleContainer}>
            <Text style={styles.titleLine}>{cardTypeName}</Text>
            <Text style={styles.titleLine}>{setName}</Text>
          </View>
        }
        iconStyle={styles.iconStyle}
        openSetDetailModal={openModal}
        titleStyle={styles.headerTitle}
        containerStyle={styles.headerStyle}
      />
    ),
    [setName],
  );

  const renderBody = useMemo(
    () => (
      <View style={styles.bodyContainer}>
        {layout == 'single' ? (
          <FlatList
            data={cardData}
            renderItem={({item}) => {
              return (
                <SimpleLayout
                  item={item}
                  updateCard={updateCard}
                  threeDotIconRef={threeDotIconRef}
                  setItem={setItem}
                  folderId={folderId}
                  setId={setId}
                  openCardModal={openCardModal}
                  openNoteModal={openNoteModal}
                />
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            style={styles.flatList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={cardData}
            renderItem={({item}) => {
              return (
                <CardGridLayout
                  item={item}
                  updateCard={updateCard}
                  threeDotIconRef={threeDotIconRef}
                  setItem={setItem}
                  folderId={folderId}
                  setId={setId}
                  openCardModal={openCardModal}
                  openNoteModal={openNoteModal}
                />
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            style={styles.flatList}
            numColumns={2}
            key={'_'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: scale(50)}}
          />
        )}
      </View>
    ),
    [cardData, layout],
  );

  return (
    <LinearGradient
      colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
      style={styles.container}>
      <Loader visible={visible} />
      {header}
      {renderBody}
      {modalVisible && (
        <Pressable style={styles.overlay} onPress={closeModal} />
      )}
      {cardModalVisible && <View style={styles.overlay} />}
      <CustomeModal
        visible={modalVisible}
        onClose={closeModal}
        closeModal={false}
        mainPadding={scale(5)}
        content={
          <SetDetailModalContent
            closeModal={closeModal}
            folderId={folderId}
            setId={setId}
            setLayout={setLayout}
            layout={layout}
            blurAllCard={blurAllCard}
            changeOrder={changeOrder}
          />
        }
        width={scale(150)}
        justifyContent="flex-end"
        borderRadius={scale(10)}
        modalContainerStyle={[
          styles.modal,
          {
            top: modalPosition.y,
            left: modalPosition.x,
          },
        ]}
      />

      <CustomeModal
        visible={cardModalVisible}
        onClose={closeCardModal}
        closeModal={false}
        mainPadding={scale(5)}
        content={
          <CardModalContent
            closeModal={closeCardModal}
            deleteCard={deleteCard}
            item={item}
            folderId={folderId}
            setId={setId}
          />
        }
        width={scale(100)}
        justifyContent="flex-end"
        borderRadius={scale(10)}
        modalContainerStyle={[
          styles.modal,
          {
            top: cardModalPosition.y,
            left: cardModalPosition.x,
          },
        ]}
      />

      <CustomeModal
        visible={noteModalVisible}
        onClose={closeNoteModal}
        closeModal={false}
        mainPadding={scale(5)}
        content={
          <AddNoteModalContent item={item} folderId={folderId} setId={setId} />
        }
        width={scale(140)}
        justifyContent="flex-end"
        borderRadius={scale(10)}
        modalContainerStyle={[
          styles.modal,
          {
            top: noteModalPosition.y,
            left: noteModalPosition.x,
          },
        ]}
      />
    </LinearGradient>
  );
};

export default React.memo(SetDetailScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    backgroundColor: Color.transparent,
    height: verticalScale(125),
    alignItems: 'flex-end',
  },
  headerTitle: {
    top: verticalScale(50),
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleLine: {
    fontSize: scale(20),
    color: Color.White,
    fontFamily: Font.medium,
  },
  iconStyle: {
    bottom: verticalScale(30),
  },
  bodyContainer: {
    flex: 1,
    marginHorizontal: scale(15),
  },
  flatList: {
    flex: 1,
  },
  cardContainer: {
    marginBottom: verticalScale(10),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ececec',
    paddingVertical: verticalScale(10),
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
  },
  cardTitle: {
    fontSize: scale(14),
    fontFamily: Font.medium,
    color: Color.Black,
    paddingLeft: scale(10),
  },
  cardNumber: {
    fontSize: scale(14),
    fontFamily: Font.medium,
    color: Color.Black,
    paddingLeft: scale(20),
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
    position: 'absolute',
    right: scale(10),
  },
  dotIconView: {},
  cardBody: {
    backgroundColor: Color.White,
    padding: scale(10),
    borderBottomLeftRadius: scale(10),
    borderBottomRightRadius: scale(10),
    position: 'relative',
    overflow: 'hidden',
  },
  cardDesc: {
    fontSize: scale(12),
    color: Color.Black,
    fontFamily: Font.regular,
  },
  infoIcon: {
    width: scale(24),
    height: scale(24),
  },
  dotsIcon: {
    backgroundColor: '#e0e0e0',
    borderRadius: scale(5),
    padding: scale(4),
  },
  absoluteBlur: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  modal: {
    position: 'absolute',
    backgroundColor: Color.White,
    elevation: scale(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: scale(0.3),
    shadowRadius: scale(4),
    borderRadius: scale(10),
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 1000,
  },
  gridCardHeader: {
    backgroundColor: '#ececec',
    width: scale(150),
    paddingVertical: scale(20),
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    alignItems: 'flex-start',
  },
  gridCardAction: {flexDirection: 'column', paddingVertical: verticalScale(5)},
});
