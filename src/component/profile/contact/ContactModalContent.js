import React, {memo, useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../Color';
import Font from '../../Font';

const ContactModalContent = ({closeModal}) => {
  // Memoizing the renderBody to avoid unnecessary re-renders
  const renderBody = useCallback(() => (
    <View>
      <Pressable style={styles.container} onPress={closeModal}>
        <MaterialCommunityIcons
          name="delete"
          size={scale(17)}
          color={Color.Red}
        />
        <Text style={styles.text}>Delete Contact</Text>
      </Pressable>

      <Pressable
        style={[styles.container, styles.viewContactContainer]}
        onPress={closeModal}>
        <Entypo name="eye" size={scale(17)} color={Color.Black} />
        <Text style={styles.text}>View Contact</Text>
      </Pressable>
    </View>
  ), [closeModal]);

  return <View>{renderBody()}</View>;
};

export default memo(ContactModalContent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: scale(5),
    borderBottomWidth: scale(0.7),
    borderBottomColor: Color.mediumGray,
    height: verticalScale(33),
  },
  viewContactContainer: {
    borderBottomWidth: 0,
    marginBottom: verticalScale(-2),
  },
  text: {
    fontSize: scale(14),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(10),
  },
});
