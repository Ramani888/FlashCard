import React, {useCallback, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {scale, verticalScale} from '../../custome/Responsive';
import Color from '../Color';
import Font from '../Font';
import {ScreenName} from '../Screen';
import {useNavigation} from '@react-navigation/native';
import strings from '../../language/strings';
import useTheme from '../Theme';
import {Divider} from '@rneui/themed/dist/Divider';
import ActionMenu from '../common/ActionMenu';
import {MENU_ICON_SIZE} from '../common/MenuOptionItem';

const AddNoteModalContent = ({item, folderId, setId}) => {
  const navigation = useNavigation();
  const colorTheme = useTheme();

  const handlePress = useCallback(() => {
    navigation.navigate(ScreenName.createCard, {
      initialData: item,
      folderId: folderId,
      setId: setId,
    });
  }, [navigation, item, folderId, setId]);

  const actions = useMemo(() => [
    {
      icon: <Entypo name="plus" size={MENU_ICON_SIZE} color={Color.theme1} />,
      label: strings.addNote,
      onSelect: handlePress,
      textColor: colorTheme.textColor,
      showDivider: false
    }
  ], [handlePress, colorTheme.textColor]);

  const customHeader = useMemo(() => (
    <>
      <View style={styles.noneSection}>
        <Text style={[styles.noneText, {color: colorTheme.textColor}]}>
          {strings.none}
        </Text>
      </View>
      <Divider />
    </>
  ), [colorTheme.textColor]);

  return (
    <View style={styles.wrapper}>
      <ActionMenu
        customContent={customHeader}
        customContentPosition="top"
        actions={actions}
      />
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
  menuSection: {
    paddingTop: verticalScale(8),
  },
});
