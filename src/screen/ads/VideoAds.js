import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { View, Alert, ActivityIndicator, Text, StatusBar } from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import strings from '../../language/strings';
import Color from '../../component/Color';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-9823475062473479/5214348018';

const VideoAds = forwardRef(({ updateCredit, setLoading, loading }, ref) => {
  const [rewardedAd, setRewardedAd] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [reward, setReward] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [adError, setAdError] = useState(null);

  useEffect(() => {
    if (reward) {
      updateCredit(3, 'credited');
    }
  }, [reward]);

  useEffect(() => {
    const ad = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribeLoaded = ad.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        console.log('Ad Loaded');
        setLoaded(true);
        setLoading(false);
        setRetryCount(0); // Reset retry count on successful load
        setAdError(null); // Clear any previous errors
      },
    );

    const unsubscribeEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        setReward(reward);
      },
    );

    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, error => {
      console.error('Ad Error:', error);
      setLoaded(false);
      setLoading(false);
      setAdError(error);

      // Retry logic for loading the ad
      if (retryCount < 5) {
        setRetryCount(prev => prev + 1);
        setLoading(true);
        ad.load();
      } else {
        Alert.alert(
          'Ad Load Failed',
          'There was an issue loading the ad. Please try again later.',
          [{ text: 'OK' }],
        );
      }
    });

    setRewardedAd(ad);
    ad?.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeError();
    };
  }, [loading, retryCount]);

  const showAd = () => {
    setLoading(true);

    if (rewardedAd && loaded) {
      try {
        rewardedAd?.show();
        setLoading(false);
        setLoaded(false);
        rewardedAd?.load();
      } catch (error) {
        console.error('Error showing ad:', error);
        setLoading(false);
        setAdError(error);
        Alert.alert('Error', 'Ads not load. Please try again.');
      }
    } else {
      // Retry logic if ad is not loaded yet
      const checkAdLoaded = setInterval(() => {
        if (loaded) {
          clearInterval(checkAdLoaded);
          try {
            rewardedAd?.show();
            setLoading(false);
            setLoaded(false);
            rewardedAd?.load();
          } catch (error) {
            console.error('Error showing ad after retry:', error);
            setLoading(false);
            setAdError(error);
            Alert.alert('Error', 'Ads not load. Please try again.');
          }
        }
      }, 2000);
    }
  };

  useImperativeHandle(ref, () => ({
    showAd,
  }));

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar translucent backgroundColor={Color.transparent} />
    </View>
  );
});

export default VideoAds;
