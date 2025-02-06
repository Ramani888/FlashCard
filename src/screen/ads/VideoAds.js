// import React, {
//   useEffect,
//   useState,
//   useImperativeHandle,
//   forwardRef,
// } from 'react';
// import {View, Alert, StatusBar, StyleSheet} from 'react-native';
// import {
//   RewardedAd,
//   RewardedAdEventType,
//   AdEventType,
//   TestIds,
// } from 'react-native-google-mobile-ads';
// import Color from '../../component/Color';

// const adUnitId = __DEV__
//   ? TestIds.REWARDED
//   : 'ca-app-pub-9823475062473479/5214348018';

// const VideoAds = forwardRef(({updateCredit, setLoading, loading}, ref) => {
//   const [rewardedAd, setRewardedAd] = useState(null);
//   const [loaded, setLoaded] = useState(false);
//   const [reward, setReward] = useState('');
//   //   const [retryCount, setRetryCount] = useState(0);
//   const [adError, setAdError] = useState(null);

//   useEffect(() => {
//     if (reward) {
//       updateCredit(3, 'credited');
//     }
//   }, [reward, updateCredit]);

//   useEffect(() => {
//     const ad = RewardedAd.createForAdRequest(adUnitId, {
//       requestNonPersonalizedAdsOnly: true,
//     });

//     const unsubscribeLoaded = ad.addAdEventListener(
//       RewardedAdEventType.LOADED,
//       () => {
//         console.log('Ad Loaded');
//         setLoaded(true);
//         setLoading(false);
//         // setRetryCount(0); // Reset retry count on successful load
//         setAdError(null); // Clear any previous errors
//       },
//     );

//     const unsubscribeEarned = ad.addAdEventListener(
//       RewardedAdEventType.EARNED_REWARD,
//       reward => {
//         setReward(reward);
//       },
//     );

//     const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, error => {
//       console.error('Ad Error:', error);
//       setLoaded(false);
//       setLoading(false);
//       setAdError(error);

//       // Retry logic for loading the ad
//       //   if (retryCount < 5) {
//       //     setRetryCount(prev => prev + 1);
//       //     setLoading(true);
//       //     ad.load();
//       //   } else {
//       //     Alert.alert(
//       //       'Ad Load Failed',
//       //       'There was an issue loading the ad. Please try again later.',
//       //       [{text: 'OK'}],
//       //     );
//       //   }
//     });

//     setRewardedAd(ad);
//     ad?.load();

//     return () => {
//       unsubscribeLoaded();
//       unsubscribeEarned();
//       unsubscribeError();
//     };
//   }, [loading, setLoading]);

//   const showAd = () => {
//     setLoading(true);

//     if (rewardedAd && loaded) {
//       rewardedAd?.show();
//       setLoading(false);
//       setLoaded(false);
//       rewardedAd?.load();
//     } else {
//       // Retry logic if ad is not loaded yet
//     }
//   };

//   useImperativeHandle(ref, () => ({
//     showAd,
//   }));

//   return (
//     <View style={styles.container}>
//       <StatusBar translucent backgroundColor={Color.transparent} />
//     </View>
//   );
// });

// export default VideoAds;

// const styles = StyleSheet.create({
//   container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
// });

import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import {View, Alert, StatusBar, StyleSheet} from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import Color from '../../component/Color';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-9823475062473479/5214348018';

const VideoAds = forwardRef(({updateCredit, setLoading}, ref) => {
  const [rewardedAd, setRewardedAd] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [reward, setReward] = useState(null);
  const [adError, setAdError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (reward) {
      updateCredit(3, 'credited');
      setReward(null);
    }
  }, [reward, updateCredit]);

  const loadAd = useCallback(
    initial => {
      setLoading(true);
      setAdError(null);

      const ad = RewardedAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      const unsubscribeLoaded = ad.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          console.log('Ad Loaded');
          initial === false && rewardedAd.show();
          setLoaded(true);
          setLoading(false);
          setRetryCount(0); // Reset retry count on success
        },
      );

      const unsubscribeEarned = ad.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        reward => {
          setReward(reward);
        },
      );

      const unsubscribeError = ad.addAdEventListener(
        AdEventType.ERROR,
        error => {
          console.error('Ad Error:', error);
          setLoaded(false);
          setLoading(false);
          setAdError(error);

          // Retry logic (up to 3 times)
          //   if (retryCount < 3) {
          //     setRetryCount(prev => prev + 1);
          //     setTimeout(() => loadAd(), 2000); // Retry after 2 seconds
          //   } else {
          //     Alert.alert(
          //       'Ad Load Failed',
          //       'There was an issue loading the ad. Please try again later.',
          //       [{text: 'OK'}],
          //     );
          //   }
        },
      );

      setRewardedAd(ad);
      ad.load();

      return () => {
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeError();
      };
    },
    [setLoading],
  );

  useEffect(() => {
    loadAd(true);
  }, [loadAd]);

  const showAd = useCallback(() => {
    // loadAd(false);
    if (rewardedAd && loaded) {
      rewardedAd.show();
      setLoaded(false);
    } else {
      loadAd(false);
    }
  }, [rewardedAd, loaded, loadAd]);

  useImperativeHandle(ref, () => ({
    showAd,
  }));

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={Color.transparent} />
    </View>
  );
});

export default VideoAds;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

// import React, {
//   useEffect,
//   useState,
//   useImperativeHandle,
//   forwardRef,
// } from 'react';
// import {View, Alert, StatusBar, StyleSheet} from 'react-native';
// import {
//   RewardedAd,
//   RewardedAdEventType,
//   AdEventType,
//   TestIds,
// } from 'react-native-google-mobile-ads';
// import Color from '../../component/Color';

// const adUnitId = __DEV__
//   ? TestIds.REWARDED
//   : 'ca-app-pub-9823475062473479/5214348018';

// const VideoAds = forwardRef(({updateCredit, setLoading}, ref) => {
//   const [rewardedAd, setRewardedAd] = useState(null);
//   const [loaded, setLoaded] = useState(false);
//   const [retryCount, setRetryCount] = useState(0);

//   useEffect(() => {
//     const ad = RewardedAd.createForAdRequest(adUnitId, {
//       requestNonPersonalizedAdsOnly: true,
//     });

//     const onAdLoaded = () => {
//       console.log('Ad Loaded');
//       setLoaded(true);
//       setLoading(false);
//       setRetryCount(0);
//     };

//     const onAdEarnedReward = reward => {
//       if (reward?.amount) {
//         updateCredit(reward.amount, 'credited');
//       }
//     };

//     const onAdError = error => {
//       console.error('Ad Error:', error);
//       setLoaded(false);
//       setLoading(false);

//       if (retryCount < 5) {
//         setRetryCount(prev => prev + 1);
//         setTimeout(() => ad.load(), 2000);
//       } else {
//         Alert.alert(
//           'Ad Load Failed',
//           'There was an issue loading the ad. Please try again later.',
//           [{text: 'OK'}],
//         );
//       }
//     };

//     // ad.addAdEventListener(RewardedAdEventType.LOADED, onAdLoaded);
//     // ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, onAdEarnedReward);
//     // ad.addAdEventListener(AdEventType.ERROR, onAdError);

//     setRewardedAd(ad);
//     ad.load();

//     return () => {
//       ad.removeAllListeners();
//     };
//   }, [retryCount, setLoading, updateCredit]);

//   const showAd = () => {
//     if (rewardedAd && loaded) {
//       setLoading(true);
//       rewardedAd
//         .show()
//         .catch(error => {
//           console.error('Error showing ad:', error);
//           Alert.alert('Error', 'Ads not loaded. Please try again.');
//         })
//         .finally(() => {
//           setLoading(false);
//           setLoaded(false);
//           rewardedAd.load();
//         });
//     }
//   };

//   useImperativeHandle(ref, () => ({
//     showAd,
//   }));

//   return (
//     <View style={styles.container}>
//       <StatusBar translucent backgroundColor={Color.transparent} />
//     </View>
//   );
// });

// export default VideoAds;

// const styles = StyleSheet.create({
//   container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
// });
