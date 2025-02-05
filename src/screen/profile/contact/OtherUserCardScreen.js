import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Color from '../../../component/Color';
import {scale, verticalScale} from '../../../custome/Responsive';
import Font from '../../../component/Font';
import CustomeHeader from '../../../custome/CustomeHeader';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../../component/Loader';
import {apiGet} from '../../../Api/ApiService';
import Api from '../../../Api/EndPoint';
import Entypo from 'react-native-vector-icons/Entypo';
import NoDataView from '../../../component/NoDataView';
import CustomeModal from '../../../custome/CustomeModal';
import {ScreenName} from '../../../component/Screen';
import strings from '../../../language/strings';
import useTheme from '../../../component/Theme';

const OtherUserCardScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [singleCardItem, setSinglrCardItem] = useState({});
  const plusButtonRef = useRef(null);
  const {item} = route.params;
  const colorTheme = useTheme();

  useEffect(() => {
    getCardData();
  }, [getCardData]);

  // ====================================== Api ===================================== //

  const getCardData = useCallback(async () => {
    try {
      setVisible(true);
      const response = await apiGet(
        `${Api.card}?setId=${item?._id}&folderId=${item?.folderId}&userId=${item?.userId}`,
      );
      setCardData(response);
    } catch (error) {
      console.log('error', error);
    } finally {
      setVisible(false);
    }
  }, [item?._id, item?.folderId, item?.userId]);

  // ====================================== End ===================================== //

  const openCardModal = useCallback(() => {
    if (plusButtonRef.current) {
      plusButtonRef.current.measureInWindow((x, y, width, height) => {
        setModalPosition({x: x - scale(85), y: y + height + 5});
        setModalVisible(true);
      });
    }
  }, []);

  const closeCardModal = useCallback(() => setModalVisible(false), []);

  const header = useMemo(
    () => (
      <CustomeHeader
        goBack={true}
        headerBackgroundColor={Color.transparent}
        title={
          <View style={styles.titleContainer}>
            <Text style={styles.titleLine}>
              {item?.name ? item?.name : 'CARDS'}
            </Text>
          </View>
        }
        titleStyle={styles.headerTitle}
        containerStyle={styles.headerStyle}
        iconStyle={styles.iconStyle}
      />
    ),
    [item?.name],
  );

  const renderCard = ({item}) => {
    return (
      <Pressable style={styles.cardContainer}>
        <View
          style={[styles.cardHeader, {backgroundColor: colorTheme.cardHeader}]}>
          <Text style={[styles.cardTitle, {color: colorTheme.textColor}]}>
            {item.top}
          </Text>
          <Pressable
            ref={plusButtonRef}
            onPress={() => {
              setSinglrCardItem(item);
              openCardModal();
            }}
            style={styles.plusIconView}>
            <Entypo
              name="plus"
              size={scale(20)}
              color={Color.White}
              style={styles.plusIcon}
            />
          </Pressable>
        </View>
        <View
          style={[
            styles.cardBody,
            {backgroundColor: colorTheme.listAndBoxColor},
          ]}>
          <Text style={[styles.cardDesc, {color: colorTheme.textColor}]}>
            {item?.bottom}
          </Text>
        </View>
      </Pressable>
    );
  };

  const keyExtractor = (item, index) => item?._id ?? index.toString();

  const renderBody = () => {
    return (
      <View style={styles.bodyContainer}>
        {cardData?.length > 0 ? (
          <FlatList
            data={cardData}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: scale(50)}}
            renderItem={renderCard}
          />
        ) : (
          visible === false && (
            <NoDataView
              content={strings.cardNotFound}
              noDataViewStyle={{marginTop: verticalScale(-70)}}
              noDataTextStyle={{color: Color.White}}
            />
          )
        )}
      </View>
    );
  };

  return (
    <LinearGradient colors={colorTheme.gradientTheme} style={styles.container}>
      <Loader visible={visible} />
      {header}
      {renderBody()}
      <CustomeModal
        visible={modalVisible}
        onClose={closeCardModal}
        closeModal={false}
        mainPadding={scale(8)}
        content={
          <Pressable
            style={styles.modalContentView}
            onPress={() =>
              navigation.navigate(ScreenName.assignSet, {
                cardId: singleCardItem?._id,
                screen: 'OtherUserCardScreen',
              })
            }>
            <Entypo name="plus" size={scale(20)} color={Color.Black} />
            <Text style={styles.modalContentText}>{strings.addCard}</Text>
          </Pressable>
        }
        width={'31%'}
        justifyContent="flex-end"
        borderRadius={10}
        modalContainerStyle={[
          styles.modal,
          {top: modalPosition.y, left: modalPosition.x},
        ]}
      />
    </LinearGradient>
  );
};

export default React.memo(OtherUserCardScreen);

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
    width: scale(290),
    marginLeft: scale(45),
    textAlign: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    width: scale(290),
  },
  titleLine: {
    fontSize: scale(20),
    color: Color.White,
    fontFamily: Font.medium,
  },
  iconStyle: {
    bottom: verticalScale(30),
  },
  bodyContainer: {flex: 1, marginHorizontal: scale(15)},
  cardContainer: {
    marginBottom: verticalScale(10),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ececec',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
  },
  cardTitle: {
    fontSize: scale(14),
    fontFamily: Font.medium,
    color: Color.Black,
    paddingLeft: scale(10),
    width: scale(250),
  },
  plusIconView: {marginRight: scale(10)},
  plusIcon: {
    backgroundColor: Color.theme1,
    borderRadius: scale(5),
    padding: scale(4),
  },
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
  modalContentView: {flexDirection: 'row', gap: scale(5), alignItems: 'center'},
  modalContentText: {
    fontSize: scale(14),
    color: Color.Black,
    fontFamily: Font.regular,
  },
});
