import {Image, Linking, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import store from './src/redux/newStore';
import Color from './src/component/Color';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {initializeAds} from './src/screen/ads/AdConfig';
import {useAppLaunchInterstitial} from './src/screen/ads/InterstitialAds';
import AppNav from './src/navigation/AppNav';
import {MenuProvider} from 'react-native-popup-menu';
import {withIAPContext} from 'react-native-iap';
import CheckNetwork from './src/screen/CheckNetwork';
import CustomeModal from './src/custome/CustomeModal';
import {moderateScale, scale, verticalScale} from './src/custome/Responsive';
import CustomeButton from './src/custome/CustomeButton';
import Font from './src/component/Font';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import ErrorBoundary from './src/component/ErrorBoundary';
import {AuthProvider, LoaderProvider} from './src/context';
import {useAppSelector} from './src/redux/hooks';

/**
 * Main App component
 * Provider is now the outermost wrapper (after gesture handler)
 * ErrorBoundary catches and handles any uncaught errors
 */
const AppContent = () => {
  const [updatedModal, setUpdateModal] = useState(false);
  const [_updateAvailable, setUpdateAvailable] = useState(false);
  
  // Get authentication status from Redux
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  // Initialize app open ad - only shows when user is logged in
  useAppLaunchInterstitial(isAuthenticated);

  const getVersions = useCallback(async () => {
    try {
      const users = await firestore().collection('versions').get();
      if (users.docs.length > 0) {
        setUpdateAvailable(users.docs[0]._data);
        const version = await DeviceInfo.getVersion();
        if (users.docs[0]._data.version > version) {
          setUpdateModal(true);
        }
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }, []);

  useEffect(() => {
    // Initialize AdMob with family-friendly settings for API 35 compliance
    // Wrap in a setTimeout to ensure it runs after the app is fully mounted
    const timer = setTimeout(() => {
      initializeAds()
        .then(() => {
          console.log('AdMob Initialized with Family Policy settings');
        })
        .catch(error => {
          console.error('Failed to initialize AdMob:', error);
        });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getVersions();
  }, [getVersions]);

  // Error handler for ErrorBoundary
  const handleError = useCallback((error, errorInfo) => {
    // Log to your error tracking service (e.g., Sentry, Crashlytics)
    console.error('App Error:', error, errorInfo);
  }, []);

  return (
    <ErrorBoundary onError={handleError}>
      <SafeAreaProvider>
        <MenuProvider>
          <View style={styles.container}>
            <CheckNetwork />
            <StatusBar translucent backgroundColor={Color.transparent} />
            <NavigationContainer>
              <AppNav />

            <CustomeModal
              visible={updatedModal}
              width={'80%'}
              justifyContent={'center'}
              alignItems={'center'}
              backgroundColor={Color.theme1}
              mainPadding={scale(12)}
              borderRadius={scale(10)}
              content={
                <View style={styles.modalContainer}>
                  <View style={styles.imageView}>
                    <Image
                      source={require('./src/Assets/Img/update.png')}
                      style={styles.image}
                    />
                  </View>
                  <Text style={styles.text1}>App Update Required!</Text>
                  <Text style={styles.text2}>
                    We have added new features and fix some bugs to make your
                    experience seamless
                  </Text>
                  <CustomeButton
                    title={'Update App'}
                    buttonWidth={'60%'}
                    buttonHeight={verticalScale(35)}
                    buttonColor={Color.White}
                    fontSize={moderateScale(15)}
                    fontFamily={Font.semiBold}
                    fontColor={Color.theme1}
                    borderRadius={moderateScale(10)}
                    marginTop={verticalScale(10)}
                    textTransform={'uppercase'}
                    onPress={() =>
                      Linking.openURL(
                        'https://play.google.com/store/apps/details?id=com.flashcard.app',
                      )
                    }
                  />
                </View>
              }
            />
            </NavigationContainer>
          </View>
        </MenuProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

/**
 * Root App component with gesture handler and providers
 */
const App = gestureHandlerRootHOC(() => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <LoaderProvider>
          <AppContent />
        </LoaderProvider>
      </AuthProvider>
    </Provider>
  );
});

export default withIAPContext(App);

const styles = StyleSheet.create({
  container: {flex: 1},
  modalContainer: {alignItems: 'center'},
  text1: {
    fontSize: scale(20),
    color: Color.White,
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
  },
  text2: {
    fontSize: scale(13),
    color: Color.White,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },
  imageView: {marginTop: verticalScale(-90), marginBottom: verticalScale(-25)},
  image: {width: scale(150), height: scale(150)},
});
