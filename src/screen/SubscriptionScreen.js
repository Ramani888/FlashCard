import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  Linking,
} from 'react-native';
import React, {useCallback, memo, useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Color from '../component/Color';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import CustomeHeader from '../custome/CustomeHeader';
import {scale, verticalScale} from '../custome/Responsive';
import Font from '../component/Font';
import Entypo from 'react-native-vector-icons/Entypo';
import {apiGet, apiPut} from '../Api/ApiService';
import Api from '../Api/EndPoint';
import Loader from '../component/Loader';
import useTheme from '../component/Theme';
import strings from '../language/strings';
import {
  initConnection,
  flushFailedPurchasesCachedAsPendingAndroid,
  getSubscriptions,
  requestSubscription,
  getAvailablePurchases
} from 'react-native-iap';
import CustomeAlert from '../custome/CustomeAlert';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isAndroid = Platform.OS === 'android';

const SubscriptionScreen = () => {
  const route = useRoute();
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [iapInitialized, setIapInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [data, setData] = useState([]);
  const [subscribedId, setSubscribedId] = useState({});
  const [activeSubscription, setActiveSubscription] = useState([]);
  const [changePlan, setChangePlan] = useState(false);
  const colorTheme = useTheme();
  const {id} = route.params;
  // console.log('id',id)

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
    if (isFocused) {
      initializeIAP();
      getCurrentPurchases();
      previousProductId();
    }
  }, [isFocused, changePlan]);

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

  const updateSubscription = async (startDate, endDate, productId, tierId) => {
    const rawData = {
      _id: id,
      productId: productId,
      userId: global?.user?._id,
      tierId: tierId,
      startDate: startDate,
      endDate: endDate,
    };
    setVisible(true);
    try {
      const response = await apiPut(
        Api.updateSubscription,
        '',
        JSON.stringify(rawData),
      );
      AsyncStorage.setItem('productId', tierId);
      setChangePlan(true);
    } catch (error) {
      console.log('error in edit Set api', error);
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

  // const onSubscription = async (sku, tierId) => {
  //   try {
  //     const offerToken = isAndroid
  //       ? sku?.subscriptionOfferDetails[0]?.offerToken
  //       : null;

  //     const purchaseData = await requestSubscription({
  //       sku: sku?.productId,
  //       ...(offerToken && {
  //         subscriptionOffers: [{sku: sku?.productId, offerToken}],
  //       }),
  //     });
  //     const currentDate = new Date();
  //     const startDate = moment(currentDate).format('YYYY-MM-DD');
  //     const endDate = moment(currentDate).add(1, 'month').format('YYYY-MM-DD');
  //     const productId = purchaseData[0]?.productId;
  //     updateSubscription(startDate, endDate, productId, tierId);

  //     setPopupTitle('Success');
  //     setPopupMessage(
  //       `Subscription Successful', You subscribed to ${sku?.title}`,
  //     );
  //     setPopupVisible(true);
  //   } catch (error) {
  //     console.error('Subscription Error:', error);
  //     setPopupTitle('Error');
  //     setPopupMessage(`Subscription Cancelled`);
  //     setPopupVisible(true);
  //   }
  // };

  const onUpgradeSubscription = async (currentSku, newSku, tierId) => {
    try {
      const isUpgrade = !!currentSku;

      const offerToken = isAndroid
        ? newSku?.subscriptionOfferDetails[0]?.offerToken
        : null;

      const purchaseData = await requestSubscription({
        sku: newSku?.productId,
        ...(isAndroid &&
          isUpgrade && {
            replaceSkusProration: {
              skusToReplace: [currentSku],
            },
          }),
        ...(offerToken && {
          subscriptionOffers: [{sku: newSku?.productId, offerToken}],
        }),
      });

      const currentDate = new Date();
      const startDate = moment(currentDate).format('YYYY-MM-DD');
      const endDate = moment(currentDate).add(1, 'month').format('YYYY-MM-DD');
      const productId = purchaseData[0]?.productId;

      updateSubscription(startDate, endDate, productId, tierId);

      setPopupTitle('Success');
      setPopupMessage(`Upgrade Successful! You upgraded to ${newSku?.title}.`);
      setPopupVisible(true);
    } catch (error) {
      console.error('Upgrade Subscription Error:', error);
      setPopupTitle('Error');
      setPopupMessage('Upgrade Cancelled');
      setPopupVisible(true);
    }
  };

  const getCurrentPurchases = async () => {
    try {
      const purchases = await getAvailablePurchases();
      setActiveSubscription(purchases);
    } catch (error) {
      console.log('Error getting purchases:', error);
    }
  };

  // ======================================== End ======================================= //

  const previousProductId = async () => {
    const productId = await AsyncStorage.getItem('productId');
    setSubscribedId(productId);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const openContactBottomSheets = () => {
    refSubscriptionRBSheet.current.open();
  };

  const closeContactBottomSheet = () => {
    refSubscriptionRBSheet.current.close();
  };

  const openPopupForCancelSubscription = () => {
    Linking.openURL(
      'https://play.google.com/store/account/subscriptions?package=com.flashcard.app&sku=tier_3_plan',
    );
  };

  const renderHeader = useCallback(() => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={strings.subscription}
        titleStyle={styles.title}
        containerStyle={styles.headerStyle}
        cancel={true}
        // onCancel={openContactBottomSheets}
      />
    );
  }, []);

  const SubscriptionItem = memo(({item, colorTheme}) => {
    const selectedPlan = item?._id === subscribedId;

    return (
      <Pressable
        style={[
          styles.subscriptionView,
          // {backgroundColor: colorTheme.subscriptionView},
        ]}
        onPress={() => {
          if (item?.name !== 'FREE') {
            if (activeSubscription?.length > 0) {
              onUpgradeSubscription(
                activeSubscription[0]?.productId,
                item?.sku,
                item?._id,
              );
            } else {
              onUpgradeSubscription('', item?.sku, item?._id);
            }
          }
        }}>
        <View style={styles.subscriptionContainer}>
          <View style={styles.subscriptionInfo}>
            <Image
              source={{uri: item?.icon}}
              style={styles.subscriptionImage}
              resizeMode="contain"
            />
            <Text
              style={[styles.subscriptionName, {color: colorTheme.textColor}]}>
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
          {selectedPlan && (
            <Image
              source={require('../Assets/Img/selected.jpg')}
              style={styles.selectedPlan}
            />
          )}
        </View>
      </Pressable>
    );
  });

  const renderSubscription = useCallback(
    ({item}) => {
      return <SubscriptionItem item={item} colorTheme={colorTheme} />;
    },
    [data],
  );

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
  selectedPlan: {
    width: scale(25),
    height: scale(25),
    position: 'absolute',
    right: scale(11),
  },
  bottomSheetContainer: {
    alignItems: 'center',
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
  },
  sheetContainer: {
    flexDirection: 'row',
    gap: scale(50),
    marginVertical: verticalScale(15),
  },
});

// import {
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   View,
//   Platform,
//   Pressable,
//   Linking,
//   Dimensions,
// } from 'react-native';
// import React, {memo, useCallback, useEffect, useState} from 'react';
// import LinearGradient from 'react-native-linear-gradient';
// import Color from '../component/Color';
// import {useIsFocused, useRoute} from '@react-navigation/native';
// import CustomeHeader from '../custome/CustomeHeader';
// import {scale, verticalScale} from '../custome/Responsive';
// import Font from '../component/Font';
// import Entypo from 'react-native-vector-icons/Entypo';
// import {apiGet, apiPut} from '../Api/ApiService';
// import Api from '../Api/EndPoint';
// import Loader from '../component/Loader';
// import useTheme from '../component/Theme';
// import strings from '../language/strings';
// import {
//   initConnection,
//   flushFailedPurchasesCachedAsPendingAndroid,
//   getSubscriptions,
//   requestSubscription,
//   getAvailablePurchases,
// } from 'react-native-iap';
// import CustomeAlert from '../custome/CustomeAlert';
// import moment from 'moment';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CustomeButton from '../custome/CustomeButton';

// const isAndroid = Platform.OS === 'android';
// const height = Dimensions.get('window'.height)

// const SubscriptionScreen = () => {
//   const route = useRoute();
//   const isFocused = useIsFocused();
//   const [visible, setVisible] = useState(false);
//   const [subscriptionData, setSubscriptionData] = useState([]);
//   const [iapInitialized, setIapInitialized] = useState(false);
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [isPopupVisible, setPopupVisible] = useState(false);
//   const [popupTitle, setPopupTitle] = useState('');
//   const [popupMessage, setPopupMessage] = useState('');
//   const [data, setData] = useState([]);
//   const [subscribedId, setSubscribedId] = useState({});
//   const [activeSubscription, setActiveSubscription] = useState([]);
//   const [changePlan, setChangePlan] = useState(false);
//   const colorTheme = useTheme();
//   const refSubscriptionRBSheet = useRef();
//   const {id} = route.params;

//   useEffect(() => {
//     initializeIAP();
//   }, [isFocused]);

//   useEffect(() => {
//     if (isFocused) {
//       initializeIAP();
//       getCurrentPurchases();
//       previousProductId();
//     }
//   }, [isFocused, changePlan]);

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

//   useEffect(() => {
//     if (iapInitialized) {
//       getSubscriptionData();
//     }
//   }, [iapInitialized]);

//   useEffect(() => {
//     const updatedArray = subscriptionData.map((item, index) => {
//       const firstDataItem = subscriptions[index - 1];
//       if (firstDataItem) {
//         return {
//           ...item,
//           price: firstDataItem?.price,
//           unit: firstDataItem?.currency,
//           sku: firstDataItem?.sku,
//         };
//       }
//       return item;
//     });

//     setData(updatedArray);
//   }, [subscriptionData, subscriptions]);

//   // ================================= Api =============================== //

//   const getSubscriptionData = async (message, messageValue) => {
//     try {
//       setVisible(true);
//       const url = `${Api.subscription}`;

//       const response = await apiGet(url);
//       if (response) {
//         setSubscriptionData(response?.data);
//         getSubscriptionInfo(response?.productIds);
//       }
//     } catch (error) {
//       console.log('error in getpdf api', error);
//     } finally {
//       setVisible(false);
//     }
//   };

//   const updateSubscription = async (startDate, endDate, productId, tierId) => {
//     const rawData = {
//       _id: id,
//       productId: productId,
//       userId: global?.user?._id,
//       tierId: tierId,
//       startDate: startDate,
//       endDate: endDate,
//     };
//     setVisible(true);
//     try {
//       const response = await apiPut(
//         Api.updateSubscription,
//         '',
//         JSON.stringify(rawData),
//       );
//       AsyncStorage.setItem('productId', tierId);
//       setChangePlan(true);
//       getProfileData();
//     } catch (error) {
//       console.log('error in edit Set api', error);
//     } finally {
//       setVisible(false);
//     }
//   };

//   // ====================== react native in-app-purchase function ====================== //

//   const getSubscriptionInfo = async subscriptionIds => {
//     try {
//       const subscriptions = await getSubscriptions({skus: subscriptionIds});
//       const subscriptionData = [];
//       subscriptions.map((sub, index) => {
//         let price = '';
//         let currency = '';
//         let title = sub.title;
//         sub?.subscriptionOfferDetails.forEach(item => {
//           const pricingPhaseList = item.pricingPhases?.pricingPhaseList;
//           price = pricingPhaseList[0]?.formattedPrice;
//           currency = pricingPhaseList[0]?.priceCurrencyCode;
//         });
//         subscriptionData?.push({
//           price: price,
//           currency: currency,
//           title: title,
//           sku: sub,
//         });
//       });
//       setSubscriptions(subscriptionData);
//     } catch (error) {
//       console.error('Error fetching subscriptions:', error);
//       setError(error);
//     }
//   };

//   // const onSubscription = async (sku, tierId) => {
//   //   try {
//   //     const offerToken = isAndroid
//   //       ? sku?.subscriptionOfferDetails[0]?.offerToken
//   //       : null;

//   //     const purchaseData = await requestSubscription({
//   //       sku: sku?.productId,
//   //       ...(offerToken && {
//   //         subscriptionOffers: [{sku: sku?.productId, offerToken}],
//   //       }),
//   //     });
//   //     const currentDate = new Date();
//   //     const startDate = moment(currentDate).format('YYYY-MM-DD');
//   //     const endDate = moment(currentDate).add(1, 'month').format('YYYY-MM-DD');
//   //     const productId = purchaseData[0]?.productId;
//   //     updateSubscription(startDate, endDate, productId, tierId);

//   //     setPopupTitle('Success');
//   //     setPopupMessage(
//   //       Subscription Successful', You subscribed to ${sku?.title},
//   //     );
//   //     setPopupVisible(true);
//   //   } catch (error) {
//   //     console.error('Subscription Error:', error);
//   //     setPopupTitle('Error');
//   //     setPopupMessage(Subscription Cancelled);
//   //     setPopupVisible(true);
//   //   }
//   // };

//   const onUpgradeSubscription = async (currentSku, newSku, tierId) => {
//     try {
//       const isUpgrade = !!currentSku;

//       const offerToken = isAndroid
//         ? newSku?.subscriptionOfferDetails[0]?.offerToken
//         : null;

//       const purchaseData = await requestSubscription({
//         sku: newSku?.productId,
//         ...(isAndroid &&
//           isUpgrade && {
//             replaceSkusProration: {
//               skusToReplace: [currentSku],
//             },
//           }),
//         ...(offerToken && {
//           subscriptionOffers: [{sku: newSku?.productId, offerToken}],
//         }),
//       });

//       const currentDate = new Date();
//       const startDate = moment(currentDate).format('YYYY-MM-DD');
//       const endDate = moment(currentDate).add(1, 'month').format('YYYY-MM-DD');
//       const productId = purchaseData[0]?.productId;

//       updateSubscription(startDate, endDate, productId, tierId);

//       setPopupTitle('Success');
//       setPopupMessage(`Upgrade Successful! You upgraded to ${newSku?.title}.`);
//       setPopupVisible(true);
//     } catch (error) {
//       console.error('Upgrade Subscription Error:', error);
//       setPopupTitle('Error');
//       setPopupMessage('Upgrade Cancelled');
//       setPopupVisible(true);
//     }
//   };

//   const getCurrentPurchases = async () => {
//     try {
//       const purchases = await getAvailablePurchases();
//       setActiveSubscription(purchases);
//     } catch (error) {
//       console.log('Error getting purchases:', error);
//     }
//   };

//   // ======================================== End ======================================= //

//   const previousProductId = async () => {
//     const productId = await AsyncStorage.getItem('productId');
//     setSubscribedId(productId);
//   };

//   const closePopup = () => {
//     setPopupVisible(false);
//   };

//   const openContactBottomSheets = () => {
//     refSubscriptionRBSheet.current.open();
//   };

//   const closeContactBottomSheet = () => {
//     refSubscriptionRBSheet.current.close();
//   };

//   const renderHeader = () => {
//     return (
//       <CustomeHeader
//         headerBackgroundColor={Color.transparent}
//         goBack={true}
//         title={strings.subscription}
//         titleStyle={styles.title}
//         containerStyle={styles.headerStyle}
//         cancel={true}
//         onCancel={openContactBottomSheets}
//       />
//     );
//   };

//   const openPopupForCancelSubscription = () => {
//     Linking.openURL(
//       'https://play.google.com/store/account/subscriptions?package=com.flashcard.app&sku=tier_3_plan',
//     );
//   };

//   const SubscriptionItem = memo(({item, colorTheme}) => {
//     const selectedPlan = item?._id === subscribedId;

//     return (
//       <Pressable
//         style={[
//           styles.subscriptionView,
//           // {backgroundColor: colorTheme.subscriptionView},
//         ]}
//         onPress={() => {
//           if (item?.name !== 'FREE') {
//             if (activeSubscription?.length > 0) {
//               onUpgradeSubscription(
//                 activeSubscription[0]?.productId,
//                 item?.sku,
//                 item?._id,
//               );
//             } else {
//               onUpgradeSubscription('', item?.sku, item?._id);
//             }
//           }
//         }}>
//         <View style={styles.subscriptionContainer}>
//           <View style={styles.subscriptionInfo}>
//             <Image
//               source={{uri: item?.icon}}
//               style={styles.subscriptionImage}
//               resizeMode="contain"
//             />
//             <Text
//               style={[styles.subscriptionName, {color: colorTheme.textColor}]}>
//               {item?.name}
//             </Text>
//           </View>
//           <View style={styles.subscriptionPriceContainer}>
//             <Text style={styles.subscriptionPrice}>{item?.price}</Text>
//           </View>
//         </View>
//         <View style={styles.bottomView}>
//           {item?.points && item?.points[0] && (
//             <View style={styles.creditView}>
//               <Entypo
//                 name="dot-single"
//                 size={scale(20)}
//                 color={colorTheme.textColor}
//               />
//               <Text style={[styles.credit, {color: colorTheme.textColor}]}>
//                 {item?.points[0]}
//               </Text>
//             </View>
//           )}
//           {item?.points && item?.points[1] && (
//             <View style={styles.creditView}>
//               <Entypo
//                 name="dot-single"
//                 size={scale(20)}
//                 color={colorTheme.textColor}
//               />
//               <Text style={[styles.credit, {color: colorTheme.textColor}]}>
//                 {item?.points[1]}
//               </Text>
//             </View>
//           )}
//           {selectedPlan && (
//             <Image
//               source={require('../Assets/Img/selected.jpg')}
//               style={styles.selectedPlan}
//             />
//           )}
//         </View>
//       </Pressable>
//     );
//   });

//   const renderSubscription = useCallback(
//     ({item}) => {
//       return <SubscriptionItem item={item} colorTheme={colorTheme} />;
//     },
//     [data],
//   );

//   // const subscriptionBottomSheets = useCallback(() => {
//   //   return (
//   //     <RBSheet
//   //       ref={refSubscriptionRBSheet}
//   //       height={height * 0.4}
//   //       openDuration={250}
//   //       draggable={true}
//   //       customStyles={{
//   //         container: [
//   //           styles.bottomSheetContainer,
//   //           {backgroundColor: colorTheme.background},
//   //         ],
//   //         draggableIcon: styles.dragableIcon,
//   //       }}>
//   //       <View style={styles.sheetContainer}>
//   //         {/* <SubscriptionBottomsheet /> */}
//   //       </View>
//   //     </RBSheet>
//   //   );
//   // }, []);

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
//         data={data}
//         renderItem={renderSubscription}
//         keyExtractor={item => item.id}
//         style={styles.list}
//         showsVerticalScrollIndicator={false}
//       />

//       {/* {subscriptionBottomSheets()} */}

//       <CustomeButton
//         buttonColor={Color.theme1}
//         buttonWidth="80%"
//         buttonHeight={scale(45)}
//         title={'cancel subscription'}
//         borderRadius={scale(10)}
//         fontSize={scale(15)}
//         fontColor={Color.White}
//         fontFamily={Font.semiBold}
//         marginTop={verticalScale(10)}
//         // position="absolute"
//         bottom={verticalScale(10)}
//         alignSelf={'center'}
//         onPress={openPopupForCancelSubscription}
//       />

//       <CustomeAlert
//         isVisible={isPopupVisible}
//         title={popupTitle}
//         message={popupMessage}
//         onConfirm={closePopup}
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
//     borderWidth: scale(2),
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
//   freeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: verticalScale(35),
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
//     fontSize: scale(16),
//     fontFamily: Font.semiBold,
//     color: Color.Black,
//     textTransform: 'uppercase',
//     paddingLeft: scale(10),
//     width: scale(180),
//   },
//   subscriptionPriceContainer: {
//     paddingHorizontal: scale(10),
//     paddingVertical: verticalScale(4),
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: scale(10),
//     backgroundColor: Color.theme1,
//     marginRight: scale(10),
//   },
//   subscriptionPrice: {
//     fontSize: scale(13),
//     fontFamily: Font.regular,
//     color: Color.White,
//   },
//   bottomView: {
//     marginTop: verticalScale(5),
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
//     fontFamily: Font.medium,
//     color: Color.Black,
//     marginTop: verticalScale(-5),
//   },
//   freeSubscription: {
//     marginHorizontal: scale(15),
//     paddingVertical: scale(5),
//     marginTop: verticalScale(10),
//   },
//   freeName: {marginLeft: scale(-40)},
//   selectedPlan: {
//     width: scale(25),
//     height: scale(25),
//     position: 'absolute',
//     right: scale(11),
//   },
//   bottomSheetContainer: {
//     alignItems: 'center',
//     borderTopLeftRadius: scale(30),
//     borderTopRightRadius: scale(30),
//   },
//   sheetContainer: {
//     flexDirection: 'row',
//     gap: scale(50),
//     marginVertical: verticalScale(15),
//   },
// });
