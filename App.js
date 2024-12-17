// import {StatusBar, StyleSheet, Text, View} from 'react-native';
// import React, {useEffect} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import LottieSplashScreen from 'react-native-lottie-splash-screen';
// // import mobileAds, {MaxAdContentRating} from 'react-native-google-mobile-ads';
// import DeviceInfo from 'react-native-device-info';
// import AppNav from './src/navigation/AppNav';
// import {Provider} from 'react-redux';
// import store from './src/redux/store';
// import Color from './src/component/Color';
// import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
// import MobileAds from 'react-native-google-mobile-ads';
// import {InterstitialAd, AdEventType} from 'react-native-google-mobile-ads';

// const App = gestureHandlerRootHOC(() => {
//   useEffect(() => {
//     setTimeout(() => {
//       LottieSplashScreen.hide();
//     }, 1500);
//     MobileAds()
//       .initialize()
//       .then(() => {
//         console.log('AdMob initialized');
//       });
//     // DeviceInfo.getUniqueId().then(deviceId => {
//     //   // console.log('Test Device ID:', deviceId);
//     // });
//   }, []);

//   const interstitialAd = InterstitialAd.createForAdRequest(
//     'ca-app-pub-3940256099942544/1033173712', // Replace with your Ad Unit ID or test Ad Unit ID
//     {
//       requestNonPersonalizedAdsOnly: true, // Prevent personalized ads
//     },
//   );

//   // Add event listeners
//   interstitialAd.onAdEvent((type, error) => {
//     if (type === AdEventType.LOADED) {
//       console.log('Interstitial ad loaded');
//       interstitialAd.show();
//     }
//     if (type === AdEventType.ERROR) {
//       console.error('Interstitial ad failed to load:', error);
//     }
//   });

//   // Load the interstitial ad
//   interstitialAd.load();

//   return (
//     <View style={{flex: 1}}>
//       <StatusBar translucent backgroundColor={Color.transparent} />
//       <NavigationContainer>
//         <Provider store={store}>
//           <AppNav />
//         </Provider>
//       </NavigationContainer>
//     </View>
//   );
// });

// export default App;

// const styles = StyleSheet.create({});

import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LottieSplashScreen from 'react-native-lottie-splash-screen';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import Color from './src/component/Color';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import MobileAds, {
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import AppNav from './src/navigation/AppNav';
import {MenuProvider} from 'react-native-popup-menu';

const App = gestureHandlerRootHOC(() => {
  useEffect(() => {
    // Hide the splash screen
    setTimeout(() => {
      LottieSplashScreen.hide();
    }, 1500);

    // Initialize AdMob
    MobileAds()
      .initialize()
      .then(() => {
        console.log('AdMob initialized');
      });
  });

  return (
    <MenuProvider>
      <View style={{flex: 1}}>
        <StatusBar translucent backgroundColor={Color.transparent} />
        <NavigationContainer>
          <Provider store={store}>
            <AppNav />
          </Provider>
        </NavigationContainer>
      </View>
    </MenuProvider>
  );
});

export default App;

const styles = StyleSheet.create({});
