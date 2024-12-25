import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Color from '../component/Color';
import CustomeHeader from '../custome/CustomeHeader';
import {scale, verticalScale} from '../custome/Responsive';
import Font from '../component/Font';
import {useNavigation} from '@react-navigation/native';
import Loader from '../component/Loader';
import {apiGet} from '../Api/ApiService';
import Api from '../Api/EndPoint';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeModal from '../custome/CustomeModal';
import {ScreenName} from '../component/Screen';
import strings from '../language/strings';

const GlobalLiveFeedScreen = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [liveFeedData, setLiveFeedData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [cardHeight, setCardHeight] = useState(0);
  const [singleCardItem, setSinglrCardItem] = useState({});
  const plusButtonRef = useRef(null);

  useEffect(() => {
    getLiveFeedData();
  }, []);

  // =============================== API Call =============================== //

  const getLiveFeedData = async () => {
    try {
      setVisible(true);
      const response = await apiGet(Api.getLiveFeedData);
      setLiveFeedData(response || []);
    } catch (error) {
      console.error('Error in getLiveFeedData API:', error);
    } finally {
      setVisible(false);
    }
  };

  // ============================ Render Functions ============================ //

  const onCardLayout = useCallback(
    event => {
      const {height} = event.nativeEvent.layout;
      setCardHeight(height);
    },
    [liveFeedData],
  );

  const openCardModal = useCallback(() => {
    if (plusButtonRef.current) {
      plusButtonRef.current.measureInWindow((x, y, width, height) => {
        setModalPosition({x: x - scale(85), y: y + height + 5});
        setModalVisible(true);
      });
    }
  }, []);

  const closeCardModal = useCallback(() => setModalVisible(false), []);

  const renderHeader = useCallback(
    () => (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={strings.homeTab6}
        iconStyle={styles.iconStyle}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
      />
    ),
    [],
  );

  const renderItem = useCallback(
    ({item}) => (
      <View>
        <View style={styles.itemContainer}>
          <Image
            source={{uri: item?.userData?.picture}}
            style={styles.profileImage}
          />
          <Text style={styles.itemTitle}>Set Name:</Text>
          <Text style={styles.itemBadge} ellipsizeMode="tail" numberOfLines={1}>
            {item?.setData?.name}
          </Text>
        </View>
        <Pressable onLayout={onCardLayout} style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.top}</Text>
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
          <View style={styles.cardBody}>
            <Text style={styles.cardDesc}>{item?.bottom}</Text>
          </View>
        </Pressable>
      </View>
    ),
    [],
  );

  const renderBody = () => (
    <View style={styles.bodyContainer}>
      <LinearGradient
        colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
        style={styles.headerContainer}>
        {renderHeader()}
        <Image
          source={require('../Assets/Img/earthBigIcon.png')}
          style={styles.earthImage}
        />
      </LinearGradient>

      <FlatList
        data={liveFeedData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `liveFeed-${index}`}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );

  // ============================ Component Return ============================ //

  return (
    <View style={styles.screenContainer}>
      <Loader visible={visible} />
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
    </View>
  );
};

export default React.memo(GlobalLiveFeedScreen);

// ============================ Styles ============================ //

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Color.White,
  },
  headerContainer: {
    height: verticalScale(230),
  },
  headerStyle: {
    height: verticalScale(90),
    alignItems: 'flex-end',
    backgroundColor: Color.transparent,
  },
  headerTitleStyle: {
    color: Color.White,
    fontSize: scale(20),
  },
  iconStyle: {
    bottom: verticalScale(1),
  },
  earthImage: {
    width: scale(96),
    height: scale(96),
    alignSelf: 'center',
    marginTop: verticalScale(17),
  },
  bodyContainer: {
    flex: 1,
  },
  flatListContainer: {
    paddingHorizontal: scale(15),
    paddingTop: verticalScale(10),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(10),
    padding: scale(5),
    backgroundColor: Color.White,
    borderRadius: scale(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: scale(5),
  },
  profileImage: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    marginRight: scale(20),
  },
  itemTitle: {
    fontSize: scale(17),
    color: Color.Black,
    fontFamily: Font.regular,
  },
  itemBadge: {
    fontSize: scale(13),
    color: Color.White,
    fontFamily: Font.regular,
    textTransform: 'uppercase',
    backgroundColor: Color.theme1,
    marginLeft: scale(10),
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    borderRadius: scale(5),
    maxWidth: scale(175),
    // width: scale(175),
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(50),
  },
  emptyStateText: {
    fontSize: scale(16),
    color: Color.Black,
    fontFamily: Font.regular,
  },
  cardContainer: {
    marginBottom: verticalScale(10),
    elevation: scale(5),
    borderRadius: scale(10),
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
