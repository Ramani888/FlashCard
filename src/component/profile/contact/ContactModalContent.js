import React, {memo, useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scale, verticalScale} from '../../../custome/Responsive';
import Color from '../../Color';
import Font from '../../Font';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../../Screen';
import strings from '../../../language/strings';

const ContactModalContent = ({
  closeModal,
  item,
  deleteContacts,
  colorTheme,
}) => {
  const navigation = useNavigation();

  const renderBody = useCallback(
    () => (
      <View>
        <Pressable
          style={styles.container}
          onPress={() => {
            deleteContacts(item?._id);
            closeModal();
          }}>
          <MaterialCommunityIcons
            name="delete"
            size={scale(17)}
            color={Color.Red}
          />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.deleteContact}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.container, styles.viewContactContainer]}
          onPress={() => {
            navigation.navigate(ScreenName.otherUser, {
              item: item,
            });
            closeModal();
          }}>
          <Entypo name="eye" size={scale(17)} color={colorTheme.textColor} />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.viewCard}
          </Text>
        </Pressable>
      </View>
    ),
    [closeModal],
  );

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
