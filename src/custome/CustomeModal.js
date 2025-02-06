import React, {memo} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
  Text,
} from 'react-native';
import {scale} from './Responsive';
import Entypo from 'react-native-vector-icons/Entypo';
import Color from '../component/Color';
import Font from '../component/Font';

const CustomModal = ({
  visible,
  onClose,
  closeModal,
  content,
  title,
  width = scale(300),
  height,
  justifyContent = 'center',
  borderRadius = scale(10),
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  mainPadding = scale(15),
  backgroundColor = 'rgba(0,0,0,0.8)',
  closeButtonStyle,
  modalContainerStyle,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={[styles.modalContainer, {justifyContent, backgroundColor}]}>
          <View
            style={[
              styles.modalContent,
              {
                width,
                height,
                borderRadius,
                borderTopLeftRadius,
                borderTopRightRadius,
                borderBottomLeftRadius,
                borderBottomRightRadius,
                padding: mainPadding,
              },
              modalContainerStyle,
            ]}>
            <View style={styles.headerContainer}>
              {title && <Text style={styles.modalTitle}>{title}</Text>}
              {closeModal && (
                <Pressable
                  onPress={onClose}
                  style={[styles.closeButtonContainer, closeButtonStyle]}>
                  <Entypo name="cross" size={scale(20)} color={Color.Black} />
                </Pressable>
              )}
            </View>
            {content}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default memo(CustomModal);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  // modalContent: {
  //   backgroundColor: Color.White,
  // },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  modalTitle: {
    color: Color.Black,
    fontSize: scale(14),
    fontFamily: Font.semiBold,
    textAlign: 'center',
    flex: 1,
  },
  closeButtonContainer: {
    padding: scale(5),
  },
});
