import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scale, verticalScale} from '../../../custome/Responsive';
import Color from '../../Color';
import Font from '../../Font';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../../Screen';
import strings from '../../../language/strings';
import {MenuOption} from 'react-native-popup-menu';
import {Divider} from '@rneui/themed';

const ContactModalContent = ({
  item,
  deleteContacts,
  colorTheme,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <MenuOption
        onSelect={() => deleteContacts(item?._id)}>
        <View style={styles.container}>
          <MaterialCommunityIcons
            name="delete"
            size={scale(17)}
            color={Color.Red}
          />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.deleteContact}
          </Text>
        </View>
      </MenuOption>

      <Divider />

      <MenuOption
        onSelect={() => {
          navigation.navigate(ScreenName.otherUser, {
            item: item,
          });
        }}>
        <View style={styles.container}>
          <Entypo name="eye" size={scale(17)} color={colorTheme.textColor} />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.viewCard}
          </Text>
        </View>
      </MenuOption>
    </View>
  );
};

export default memo(ContactModalContent);

const styles = StyleSheet.create({
  wrapper: {
    padding: scale(12),
    display: 'flex',
    flexDirection: 'column',
    gap: verticalScale(4)
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6)
  },
  text: {
    fontSize: scale(14),
    color: Color.Black,
    fontFamily: Font.regular,
  },
});
