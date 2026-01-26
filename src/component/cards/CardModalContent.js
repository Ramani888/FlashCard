import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {MenuOption} from 'react-native-popup-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scale, verticalScale} from '../../custome/Responsive';
import Color from '../Color';
import Font from '../Font';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';
import useTheme from '../Theme';
import strings from '../../language/strings';
import Clipboard from '@react-native-clipboard/clipboard';
import {Divider} from '@rneui/themed/dist/Divider';

const CardModalContent = ({deleteCard, item, folderId, setId}) => {
  const navigation = useNavigation();
  const colorTheme = useTheme();

  return (
    <View style={styles.wrapper}>
      <MenuOption
        onSelect={() => {
          navigation.navigate(ScreenName.createCard, {
            editNote: true,
            initialData: item,
            folderId: folderId,
            setId: setId,
          });
        }}>
        <View style={styles.container}>
          <MaterialIcons
            name="edit"
            size={scale(15)}
            color={colorTheme.textColor}
          />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.edit}
          </Text>
        </View>
      </MenuOption>
      <Divider />

      <MenuOption
        onSelect={() => {
          deleteCard(item?._id);
        }}>
        <View style={styles.container}>
          <MaterialCommunityIcons
            name="delete"
            size={scale(15)}
            color={Color.Red}
          />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.delete}
          </Text>
        </View>
      </MenuOption>
      <Divider />

      <MenuOption
        onSelect={() => {
          const copyText = `${item?.top ?? ''}\n${item?.bottom ?? ''}`;
          Clipboard.setString(copyText);
        }}>
        <View style={styles.container}>
          <MaterialIcons
            name="content-copy"
            size={scale(15)}
            color={colorTheme.textColor}
          />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.copy}
          </Text>
        </View>
      </MenuOption>
      <Divider />

      <MenuOption
        onSelect={() => {
          navigation.navigate(ScreenName.assignSet, {
            folderId: folderId,
            setId: setId,
            cardId: item?._id,
          });
        }}>
        <View style={[styles.container, styles.lastItem]}>
          <Image
            source={require('../../Assets/Img/moveFolder.png')}
            style={styles.iconImage}
            tintColor={colorTheme.textColor}
          />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.move}
          </Text>
        </View>
      </MenuOption>
    </View>
  );
};

export default React.memo(CardModalContent);

const styles = StyleSheet.create({
  wrapper: {
    padding: scale(12),
    display: 'flex',
    flexDirection: 'column',
    gap: verticalScale(4),
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  text: {
    fontSize: scale(16),
    color: Color.Black,
    fontFamily: Font.regular,
    textTransform: 'capitalize',
  },
  iconImage: {
    width: scale(16),
    height: scale(16),
  },
});
