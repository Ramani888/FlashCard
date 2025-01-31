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
import strings from '../../language/strings';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-9823475062473479/5214348018';

const VideoAds = forwardRef(({updateCredit, setLoading}, ref) => {
  const [rewardedAd, setRewardedAd] = useState(null);
  const [loaded, setLoaded] = useState(false);
  // const [loading, setLoading] = useState(true);
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
    setLoading(true); // Show loader when function is called

    if (rewardedAd && loaded) {
        rewardedAd.show();
        setLoading(false); // Hide loader after showing the ad
        setLoaded(false);  // Reset loaded state
        rewardedAd.load(); // Load next ad
    } else {
        const checkAdLoaded = setInterval(() => {
            if (loaded) {
                clearInterval(checkAdLoaded); // Stop checking once ad is loaded
                rewardedAd.show();
                setLoading(false); // Hide loader when ad starts
                setLoaded(false);  // Reset loaded state
                rewardedAd.load(); // Load next ad
            }
        }, 500); // Check every 500ms if the ad is ready
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
