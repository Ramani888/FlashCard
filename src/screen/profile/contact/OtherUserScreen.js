import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import Color from '../../../component/Color';
import CustomeHeader from '../../../custome/CustomeHeader';
import {scale, verticalScale} from '../../../custome/Responsive';
import Font from '../../../component/Font';
import {useNavigation, useRoute} from '@react-navigation/native';
import {apiGet} from '../../../Api/ApiService';
import Api from '../../../Api/EndPoint';
import CustomeModal from '../../../custome/CustomeModal';
import {ScreenName} from '../../../component/Screen';
import Loader from '../../../component/Loader';
import NoDataView from '../../../component/NoDataView';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import useTheme from '../../../component/Theme';
import strings from '../../../language/strings';

const OtherUserScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [setData, setSetData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [singleSet, setSingleSet] = useState({});
  const {item} = route.params;
  const plusButtonRef = useRef(null);
  const colorTheme = useTheme();

  useEffect(() => {
    getSetData();
  }, [getSetData]);

  // ==================================== Api ================================== //

  const getSetData = useCallback(async () => {
    try {
      setVisible(true);
      const response = await apiGet(
        `${Api.mediatorUserSet}?userId=${item?.contactUserId}`,
      );
      if (response) {
        setSetData(response);
      }
    } catch (error) {
      console.log('error in get set data api', error);
    } finally {
      setVisible(false);
    }
  }, [item.contactUserId]);

  // ==================================== End ================================== //

  const openModal = (item, isLastItem) => {
    plusButtonRef.current.measureInWindow((x, y, width, height) => {
      setModalPosition({x: x - scale(115), y: y + (height + 15)});
      setModalVisible(true);
    });
  };

  const closeModal = useCallback(() => setModalVisible(false), []);

  const renderHeader = () => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={item?.userName}
        titleStyle={styles.title}
        containerStyle={styles.headerStyle}
      />
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <Pressable
        style={[
          styles.setView,
          {
            backgroundColor: item?.isHighlight
              ? item.color
              : colorTheme.listAndBoxColor,
          },
        ]}
        onPress={() =>
          navigation.navigate(ScreenName.otherUserCard, {item: item})
        }>
        <Text
          style={[
            styles.setName,
            {color: item?.isHighlight ? Color.Black : colorTheme.textColor},
          ]}>
          {item?.name}
        </Text>
        <View style={styles.rowWithGap}>
          <View style={styles.subSetContainer}>
            <Text style={[styles.subSetText, {color: colorTheme.textColor}]}>
              {item?.cardCount}
            </Text>
            <Image
              source={require('../../../Assets/Img/cardIcon.png')}
              style={styles.cardIcon}
              tintColor={colorTheme.textColor}
            />
          </View>
          <Pressable
            ref={plusButtonRef}
            style={styles.plusButton}
            onPress={() => {
              openModal();
              setSingleSet(item);
            }}>
            <Entypo name="plus" size={scale(20)} color={Color.White} />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  const renderBody = () => {
    return (
      <View style={styles.bodyContainer}>
        <LinearGradient
          colors={colorTheme.gradientTheme}
          style={styles.headerContainer}>
          {renderHeader()}

          <Image
            source={{uri: item?.picture}}
            style={[
              styles.profileImage,
              item?.picture && styles.profileImageBorder,
            ]}
          />
        </LinearGradient>

        {setData?.length > 0 ? (
          <FlatList
            data={setData}
            renderItem={renderItem}
            style={styles.flatlist}
          />
        ) : (
          visible === false && (
            <NoDataView
              content={strings.setNotFound}
              noDataViewStyle={{}}
              noDataTextStyle={{color: Color.Black}}
            />
          )
        )}
      </View>
    );
  };
  return (
    <View style={[styles.container, {backgroundColor: colorTheme.background}]}>
      <Loader visible={visible} />
      {renderBody()}
      <CustomeModal
        visible={modalVisible}
        onClose={closeModal}
        closeModal={false}
        mainPadding={scale(8)}
        backgroundColor={colorTheme.modelBackground}
        content={
          <Pressable
            style={styles.modalContentView}
            onPress={() =>
              navigation.navigate(ScreenName.asignFolder, {
                setId: singleSet?._id,
                screen: 'OtherUserScreen',
              })
            }>
            <Entypo name="plus" size={scale(20)} color={colorTheme.textColor} />
            <Text
              style={[styles.modalContentText, {color: colorTheme.textColor}]}>
              {strings.addEntireSet}
            </Text>
          </Pressable>
        }
        width={wp('41%')}
        justifyContent="flex-end"
        borderRadius={10}
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

export default React.memo(OtherUserScreen);

const styles = StyleSheet.create({
  container: {flex: 1},
  headerContainer: {
    backgroundColor: Color.theme1,
    paddingBottom: verticalScale(20),
  },
  headerStyle: {
    backgroundColor: Color.transparent,
    height: verticalScale(90),
    alignItems: 'flex-end',
  },
  title: {
    fontSize: scale(20),
    fontFamily: Font.medium,
    textTransform: 'capitalize',
  },
  bodyContainer: {flex: 1},
  profileImage: {
    height: scale(60),
    width: scale(60),
    borderRadius: scale(30),
    alignSelf: 'center',
    marginVertical: verticalScale(15),
  },
  profileImageBorder: {borderWidth: scale(1), borderColor: Color.White},
  flatlist: {
    flex: 1,
    marginTop: scale(10),
    marginHorizontal: scale(7),
  },
  setView: {
    backgroundColor: Color.White,
    marginBottom: verticalScale(12),
    borderRadius: scale(5),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: scale(3),
    marginHorizontal: scale(10),
    marginTop: verticalScale(2),
  },
  setName: {
    fontSize: scale(16),
    fontFamily: Font.regular,
    color: Color.Black,
    marginLeft: scale(15),
    textTransform: 'uppercase',
    width: '69%',
  },
  rowWithGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  subSetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  subSetText: {
    fontSize: scale(15),
    color: Color.Black,
  },
  cardIcon: {
    width: scale(16),
    height: scale(13),
  },
  plusButton: {
    backgroundColor: Color.theme1,
    height: scale(30),
    width: scale(30),
    borderRadius: scale(5),
    alignItems: 'center',
    justifyContent: 'center',
    // margin: scale(8),
    marginVertical: verticalScale(8),
    marginRight: scale(8),
    elevation: scale(5),
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
    fontSize: wp('4%'),
    color: Color.Black,
    fontFamily: Font.regular,
  },
});
