import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {View, Alert, ActivityIndicator, Text} from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-9823475062473479/5214348018';

const VideoAds = forwardRef(({updateCredit}, ref) => {
  const [rewardedAd, setRewardedAd] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reward, setReward] = useState('');

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
    });

    setRewardedAd(ad);
    ad.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeError();
    };
  }, []);

  const showAd = () => {
    if (rewardedAd && loaded) {
      rewardedAd.show();
      setLoaded(false);
      setLoading(true);
      rewardedAd.load();
    } else {
      Alert.alert('Ad Not Ready', 'Please wait while we load the ad.');
    }
  };

  useImperativeHandle(ref, () => ({
    showAd,
  }));

  return (
    <View
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}></View>
  );
});

export default VideoAds;
