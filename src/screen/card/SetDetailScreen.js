import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { scale, verticalScale } from '../../custome/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import Color from '../../component/Color';
import Font from '../../component/Font';
import SetDetailModalContent from '../../component/cards/SetDetailModalContent';
import { apiDelete, apiGet, apiPut } from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import { useLoader } from '../../context';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import CardGridLayout from '../../component/cards/CardGridLayout';
import SimpleLayout from '../../component/cards/SimpleLayout';
import NoDataView from '../../component/NoDataView';
import MasonryFlatlist from 'react-native-masonry-grid';
import DraggableFlatList from 'react-native-draggable-flatlist';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { MenuProvider, Menu, MenuTrigger, MenuOptions } from 'react-native-popup-menu';
import { useAppSelector } from '../../redux/hooks';
import ConfirmationDialog from '../../custome/ConfirmationDialog';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SetDetailScreen = () => {
  const route = useRoute();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { showLoader, hideLoader, isLoading } = useLoader();
  const insets = useSafeAreaInsets();
  const [cardData, setCardData] = useState([]);
  const [layout, setLayout] = useState('single');
  const [changeOrder, setChangeOrder] = useState(false);
  const [isAllBlur, setIsAllBlur] = useState(false);
  const { setName } = route.params;
  const { setId, folderId } = route.params;
  const colorTheme = useTheme();

  // Get user from Redux state instead of global
  const user = useAppSelector(state => state.auth.user);
  const userId = user?._id;

  // Confirmation dialog state
  const [showDeleteCardDialog, setShowDeleteCardDialog] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  useEffect(() => {
    getCardData(false, false);
  }, [isFocused, getCardData]);

  // ====================================== Api ===================================== //

  const getCardData = useCallback(
    async (update, isBlur, deleteCard, position) => {
      try {
        if (!update && !deleteCard) {
          showLoader();
        }
        const response = await apiGet(
          `${Api.card}?setId=${setId}&folderId=${folderId}&userId=${userId}`,
        );
        setCardData(response?.data || response || []);
      } catch (error) {
        console.log('error', error);
      } finally {
        hideLoader();
      }
    },
    [folderId, setId, userId, showLoader, hideLoader],
  );

  const updateCard = useCallback(
    async (cardId, top, bottom, note, isBlur, position) => {
      !position && showLoader();
      const rawData = {
        _id: cardId,
        userId: userId,
        folderId: folderId,
        setId: setId,
        top: top,
        bottom: bottom,
        note: note,
        isBlur: isBlur,
        position: position,
      };
      try {
        const response = await apiPut(Api.card, '', JSON.stringify(rawData));
        if (response) {
          getCardData(true, isBlur, '', true);
        }
      } catch (error) {
        console.log('error in update card', error);
        showMessageonTheScreen('Failed to update card');
      } finally {
        !position && hideLoader();
      }
    },
    [folderId, setId, userId, getCardData, showLoader, hideLoader],
  );

  const blurAllCard = useCallback(async isBlur => {
    setIsAllBlur(isBlur);
    try {
      showLoader();
      const response = await apiPut(
        `${Api.blurAllCard}?setId=${setId}&isBlur=${isBlur}`,
      );
      if (response?.success === true) {
        getCardData(false);
        showMessageonTheScreen(response?.message || 'Cards updated');
      }
    } catch (error) {
      console.log('error', error);
      showMessageonTheScreen('Failed to update card blur');
    } finally {
      hideLoader();
    }
  }, [setId, showLoader, hideLoader, getCardData]);

  const deleteCard = useCallback(async cardId => {
    try {
      showLoader();
      const response = await apiDelete(`${Api.card}?_id=${cardId}`);
      if (response?.success === true) {
        getCardData(false, '', true);
        showMessageonTheScreen(response?.message);
      }
    } catch (error) {
      console.log('error in delete card', error);
      showMessageonTheScreen('Failed to delete card');
    } finally {
      hideLoader();
    }
  }, [showLoader, hideLoader, getCardData]);

  const handleDeleteCardPress = useCallback((card) => {
    setCardToDelete(card);
    setShowDeleteCardDialog(true);
  }, []);

  const confirmDeleteCard = useCallback(() => {
    if (cardToDelete?._id) {
      deleteCard(cardToDelete._id);
    }
    setShowDeleteCardDialog(false);
    setCardToDelete(null);
  }, [cardToDelete, deleteCard]);

  const updatePosition = useCallback(() => {
    try {
      showLoader();
      cardData?.forEach((item, index) =>
        updateCard(
          item?._id,
          item?.top,
          item?.bottom,
          item?.note,
          item?.isBlur,
          index,
        ),
      );
      showMessageonTheScreen('Card positions updated');
    } catch (error) {
      console.log('error in update position functionality', error);
      showMessageonTheScreen('Failed to update positions');
    } finally {
      hideLoader();
    }
  }, [cardData, updateCard, showLoader, hideLoader]);

  // ====================================== End ===================================== //

  const handleLayoutChange = useCallback((newLayout) => {
    setLayout(newLayout);
  }, []);

  const keyExtractor = useCallback((item, index) => {
    return item?._id ? item._id.toString() : index.toString();
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerStyle}>
        {changeOrder === false && (
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              padding: scale(5),
            }}>
            <AntDesign name="arrowleft" size={scale(25)} color={Color.White} />
          </Pressable>
        )}
        {changeOrder && (
          <Pressable
            onPress={() => setChangeOrder(false)}
            style={{ padding: scale(5) }}>
            <AntDesign name="close" size={scale(25)} color={Color.White} />
          </Pressable>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.titleLine}>{setName}</Text>
        </View>
        {changeOrder === false && (
          <Menu>
            <MenuTrigger>
              <View
                style={[
                  styles.dotsIcon,
                  {
                    backgroundColor: '#e0e0e0',
                    borderRadius: scale(5),
                    padding: scale(4),
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
              >
                <Entypo
                  name="dots-three-vertical"
                  size={scale(13)}
                  color={Color.White}
                />
              </View>
            </MenuTrigger>
            <MenuOptions customStyles={{ optionsContainer: { borderRadius: scale(8), backgroundColor: colorTheme.modelNewBackground } }}>
              <SetDetailModalContent
                folderId={folderId}
                setId={setId}
                setLayout={handleLayoutChange}
                layout={layout}
                blurAllCard={blurAllCard}
                isBlur={isAllBlur}
                setChangeOrder={setChangeOrder}
              />
            </MenuOptions>
          </Menu>
        )}
        {changeOrder && (
          <Pressable
            style={styles.check}
            onPress={() => {
              updatePosition();
              setChangeOrder(false);
            }}>
            <FontAwesome6 name="check" size={scale(23)} color={Color.White} />
          </Pressable>
        )}
      </View>
    );
  }, [setName, changeOrder, folderId, setId, layout, isAllBlur, colorTheme.modelNewBackground, navigation, updatePosition, blurAllCard, handleLayoutChange]);

  const renderItem = useCallback(
    ({ item, drag, isActive }) => {
      return (
        <SimpleLayout
          item={item}
          updateCard={updateCard}
          folderId={folderId}
          setId={setId}
          onDragStart={drag}
          changeOrder={changeOrder}
          isActive={isActive}
          onDeleteCardPress={handleDeleteCardPress}
        />
      );
    },
    [folderId, setId, updateCard, changeOrder, handleDeleteCardPress],
  );

  const handleReorder = useCallback((reorderedData) => {
    setCardData(reorderedData);
  }, []);

  const renderSimpleItem = useCallback(
    (item) => (
      <SimpleLayout
        item={item?.item}
        updateCard={updateCard}
        folderId={folderId}
        setId={setId}
        onDeleteCardPress={handleDeleteCardPress}
      />
    ),
    [updateCard, folderId, setId, handleDeleteCardPress],
  );

  const renderGridItem = useCallback(
    ({ item }) => (
      <CardGridLayout
        item={item}
        updateCard={updateCard}
        folderId={folderId}
        setId={setId}
        onDeleteCardPress={handleDeleteCardPress}
      />
    ),
    [updateCard, folderId, setId, handleDeleteCardPress],
  );

  const renderBody = useMemo(
    () => (
      <View style={styles.bodyContainer}>
        {layout === 'single' ? (
          <>
            {cardData?.length > 0 ? (
              changeOrder ? (
                <DraggableFlatList
                  showsVerticalScrollIndicator={false}
                  data={cardData}
                  keyExtractor={keyExtractor}
                  renderItem={renderItem}
                  onDragEnd={({ data }) => handleReorder(data)}
                  activationDistance={20}
                  autoscrollSpeed={200}
                  autoscrollThreshold={80}
                  containerStyle={{ flex: 1 }}
                />
              ) : (
                <FlatList
                  data={cardData}
                  keyExtractor={keyExtractor}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + scale(10), scale(30)) }}
                  renderItem={renderSimpleItem}
                />
              )
            ) : !isLoading ? (
              <NoDataView
                content={strings.cardNotFound}
                noDataViewStyle={{ marginTop: verticalScale(-70) }}
                noDataTextStyle={{ color: Color.White }}
              />
            ) : null}
          </>
        ) : (
          <>
            {cardData?.length > 0 ? (
              <MasonryFlatlist
                data={cardData}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + scale(30), scale(70)) }}
                style={styles.masonryFlatlist}
                renderItem={renderGridItem}
              />
            ) : !isLoading ? (
              <NoDataView
                content={strings.cardNotFound}
                noDataViewStyle={{ marginTop: verticalScale(-70) }}
                noDataTextStyle={{ color: Color.White }}
              />
            ) : null}
          </>
        )}
      </View>
    ),
    [
      cardData,
      layout,
      changeOrder,
      keyExtractor,
      renderItem,
      handleReorder,
      renderSimpleItem,
      renderGridItem,
      isLoading,
    ],
  );

  return (
    <LinearGradient colors={colorTheme.gradientTheme} style={styles.container}>
      <MenuProvider>
        {renderHeader()}
        {renderBody}

        <ConfirmationDialog
          isVisible={showDeleteCardDialog}
          title={strings.deleteCard || 'Delete Card'}
          message={strings.deleteCardConfirmMessage || 'Are you sure you want to delete this card? This action cannot be undone.'}
          confirmText={strings.delete}
          cancelText={strings.cancel}
          isDanger={true}
          onConfirm={confirmDeleteCard}
          onCancel={() => setShowDeleteCardDialog(false)}
        />
      </MenuProvider>
    </LinearGradient>
  );
};

export default React.memo(SetDetailScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scale(15),
    marginTop: verticalScale(45),
    // marginBottom: verticalScale(30),
  },
  headerTitle: {
    top: verticalScale(50),
  },
  titleContainer: {
    alignItems: 'center',
    width: scale(250),
  },
  titleLine: {
    width: scale(250),
    fontSize: scale(20),
    color: Color.White,
    fontFamily: Font.medium,
    textAlign: 'center',
    // backgroundColor:'red'
  },
  iconStyle: {
    bottom: verticalScale(30),
  },
  bodyContainer: {
    flex: 1,
    marginHorizontal: scale(15),
    marginTop: verticalScale(12),
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
    shadowOffset: { width: 0, height: 2 },
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
  gridCardAction: { flexDirection: 'column', paddingVertical: verticalScale(5) },
  //   dotsIcon: {
  //     backgroundColor: Color.iconBackground,
  //     borderRadius: scale(5),
  //     padding: scale(10),
  //     marginBottom: verticalScale(5),
  //   },
  check: { marginTop: verticalScale(5), marginRight: scale(12) },
});
