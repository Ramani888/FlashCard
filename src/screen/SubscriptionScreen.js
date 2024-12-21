import React, {useEffect, useState} from 'react';
import {Platform, Text, View, StyleSheet, Alert} from 'react-native';
import {
  initConnection,
  flushFailedPurchasesCachedAsPendingAndroid,
  getSubscriptions,
  getProducts,
  requestSubscription,
} from 'react-native-iap';
import Color from '../component/Color';
import {verticalScale} from 'react-native-size-matters';

const isAndroid = Platform.OS === 'android';

const SubscriptionScreen = () => {
  const [iapInitialized, setIapInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [products, setProducts] = useState([]);

  const subscriptionIds = ['tier_1_plan', 'tier_2_plan', 'tier_3_plan']; // Subscription IDs
  const productIds = ['tier_1_plan', 'tier_2_plan', 'tier_3_plan']; // In-app purchase IDs

  useEffect(() => {
    initializeIAP();
  }, []);

  useEffect(() => {
    if (iapInitialized) {
      getSubscriptionInfo();
    }
  }, [iapInitialized]);

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

  const getSubscriptionInfo = async () => {
    try {
      const subscriptions = await getSubscriptions({skus: subscriptionIds});
      subscriptions.map((sub, index) => {
        let price = '';
        let currency = '';
        let title = sub.title;
        sub?.subscriptionOfferDetails.forEach(item => {
          const pricingPhaseList = item.pricingPhases?.pricingPhaseList;
          price = pricingPhaseList[0]?.formattedPrice;
          currency = pricingPhaseList[0]?.priceCurrencyCode;
        });
        console.log('price', price);
        console.log('currency', currency);
        console.log('title', title);
      });
      setSubscriptions(subscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setError(error);
    }
  };

  const handleSubscriptionPurchase = async (productId, subscriptionOffer) => {
    console.log('productId',productId)
    // console.log('subscriptionOffer',subscriptionOffer[0]?.basePlanId)
    // console.log('subscriptionOffer',subscriptionOffer[0]?.offerToken)
    try {
      const purchase = await requestSubscription({
        sku: productId,
        subscriptionOffers: [
          {
            basePlanId: subscriptionOffer[0]?.basePlanId,
            offerIdToken: subscriptionOffer,
          },
        ],
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });

      if (purchase) {
        Alert.alert(
          'Purchase Successful',
          `You have subscribed to ${productId}`,
        );
        console.log('Purchase Details:', purchase);

        if (isAndroid) {
          await finishTransaction(purchase);
        }
      }
    } catch (err) {
      console.error('Error purchasing subscription:', err);
      Alert.alert('Purchase Failed', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IAP is initialized</Text>
      <Text style={styles.subtitle}>Subscriptions:</Text>
      {subscriptions.length > 0 ? (
        subscriptions.map((sub, index) => {
          console.log('sub', sub?.subscriptionOfferDetails);
          let price = '';
          let currency = '';
          sub?.subscriptionOfferDetails.forEach(item => {
            const pricingPhaseList = item.pricingPhases?.pricingPhaseList;
            console.log(pricingPhaseList);
            price = pricingPhaseList[0]?.formattedPrice;
            currency = pricingPhaseList[0]?.priceCurrencyCode;
          });
          return (
            <Text
              key={index}
              style={styles.item}
              onPress={() =>
                handleSubscriptionPurchase(
                  sub?.productId,
                  sub?.subscriptionOfferDetails,
                )
              }>
              {sub.title} - {price} {currency}
            </Text>
          );
        })
      ) : (
        <Text>No subscriptions found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Color.Black,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: Color.Black,
  },
  item: {
    fontSize: 14,
    marginBottom: 4,
    color: Color.Black,
    marginBottom: verticalScale(15),
  },
});

export default SubscriptionScreen;

// import {
//   FlatList,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import React, {useCallback, memo, useEffect, useState} from 'react';
// import LinearGradient from 'react-native-linear-gradient';
// import Color from '../component/Color';
// import {useNavigation} from '@react-navigation/native';
// import CustomeHeader from '../custome/CustomeHeader';
// import {scale, verticalScale} from '../custome/Responsive';
// import Font from '../component/Font';
// import Entypo from 'react-native-vector-icons/Entypo';
// import {apiGet} from '../Api/ApiService';
// import Api from '../Api/EndPoint';
// import Loader from '../component/Loader';
// import useTheme from '../component/Theme';
// import strings from '../language/strings';

// const SubscriptionItem = memo(({item, colorTheme}) => {
//   console.log('item', item);
//   return (
//     <View
//       style={[
//         styles.subscriptionView,
//         // {backgroundColor: colorTheme.subscriptionView},
//       ]}>
//       <View style={styles.subscriptionContainer}>
//         <View style={styles.subscriptionInfo}>
//           <Image
//             source={{uri: item?.icon}}
//             style={styles.subscriptionImage}
//             resizeMode="contain"
//           />
//           <Text
//             style={[
//               styles.subscriptionName,
//               {color: colorTheme.textColor},
//               item?.name == 'FREE' && styles.freeName,
//             ]}>
//             {item?.name}
//           </Text>
//         </View>
//         <View style={styles.subscriptionPriceContainer}>
//           <Text style={styles.subscriptionPrice}>${item?.price}</Text>
//         </View>
//       </View>
//       <View style={styles.bottomView}>
//         {item?.points && item?.points[0] && (
//           <View style={styles.creditView}>
//             <Entypo
//               name="dot-single"
//               size={scale(20)}
//               color={colorTheme.textColor}
//             />
//             <Text style={[styles.credit, {color: colorTheme.textColor}]}>
//               {item?.points[0]}
//             </Text>
//           </View>
//         )}
//         {item?.points && item?.points[1] && (
//           <View style={styles.creditView}>
//             <Entypo
//               name="dot-single"
//               size={scale(20)}
//               color={colorTheme.textColor}
//             />
//             <Text style={[styles.credit, {color: colorTheme.textColor}]}>
//               {item?.points[1]}
//             </Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// });

// const SubscriptionScreen = () => {
//   const navigation = useNavigation();
//   const [visible, setVisible] = useState(false);
//   const [subscriptionData, setSubscriptionData] = useState([]);
//   const colorTheme = useTheme();

//   useEffect(() => {
//     getSubscriptionData();
//   }, []);

//   // ================================= Api =============================== //

//   const getSubscriptionData = async (message, messageValue) => {
//     try {
//       setVisible(true);
//       const url = `${Api.subscription}`;

//       const response = await apiGet(url);
//       if (response) {
//         setSubscriptionData(response);
//       }
//     } catch (error) {
//       console.log('error in getpdf api', error);
//     } finally {
//       setVisible(false);
//     }
//   };

//   // ================================= End =============================== //

//   const renderHeader = useCallback(() => {
//     return (
//       <CustomeHeader
//         headerBackgroundColor={Color.transparent}
//         goBack={true}
//         title={strings.subscription}
//         titleStyle={styles.title}
//         containerStyle={styles.headerStyle}
//       />
//     );
//   }, []);

//   const renderSubscription = useCallback(({item}) => {
//     return <SubscriptionItem item={item} colorTheme={colorTheme} />;
//   }, []);

//   return (
//     <View style={[styles.container, {backgroundColor: colorTheme.background}]}>
//       <Loader visible={visible} />
//       <LinearGradient colors={colorTheme.gradientTheme} style={styles.gradient}>
//         {renderHeader()}
//         <View style={styles.contentContainer}>
//           <Image
//             source={require('../Assets/Img/threeStar.png')}
//             style={styles.image}
//             resizeMode="contain"
//           />
//           <Text style={styles.description}>{strings.subscriptionNote}</Text>
//         </View>
//       </LinearGradient>

//       <FlatList
//         data={subscriptionData}
//         renderItem={renderSubscription}
//         keyExtractor={item => item.id}
//         style={styles.list}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// export default React.memo(SubscriptionScreen);

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   gradient: {},
//   headerStyle: {
//     backgroundColor: Color.transparent,
//     height: verticalScale(90),
//     alignItems: 'flex-end',
//   },
//   title: {
//     fontSize: scale(20),
//     fontFamily: Font.medium,
//   },
//   contentContainer: {
//     alignItems: 'center',
//   },
//   image: {
//     height: scale(70),
//     width: scale(300),
//     marginVertical: verticalScale(-10),
//     marginBottom: verticalScale(0),
//   },
//   description: {
//     fontSize: scale(11),
//     fontFamily: Font.regular,
//     color: Color.White,
//     lineHeight: verticalScale(17),
//     width: scale(328),
//     textAlign: 'center',
//     paddingBottom: verticalScale(25),
//   },
//   list: {
//     margin: scale(15),
//     marginTop: verticalScale(15),
//   },
//   subscriptionView: {
//     backgroundColor: '#146D8B33',
//     borderWidth: scale(1),
//     paddingVertical: scale(5),
//     borderRadius: scale(14),
//     marginBottom: verticalScale(10),
//     borderColor: Color.theme1,
//   },
//   subscriptionContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   subscriptionInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   subscriptionImage: {
//     width: scale(40),
//     height: verticalScale(40),
//     marginLeft: scale(8),
//     marginTop: verticalScale(5),
//   },
//   subscriptionName: {
//     fontSize: scale(18),
//     fontFamily: Font.medium,
//     color: Color.Black,
//     textTransform: 'capitalize',
//     paddingLeft: scale(10),
//   },
//   subscriptionPriceContainer: {
//     width: scale(50),
//     height: verticalScale(28),
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: scale(10),
//     backgroundColor: Color.theme1,
//     marginRight: scale(10),
//   },
//   subscriptionPrice: {
//     fontSize: scale(15),
//     fontFamily: Font.regular,
//     color: Color.White,
//   },
//   bottomView: {
//     marginTop: verticalScale(10),
//     gap: verticalScale(5),
//   },
//   creditView: {
//     flexDirection: 'row',
//     gap: scale(5),
//     alignItems: 'center',
//     marginLeft: scale(15),
//   },
//   credit: {
//     fontSize: scale(15),
//     fontFamily: Font.regular,
//     color: Color.Black,
//   },
//   freeSubscription: {
//     marginHorizontal: scale(15),
//     paddingVertical: scale(5),
//     marginTop: verticalScale(10),
//   },
//   freeName: {marginLeft: scale(-40)},
// });
