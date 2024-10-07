import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, memo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Color from '../component/Color';
import {useNavigation} from '@react-navigation/native';
import CustomeHeader from '../custome/CustomeHeader';
import {scale, verticalScale} from 'react-native-size-matters';
import Font from '../component/Font';
import Entypo from 'react-native-vector-icons/Entypo';

const data = [
  {
    id: '1',
    image: require('../Assets/Img/tier1.png'),
    name: 'Tier 1',
    price: '$5',
    credits: 50,
    cloud_storage: 3,
  },
  {
    id: '2',
    image: require('../Assets/Img/tier2.png'),
    name: 'Tier 2',
    price: '$20',
    credits: 400,
    cloud_storage: 15,
  },
  {
    id: '3',
    image: require('../Assets/Img/tier3.png'),
    name: 'Tier 3',
    price: '$40',
    credits: 1000,
    cloud_storage: 40,
  },
  {
    id: '4',
    image: require('../Assets/Img/tier4.png'),
    name: 'Tier 4',
    price: '$25',
  },
  {
    id: '5',
    image: require('../Assets/Img/tier5.png'),
    name: 'Tier 5',
    price: '$50',
  },
  {
    id: '6',
    image: require('../Assets/Img/tier6.png'),
    name: 'Tier 6',
    price: '$75',
  },
  {
    id: '7',
    image: require('../Assets/Img/tier7.png'),
    name: 'Tier 7',
    price: '$100',
  },
];

// Optimized SubscriptionItem component with memo to prevent unnecessary re-renders
const SubscriptionItem = memo(({item}) => {
  return (
    <View style={styles.subscriptionView}>
      <View style={styles.subscriptionContainer}>
        <View style={styles.subscriptionInfo}>
          <Image
            source={item?.image}
            style={styles.subscriptionImage}
            resizeMode="contain"
          />
          <Text style={styles.subscriptionName}>{item?.name}</Text>
        </View>
        <View style={styles.subscriptionPriceContainer}>
          <Text style={styles.subscriptionPrice}>{item?.price}</Text>
        </View>
      </View>
      <View style={styles.bottomView}>
        {item?.credits && (
          <View style={styles.creditView}>
            <Entypo name="dot-single" size={scale(20)} color={Color.Black} />
            <Text style={styles.credit}>{item?.credits} AI credits</Text>
          </View>
        )}
        {item?.cloud_storage && (
          <View style={styles.creditView}>
            <Entypo name="dot-single" size={scale(20)} color={Color.Black} />
            <Text style={styles.credit}>
              {item?.cloud_storage} GB cloud storage
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});

const SubscriptionScreen = () => {
  const navigation = useNavigation();

  // Optimized header rendering using useCallback
  const renderHeader = useCallback(() => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={'Subscription'}
        titleStyle={styles.title}
        containerStyle={styles.headerStyle}
      />
    );
  }, []);

  // Optimized FlatList render item using useCallback
  const renderSubscription = useCallback(({item}) => {
    return <SubscriptionItem item={item} />;
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
        style={styles.gradient}>
        {renderHeader()}
        <View style={styles.contentContainer}>
          <Image
            source={require('../Assets/Img/threeStar.png')}
            style={styles.image}
            resizeMode='contain'
          />
          <Text style={styles.description}>
            Subscription is charged monthly. AI credits replenish monthly. All
            information saved in cloud monthly.
          </Text>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.subscriptionView, styles.freeSubscription]}>
          <View style={styles.subscriptionContainer}>
            <Text style={[styles.subscriptionName, styles.freeTierText]}>
              FREE
            </Text>
            <View style={styles.subscriptionPriceContainer}>
              <Text style={styles.subscriptionPrice}>$0</Text>
            </View>
          </View>
          <View style={styles.bottomView}>
            <View style={styles.creditView}>
              <Entypo name="dot-single" size={scale(20)} color={Color.Black} />
              <Text style={styles.credit}>Watch ad to earn 3 AI credits</Text>
            </View>
            <View style={styles.creditView}>
              <Entypo name="dot-single" size={scale(20)} color={Color.Black} />
              <Text style={styles.credit}>250 MB cloud storage</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={data}
          renderItem={renderSubscription}
          keyExtractor={item => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
};

export default React.memo(SubscriptionScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    // Adjust or remove the flex property based on your design needs
  },
  headerStyle: {
    backgroundColor: Color.transparent,
    height: verticalScale(90),
    alignItems: 'flex-end',
  },
  title: {
    fontSize: scale(20),
    fontFamily: Font.medium,
  },
  contentContainer: {
    alignItems: 'center',
  },
  image: {
    height: scale(70),
    width: scale(300),
    marginVertical: verticalScale(-10),
    marginBottom:verticalScale(0)
  },
  description: {
    fontSize: scale(11),
    fontFamily: Font.regular,
    color: Color.White,
    lineHeight: verticalScale(17),
    width: scale(328),
    textAlign: 'center',
    paddingBottom: verticalScale(25),
  },
  list: {
    margin: scale(15),
    marginTop: verticalScale(0),
  },
  subscriptionView: {
    backgroundColor: '#146D8B33',
    borderWidth: scale(1),
    paddingVertical: scale(5),
    borderRadius: scale(14),
    marginBottom: verticalScale(10),
    borderColor: Color.theme1,
  },
  subscriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscriptionImage: {
    width: scale(40),
    height: verticalScale(40),
    marginLeft: scale(8),
    marginTop: verticalScale(5),
  },
  subscriptionName: {
    fontSize: scale(18),
    fontFamily: Font.medium,
    color: Color.Black,
    textTransform: 'capitalize',
    paddingLeft: scale(10),
  },
  subscriptionPriceContainer: {
    width: scale(50),
    height: verticalScale(28),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(10),
    backgroundColor: Color.theme1,
    marginRight: scale(10),
  },
  subscriptionPrice: {
    fontSize: scale(15),
    fontFamily: Font.regular,
    color: Color.White,
  },
  bottomView: {
    marginTop: verticalScale(10),
    gap: verticalScale(5),
  },
  creditView: {
    flexDirection: 'row',
    gap: scale(5),
    alignItems: 'center',
    marginLeft: scale(15),
  },
  credit: {
    fontSize: scale(15),
    fontFamily: Font.regular,
    color: Color.Black,
  },
  freeSubscription: {
    marginHorizontal: scale(15),
    paddingVertical: scale(5),
    marginTop: verticalScale(10),
  },
  freeTierText: {
    marginLeft: scale(10),
  },
});
