import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScreenName} from '../../component/Screen';
import LottieSplashScreen from 'react-native-lottie-splash-screen';

const SplashScreen = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  const checkLogin = useCallback(async () => {
    setVisible(true);
    const user = await AsyncStorage.getItem('user');
    setVisible(false);
    LottieSplashScreen.hide();
    if (user) {
      navigation.reset({
        index: 0,
        routes: [{name: ScreenName.home}],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: ScreenName.signIn}],
      });
    }
  }, [navigation]);

  return <View style={styles.container} />;
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  lottie: {width: '100%', height: '100%'},
});

// import React, {useCallback, useEffect, useState} from 'react';
// import {View, StyleSheet} from 'react-native';
// import LottieView from 'lottie-react-native';
// import {useNavigation} from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {ScreenName} from '../../component/Screen';
// import LottieSplashScreen from 'react-native-lottie-splash-screen';

// const SplashScreen = () => {
//   const navigation = useNavigation();
//   const [animationFinished, setAnimationFinished] = useState(false);
//   const [user, setUser] = useState('');

//   useEffect(() => {
//     checkLogin();
//   }, [checkLogin]);

//   const checkLogin = useCallback(async () => {
//     const userData = await AsyncStorage.getItem('user');
//     setUser(userData);

//     // Wait for splash screen to close before navigating
//     setTimeout(() => {
//       LottieSplashScreen.hide();
//       setAnimationFinished(true);
//     }, 2000);
//   }, []);

//   useEffect(() => {
//     if (animationFinished) {
//       // Navigate only after animation is finished
//       navigation.reset({
//         index: 0,
//         routes: [{name: user ? ScreenName.home : ScreenName.signIn}],
//       });
//     }
//   }, [animationFinished, navigation, user]);

//   return (
//     <View style={styles.container}>
//       <LottieView
//         source={require('../../Assets/JsonFile/splashscreen.json')}
//         autoPlay
//         loop={false} // Stops looping so it finishes
//         onAnimationFinish={() => setAnimationFinished(true)}
//         style={styles.lottie}
//       />
//     </View>
//   );
// };

// export default SplashScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//   },
//   lottie: {width: '100%', height: '100%'},
// });
