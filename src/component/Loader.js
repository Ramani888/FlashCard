import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import React from 'react';
import {scale} from 'react-native-size-matters';
import {UIActivityIndicator} from 'react-native-indicators';
import Color from './Color';

const Loader = ({visible, color}) => {
  return (
    <Modal transparent={true} animationType="none" visible={visible}>
      <View style={styles.loaderContainer}>
        <UIActivityIndicator
          color={color ? color : Color.theme2}
          animating={visible}
          size={scale(30)}
        />
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
