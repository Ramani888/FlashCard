// import React, {useEffect, useState} from 'react';
// import {Platform, Text, View, StyleSheet, Alert} from 'react-native';
// import {
//   initConnection,
//   flushFailedPurchasesCachedAsPendingAndroid,
//   getSubscriptions,
//   requestSubscription,
// } from 'react-native-iap';
// import Color from '../component/Color';
// import {verticalScale} from 'react-native-size-matters';
// import CustomeAlert from '../custome/CustomeAlert';

// const isAndroid = Platform.OS === 'android';

// const SubscriptionScreen = () => {
//   const [iapInitialized, setIapInitialized] = useState(false);
//   const [error, setError] = useState(null);
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [isPopupVisible, setPopupVisible] = useState(true);
//   const [title, setTitle] = useState('');

//   const subscriptionIds = ['tier_1_plan', 'tier_2_plan', 'tier_3_plan']; // Subscription IDs

//   useEffect(() => {
//     initializeIAP();
//   }, []);

//   useEffect(() => {
//     if (iapInitialized) {
//       getSubscriptionInfo();
//     }
//   }, [iapInitialized]);

//   const initializeIAP = async () => {
//     try {
//       const connection = await initConnection();
//       if (connection) {
//         setIapInitialized(true);
//         if (isAndroid) {
//           await flushFailedPurchasesCachedAsPendingAndroid();
//         }
//       } else {
//         console.warn('IAP connection failed');
//       }
//     } catch (err) {
//       console.error('Error initializing IAP:', err);
//       setError(err);
//     }
//   };

//   const getSubscriptionInfo = async () => {
//     try {
//       const fetchedSubscriptions = await getSubscriptions({
//         skus: subscriptionIds,
//       });
//       setSubscriptions(fetchedSubscriptions);
//     } catch (error) {
//       console.error('Error fetching subscriptions:', error);
//       setError(error);
//     }
//   };

//   const onSubscription = async sku => {
//     try {
//       const offerToken = isAndroid
//         ? sku?.subscriptionOfferDetails[0]?.offerToken
//         : null;

//       const purchaseData = await requestSubscription({
//         sku: sku?.productId,
//         ...(offerToken && {
//           subscriptionOffers: [{sku: sku?.productId, offerToken}],
//         }),
//       });
//       setTitle(sku?.title);
//       setPopupVisible(true);
//     } catch (error) {
//       console.error('Subscription Error:', error);
//       Alert.alert(
//         'Subscription Failed',
//         'Something went wrong. Please try again.',
//       );
//     }
//   };

//   const closePopup = () => {
//     setPopupVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>IAP is initialized</Text>
//       <Text style={styles.subtitle}>Subscriptions:</Text>
//       {subscriptions.length > 0 ? (
//         subscriptions.map((sub, index) => {
//           let price = '';
//           let currency = '';
//           sub?.subscriptionOfferDetails.forEach(item => {
//             const pricingPhaseList = item.pricingPhases?.pricingPhaseList;
//             price = pricingPhaseList[0]?.formattedPrice;
//             currency = pricingPhaseList[0]?.priceCurrencyCode;
//           });

//           return (
//             <Text
//               key={index}
//               style={styles.item}
//               onPress={() => onSubscription(sub)}>
//               {sub.title} - {price} {currency}
//             </Text>
//           );
//         })
//       ) : (
//         <Text>No subscriptions found</Text>
//       )}

//       <CustomeAlert
//         isVisible={isPopupVisible}
//         title={'Success'}
//         message={`Subscription Successful', You subscribed to ${title}`}
//         onConfirm={closePopup}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: Color.Black,
//   },
//   subtitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 16,
//     marginBottom: 8,
//     color: Color.Black,
//   },
//   item: {
//     fontSize: 14,
//     marginBottom: 4,
//     color: Color.Black,
//     marginBottom: verticalScale(15),
//   },
// });

// export default SubscriptionScreen;

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
} from 'react-native';
import React, {useCallback, memo, useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Color from '../component/Color';
import {useNavigation} from '@react-navigation/native';
import CustomeHeader from '../custome/CustomeHeader';
import {scale, verticalScale} from '../custome/Responsive';
import Font from '../component/Font';
import Entypo from 'react-native-vector-icons/Entypo';
import {apiGet} from '../Api/ApiService';
import Api from '../Api/EndPoint';
import Loader from '../component/Loader';
import useTheme from '../component/Theme';
import strings from '../language/strings';
import {
  initConnection,
  flushFailedPurchasesCachedAsPendingAndroid,
  getSubscriptions,
  requestSubscription,
} from 'react-native-iap';
import CustomeAlert from '../custome/CustomeAlert';

const isAndroid = Platform.OS === 'android';

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [iapInitialized, setIapInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  // const [subscriptionIds, setSubscriptionIds] = useState('');
  const [data, setData] = useState([]);
  const colorTheme = useTheme();

  // const subscriptionIds = ['tier_1_plan', 'tier_2_plan', 'tier_3_plan'];

  useEffect(() => {
    initializeIAP();
  }, []);

  const initializeIAP = async () => {
    try {
      const connection = await initConnection();
      if (connection) {
        setIapInitialized(true);
        if (isAndroid) {
          await flushFailedPurchasesCachedAsPendingAndroid();
        }
      } else {
        console.warn('IAP connection failed');
      }
    } catch (err) {
      console.error('Error initializing IAP:', err);
      setError(err);
    }
  };

  useEffect(() => {
    if (iapInitialized) {
      getSubscriptionData();
    }
  }, [iapInitialized]);

  useEffect(() => {
    const updatedArray = subscriptionData.map((item, index) => {
      const firstDataItem = subscriptions[index - 1];
      if (firstDataItem) {
        return {
          ...item,
          // name: firstDataItem?.title,
          price: firstDataItem?.price,
          unit: firstDataItem?.currency,
          sku: firstDataItem?.sku,
        };
      }
      return item;
    });

    setData(updatedArray);
  }, [subscriptionData, subscriptions]);

  // ================================= Api =============================== //

  const getSubscriptionData = async (message, messageValue) => {
    try {
      setVisible(true);
      const url = `${Api.subscription}`;

      const response = await apiGet(url);
      if (response) {
        setSubscriptionData(response?.data);
        getSubscriptionInfo(response?.productIds);
      }
    } catch (error) {
      console.log('error in getpdf api', error);
    } finally {
      setVisible(false);
    }
  };

  // ====================== react native in-app-purchase function ====================== //

  const getSubscriptionInfo = async subscriptionIds => {
    try {
      const subscriptions = await getSubscriptions({skus: subscriptionIds});
      const subscriptionData = [];
      subscriptions.map((sub, index) => {
        let price = '';
        let currency = '';
        let title = sub.title;
        sub?.subscriptionOfferDetails.forEach(item => {
          const pricingPhaseList = item.pricingPhases?.pricingPhaseList;
          price = pricingPhaseList[0]?.formattedPrice;
          currency = pricingPhaseList[0]?.priceCurrencyCode;
        });
        subscriptionData?.push({
          price: price,
          currency: currency,
          title: title,
          sku: sub,
        });
      });
      setSubscriptions(subscriptionData);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setError(error);
    }
  };

  const onSubscription = async sku => {
    try {
      const offerToken = isAndroid
        ? sku?.subscriptionOfferDetails[0]?.offerToken
        : null;

      const purchaseData = await requestSubscription({
        sku: sku?.productId,
        ...(offerToken && {
          subscriptionOffers: [{sku: sku?.productId, offerToken}],
        }),
      });
      console.log('purchaseData', purchaseData);
      setPopupTitle('Success');
      setPopupMessage(
        `Subscription Successful', You subscribed to ${sku?.title}`,
      );
      setPopupVisible(true);
    } catch (error) {
      console.error('Subscription Error:', error);
      setPopupTitle('Error');
      setPopupMessage(`Subscription Cancelled`);
      setPopupVisible(true);
    }
  };

  // ======================================== End ======================================= //

  const closePopup = () => {
    setPopupVisible(false);
  };

  const renderHeader = useCallback(() => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={strings.subscription}
        titleStyle={styles.title}
        containerStyle={styles.headerStyle}
      />
    );
  }, []);

  const SubscriptionItem = memo(({item, colorTheme}) => {
    return (
      <Pressable
        style={[
          styles.subscriptionView,
          // {backgroundColor: colorTheme.subscriptionView},
        ]}
        onPress={() => {
          if (item?.name !== 'FREE') {
            onSubscription(item?.sku);
          }
        }}>
        <View
          style={
            item?.name == 'FREE'
              ? styles.freeContainer
              : styles.subscriptionContainer
          }>
          <View style={styles.subscriptionInfo}>
            <Image
              source={{uri: item?.icon}}
              style={styles.subscriptionImage}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.subscriptionName,
                {color: colorTheme.textColor},
                item?.name == 'FREE' && styles.freeName,
              ]}>
              {item?.name}
            </Text>
          </View>
          <View style={styles.subscriptionPriceContainer}>
            <Text style={styles.subscriptionPrice}>{item?.price}</Text>
          </View>
        </View>
        <View style={styles.bottomView}>
          {item?.points && item?.points[0] && (
            <View style={styles.creditView}>
              <Entypo
                name="dot-single"
                size={scale(20)}
                color={colorTheme.textColor}
              />
              <Text style={[styles.credit, {color: colorTheme.textColor}]}>
                {item?.points[0]}
              </Text>
            </View>
          )}
          {item?.points && item?.points[1] && (
            <View style={styles.creditView}>
              <Entypo
                name="dot-single"
                size={scale(20)}
                color={colorTheme.textColor}
              />
              <Text style={[styles.credit, {color: colorTheme.textColor}]}>
                {item?.points[1]}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  });

  const renderSubscription = useCallback(({item}) => {
    return <SubscriptionItem item={item} colorTheme={colorTheme} />;
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: colorTheme.background}]}>
      <Loader visible={visible} />
      <LinearGradient colors={colorTheme.gradientTheme} style={styles.gradient}>
        {renderHeader()}
        <View style={styles.contentContainer}>
          <Image
            source={require('../Assets/Img/threeStar.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.description}>{strings.subscriptionNote}</Text>
        </View>
      </LinearGradient>

      <FlatList
        data={data}
        renderItem={renderSubscription}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <CustomeAlert
        isVisible={isPopupVisible}
        title={popupTitle}
        message={popupMessage}
        onConfirm={closePopup}
      />
    </View>
  );
};

export default React.memo(SubscriptionScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {},
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
    borderWidth: scale(2),
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
  freeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: verticalScale(35),
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
    fontSize: scale(16),
    fontFamily: Font.semiBold,
    color: Color.Black,
    textTransform: 'uppercase',
    paddingLeft: scale(10),
    width: scale(180),
  },
  subscriptionPriceContainer: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(10),
    backgroundColor: Color.theme1,
    marginRight: scale(10),
  },
  subscriptionPrice: {
    fontSize: scale(13),
    fontFamily: Font.regular,
    color: Color.White,
  },
  bottomView: {
    marginTop: verticalScale(5),
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
    fontFamily: Font.medium,
    color: Color.Black,
    marginTop: verticalScale(-5),
  },
  freeSubscription: {
    marginHorizontal: scale(15),
    paddingVertical: scale(5),
    marginTop: verticalScale(10),
  },
  freeName: {marginLeft: scale(-40)},
});
