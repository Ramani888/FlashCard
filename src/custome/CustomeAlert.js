import React, {useState} from 'react';
import {
  Alert,
  Button,
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../component/Color';
import CustomeButton from './CustomeButton';

const CustomeAlert = ({isVisible, title, message, onConfirm, onCancel}) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.btnView}>
            <CustomeButton
              buttoncolor={Color.Blue}
              buttonwidth={'30%'}
              buttonheight={verticalScale(35)}
              borderRadius={scale(5)}
              title={'Cancel'}
              fontcolor={Color.White}
              fontSize={scale(15)}
              fontFamily={'Montserrat-Medium'}
              onPress={onCancel}
            />
            <CustomeButton
              buttoncolor={Color.Blue}
              buttonwidth={'30%'}
              buttonheight={verticalScale(35)}
              borderRadius={scale(8)}
              title={'Ok'}
              fontcolor={Color.White}
              fontSize={scale(15)}
              fontFamily={'Montserrat-Medium'}
              marginLeft={scale(10)}
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomeAlert;

const styles = StyleSheet.create({
  mainContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    backgroundColor: Color.White,
    elevation: scale(5),
  },
  title: {
    fontSize: scale(15),
    color: Color.theme,
    fontFamily: 'Montserrat-Medium',
  },
  message: {
    fontSize: scale(15),
    color: Color.theme,
    fontFamily: 'Montserrat-Regular',
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
});
