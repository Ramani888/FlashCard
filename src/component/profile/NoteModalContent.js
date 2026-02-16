import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scale, verticalScale} from '../../custome/Responsive';
import Color from '../Color';
import Font from '../Font';
import strings from '../../language/strings';
import {MenuOption} from 'react-native-popup-menu';
import {Divider} from '@rneui/themed/dist/Divider';
import useTheme from '../Theme';

const NoteModalContent = ({
  item,
  openBottomSheet,
  setEditBottomSheet,
  deleteData,
  setSingleNoteData,
}) => {
  const colorTheme = useTheme();

  const handleEdit = useCallback(() => {
    if (setSingleNoteData) {
      setSingleNoteData(item);
    }
    setEditBottomSheet(true);
    openBottomSheet();
  }, [item, setSingleNoteData, setEditBottomSheet, openBottomSheet]);

  const handleDelete = useCallback(() => {
    deleteData(item?._id);
  }, [item?._id, deleteData]);

  return (
    <View style={styles.wrapper}>
      <MenuOption
        onSelect={handleEdit}
        customStyles={{optionWrapper: {paddingLeft: scale(5)}}}>
        <View style={styles.container}>
          <MaterialIcons
            name="edit"
            size={scale(18)}
            color={colorTheme.textColor}
          />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.edit}
          </Text>
        </View>
      </MenuOption>
      <Divider />
      <MenuOption
        onSelect={handleDelete}
        customStyles={{optionWrapper: {paddingLeft: scale(5)}}}>
        <View style={styles.container}>
          <MaterialCommunityIcons
            name="delete"
            size={scale(18)}
            color={Color.Red}
          />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.delete}
          </Text>
        </View>
      </MenuOption>
    </View>
  );
};

export default React.memo(NoteModalContent);

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
  text: {
    fontSize: scale(16),
    fontFamily: Font.regular,
  },
});
