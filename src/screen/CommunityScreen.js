import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import useTheme from '../component/Theme';
import NoDataView from '../component/NoDataView';

const {height} = Dimensions.get('window');
const GlobalLiveFeedScreen = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [liveFeedData, setLiveFeedData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [singleCardItem, setSinglrCardItem] = useState({});
  const plusButtonRef = useRef(null);
  const colorTheme = useTheme();

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
        <View
          style={[
            styles.itemContainer,
            {backgroundColor: colorTheme.listAndBoxColor},
          ]}>
          <Pressable
            onPress={() =>
              navigation.navigate(ScreenName.otherUserCard, {item: item})
            }>
            <Image
              source={{uri: item?.userData?.picture}}
              style={styles.profileImage}
            />
          </Pressable>
          <Text style={[styles.itemTitle, {color: colorTheme.textColor}]}>
            Set Name:
          </Text>
          <Text style={styles.itemBadge} ellipsizeMode="tail" numberOfLines={1}>
            {item?.setData?.name}
          </Text>
        </View>
        <Pressable style={styles.cardContainer}>
          <View
            style={[
              styles.cardHeader,
              {backgroundColor: colorTheme.cardHeader1},
            ]}>
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
                size={scale(12)}
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
      </View>
    ),
    [
      colorTheme.cardHeader1,
      colorTheme.listAndBoxColor,
      colorTheme.textColor,
      navigation,
      openCardModal,
    ],
  );

  const renderBody = () => (
    <ScrollView style={styles.bodyContainer}>
      <LinearGradient
        colors={colorTheme.gradientTheme}
        style={styles.headerContainer}>
        {renderHeader()}
        <Image
          source={require('../Assets/Img/earthBigIcon.png')}
          style={styles.earthImage}
        />
      </LinearGradient>

      {liveFeedData?.length > 0 ? (
        <FlatList
          data={liveFeedData}
          renderItem={renderItem}
          keyExtractor={(item, index) => `liveFeed-${index}`}
          contentContainerStyle={styles.flatListContainer}
          scrollEnabled={false}
        />
      ) : (
        visible === false && (
          <View style={styles.noDataView}>
            <NoDataView
              content={strings.noDataFound}
              noDataTextStyle={styles.noDataText}
            />
          </View>
        )
      )}
    </ScrollView>
  );

  // ============================ Component Return ============================ //

  return (
    <View
      style={[
        styles.screenContainer,
        {backgroundColor: colorTheme.background},
      ]}>
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
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ECECEC',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(10),
    padding: scale(5),
    borderRadius: scale(15),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // elevation: scale(5),
    height: verticalScale(56),
  },
  profileImage: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    marginHorizontal: scale(10),
    marginRight: scale(15),
  },
  itemTitle: {
    fontSize: scale(17),
    fontFamily: Font.regular,
  },
  itemBadge: {
    fontSize: scale(13),
    fontFamily: Font.regular,
    textTransform: 'uppercase',
    backgroundColor: Color.theme1,
    marginLeft: scale(10),
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    borderRadius: scale(5),
    maxWidth: scale(170),
  },
  cardContainer: {
    marginBottom: verticalScale(10),
    // elevation: scale(2),
    borderRadius: scale(10),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    height: verticalScale(40),
  },
  cardTitle: {
    fontSize: scale(14),
    fontFamily: Font.medium,
    paddingLeft: scale(10),
  },
  plusIconView: {
    marginRight: scale(10),
  },
  plusIcon: {
    backgroundColor: Color.theme1,
    borderRadius: scale(5),
    padding: scale(4),
    width: scale(20),
    height: scale(20),
  },
  cardBody: {
    borderTopWidth: 0.75,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderStyle: 'solid',
    borderColor: '#ECECEC',
    padding: scale(10),
    borderBottomLeftRadius: scale(10),
    borderBottomRightRadius: scale(10),
  },
  cardDesc: {
    fontSize: scale(12),
    fontFamily: Font.regular,
  },
  modal: {
    position: 'absolute',
    borderRadius: scale(10),
    backgroundColor: Color.White,
    elevation: scale(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: scale(4),
  },
  modalContentView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
  },
  modalContentText: {
    fontSize: scale(14),
    fontFamily: Font.regular,
    color: Color.Black,
  },
  noDataView: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  noDataText: {
    color: Color.White,
    marginTop: verticalScale(height * 0.2),
  },
});
