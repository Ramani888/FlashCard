import {
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import React from 'react';
import {scale} from 'react-native-size-matters';
import Color from './Color';

const Loader = ({visible}) => {
  return (
    <View>
      <Modal visible={visible} transparent>
        <View style={styles.modalView}>
          <View style={styles.mainView}>
            <ActivityIndicator size={'large'} color={Color.theme1} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  modalView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainView: {
    height: scale(100),
    width: scale(100),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    elevation: scale(5),
  },
});
