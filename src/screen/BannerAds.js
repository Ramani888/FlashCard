// import React from 'react';
// import {View, StyleSheet, Platform, SafeAreaView} from 'react-native';
// import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

// const adUnitId = __DEV__
//   ? TestIds.ADAPTIVE_BANNER
//   : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

// const BannerAds = () => {
//   return (
//     <SafeAreaView style={styles.centerView}>
//       <BannerAd
//         unitId={adUnitId}
//         size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
//         requestOptions={{
//           requestNonPersonalizedAdsOnly: true,
//           networkExtras: {
//             collapsible: 'bottom',
//           },
//         }}
//         onAdLoaded={() => console.log('Ad loaded successfully')}
//         onAdFailedToLoad={error => console.error('Failed to load ad:', error)}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   centerView: {
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
// });

// export default BannerAds;
