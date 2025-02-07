import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import {View, StatusBar, StyleSheet} from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import Color from '../../component/Color';

const adUnitId = _DEV_
  ? TestIds.REWARDED
  : 'ca-app-pub-9823475062473479/5214348018';

const VideoAds = forwardRef(({updateCredit, setLoading}, ref) => {
  const [rewardedAd, setRewardedAd] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [reward, setReward] = useState(null);
  const [adError, setAdError] = useState(null);

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
          setLoaded(true);
          setRewardedAd(ad);

          setLoading(false);

          if (initial === false) {
            setLoaded(prevLoaded => {
              if (prevLoaded) {
                ad.show();
              }
              return prevLoaded;
            });
          }
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
        },
      );

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
