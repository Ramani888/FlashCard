import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import CustomModal from '../custome/CustomeModal';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../component/Color';

const CheckNetwork = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [networkModal, setNetworkModal] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setNetworkModal(!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <CustomModal
      visible={networkModal}
      width={'100%'}
      height={verticalScale(70)}
      justifyContent={'flex-end'}
      alignItems={'center'}
      backgroundColor={'rgba(0,0,0,0.9)'}
      borderRadius={scale(5)}
      content={
        <View style={styles.offlineContainer}>
          <Image
            source={require('../Assets/Img/noNetwork.png')}
            style={styles.image}
            tintColor={Color.White}
          />
          <Text style={styles.offlineText}>You are offline</Text>
        </View>
      }
    />
  );
};

export default CheckNetwork;

const styles = StyleSheet.create({
  offlineContainer: {
    flex: 1,
    backgroundColor: '#FF474c',
    height: verticalScale(100),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  image: {
    width: scale(50),
    height: scale(50),
  },
  offlineText: {
    color: Color.White,
    fontSize: scale(17),
    marginLeft: scale(10),
    fontFamily: 'Montserrat-Regular',
  },
});
