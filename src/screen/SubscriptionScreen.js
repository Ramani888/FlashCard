import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, memo, useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Color from '../component/Color';
import {useNavigation} from '@react-navigation/native';
import CustomeHeader from '../custome/CustomeHeader';
import { scale,verticalScale } from '../custome/Responsive';
import Font from '../component/Font';
import Entypo from 'react-native-vector-icons/Entypo';
import {apiGet} from '../Api/ApiService';
import Api from '../Api/EndPoint';
import Loader from '../component/Loader';

const SubscriptionItem = memo(({item}) => {
  console.log('item?.points[0]', item?.points[0]);
  return (
    <View style={styles.subscriptionView}>
      <View style={styles.subscriptionContainer}>
        <View style={styles.subscriptionInfo}>
          <Image
            source={{uri: item?.icon}}
            style={styles.subscriptionImage}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.subscriptionName,
              item?.name == 'FREE' && styles.freeName,
            ]}>
            {item?.name}
          </Text>
        </View>
        <View style={styles.subscriptionPriceContainer}>
          <Text style={styles.subscriptionPrice}>${item?.price}</Text>
        </View>
      </View>
      <View style={styles.bottomView}>
        {item?.points[0] && (
          <View style={styles.creditView}>
            <Entypo name="dot-single" size={scale(20)} color={Color.Black} />
            <Text style={styles.credit}>{item?.points[0]}</Text>
          </View>
        )}
        {item?.points[1] && (
          <View style={styles.creditView}>
            <Entypo name="dot-single" size={scale(20)} color={Color.Black} />
            <Text style={styles.credit}>{item?.points[1]}</Text>
          </View>
        )}
      </View>
    </View>
  );
});

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState([]);

  useEffect(() => {
    getSubscriptionData();
  }, []);

  // ================================= Api =============================== //

  const getSubscriptionData = async (message, messageValue) => {
    try {
      setVisible(true);
      const url = `${Api.subscription}`;

      const response = await apiGet(url);
      if (response) {
        setSubscriptionData(response);
      }
    } catch (error) {
      console.log('error in getpdf api', error);
    } finally {
      setVisible(false);
    }
  };

  // ================================= End =============================== //

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
      <Loader visible={visible} />
      <LinearGradient
        colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
        style={styles.gradient}>
        {renderHeader()}
        <View style={styles.contentContainer}>
          <Image
            source={require('../Assets/Img/threeStar.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.description}>
            Subscription is charged monthly. AI credits replenish monthly. All
            information saved in cloud monthly.
          </Text>
        </View>
      </LinearGradient>

      <FlatList
        data={subscriptionData}
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
    marginBottom: verticalScale(0),
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
    marginTop: verticalScale(15),
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
  freeName: {marginLeft: scale(-40)},
});
