import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, memo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Color from '../component/Color';
import {useNavigation} from '@react-navigation/native';
import CustomeHeader from '../custome/CustomeHeader';
import {scale, verticalScale} from 'react-native-size-matters';
import Font from '../component/Font';

// Move the data outside of the component to avoid recreating it on every render
const data = [
  {
    id: '1',
    image: require('../Assets/Img/tier1.png'),
    name: 'Tier 1',
    price: '$1',
  },
  {
    id: '2',
    image: require('../Assets/Img/tier2.png'),
    name: 'Tier 2',
    price: '$5',
  },
  {
    id: '3',
    image: require('../Assets/Img/tier3.png'),
    name: 'Tier 3',
    price: '$10',
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

const SubscriptionItem = memo(({item}) => (
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
));

const SubscriptionScreen = () => {
  const navigation = useNavigation();

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
            source={require('../Assets/Img/multiStar.png')}
            style={styles.image}
          />
          <Text style={styles.description}>
            Subscription removes advertisement and is a way you can contribute
            monthly to the ministry. The tiers are simply there if you feel led
            to helping more.
          </Text>
        </View>
      </LinearGradient>
      <FlatList
        data={data}
        renderItem={renderSubscription}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default React.memo(SubscriptionScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    // flex: 1,
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
    height: scale(36),
    width: scale(288),
    marginVertical: verticalScale(5),
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
  },
  subscriptionContainer: {
    backgroundColor: '#146D8B33',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: scale(1),
    borderColor: Color.theme1,
    alignItems: 'center',
    paddingVertical: scale(5),
    borderRadius: scale(14),
    marginBottom: verticalScale(10),
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
});
