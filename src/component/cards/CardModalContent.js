import {Image, StyleSheet} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scale} from '../../custome/Responsive';
import Color from '../Color';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';
import useTheme from '../Theme';
import strings from '../../language/strings';
import Clipboard from '@react-native-clipboard/clipboard';
import ActionMenu from '../common/ActionMenu';
import {MENU_ICON_SIZE} from '../common/MenuOptionItem';

const CardModalContent = ({onDeleteCardPress, item, folderId, setId}) => {
  const navigation = useNavigation();
  const colorTheme = useTheme();

  const handleDeletePress = useCallback(() => {
    if (onDeleteCardPress) {
      onDeleteCardPress(item);
    }
  }, [onDeleteCardPress, item]);

  const handleEdit = useCallback(() => {
    navigation.navigate(ScreenName.createCard, {
      editNote: true,
      initialData: item,
      folderId: folderId,
      setId: setId,
    });
  }, [navigation, item, folderId, setId]);

  const handleCopy = useCallback(() => {
    const copyText = `${item?.top ?? ''}\n${item?.bottom ?? ''}`;
    Clipboard.setString(copyText);
  }, [item]);

  const handleMove = useCallback(() => {
    navigation.navigate(ScreenName.assignSet, {
      folderId: folderId,
      setId: setId,
      cardId: item?._id,
    });
  }, [navigation, folderId, setId, item]);

  const actions = useMemo(() => [
    {
      icon: <MaterialIcons name="edit" size={MENU_ICON_SIZE} color={colorTheme.textColor} />,
      label: strings.edit,
      onSelect: handleEdit,
      textColor: colorTheme.textColor
    },
    {
      icon: <MaterialCommunityIcons name="delete" size={MENU_ICON_SIZE} color={Color.Red} />,
      label: strings.delete,
      onSelect: handleDeletePress,
      textColor: colorTheme.textColor,
      isDanger: true
    },
    {
      icon: <MaterialIcons name="content-copy" size={MENU_ICON_SIZE} color={colorTheme.textColor} />,
      label: strings.copy,
      onSelect: handleCopy,
      textColor: colorTheme.textColor
    },
    {
      icon: <Image
        source={require('../../Assets/Img/moveFolder.png')}
        style={styles.iconImage}
        tintColor={colorTheme.textColor}
      />,
      label: strings.move,
      onSelect: handleMove,
      textColor: colorTheme.textColor,
      showDivider: false
    }
  ], [colorTheme.textColor, handleEdit, handleDeletePress, handleCopy, handleMove]);

  return <ActionMenu actions={actions} />;
};

export default React.memo(CardModalContent);

const styles = StyleSheet.create({
  iconImage: {
    width: scale(17),
    height: scale(17),
  },
});
