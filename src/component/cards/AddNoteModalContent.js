import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {MenuOption} from 'react-native-popup-menu';
import Entypo from 'react-native-vector-icons/Entypo';
import {scale, verticalScale} from '../../custome/Responsive';
import Color from '../Color';
import Font from '../Font';
import {ScreenName} from '../Screen';
import {useNavigation} from '@react-navigation/native';
import strings from '../../language/strings';
import useTheme from '../Theme';
import {Divider} from '@rneui/themed/dist/Divider';

const AddNoteModalContent = ({item, folderId, setId}) => {
  const navigation = useNavigation();
  const colorTheme = useTheme();

  const handlePress = () => {
    navigation.navigate(ScreenName.createCard, {
      initialData: item,
      folderId: folderId,
      setId: setId,
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.noneSection}>
        <Text style={[styles.noneText, {color: colorTheme.textColor}]}>
          {strings.none}
        </Text>
      </View>
      <Divider />
      <MenuOption onSelect={handlePress}>
        <View style={styles.addNoteContainer}>
          <Entypo
            name="plus"
            size={scale(20)}
            color={Color.theme1}
          />
          <Text style={[styles.addNoteText, {color: colorTheme.textColor}]}>
            {strings.addNote}
          </Text>
        </View>
      </MenuOption>
    </View>
  );
};

export default AddNoteModalContent;

const styles = StyleSheet.create({
  wrapper: {
    padding: scale(12),
    display: 'flex',
    flexDirection: 'column',
  },
  noneSection: {
    alignItems: 'center',
    paddingBottom: verticalScale(8),
  },
  noneText: {
    fontSize: scale(16),
    color: Color.Black,
    fontFamily: Font.regular,
    textAlign: 'center',
  },
  addNoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    paddingTop: verticalScale(8),
  },
  addNoteText: {
    fontSize: scale(16),
    color: Color.Black,
    fontFamily: Font.regular,
    textTransform: 'capitalize',
  },
});
