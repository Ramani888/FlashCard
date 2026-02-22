import React, {memo, useCallback, useMemo} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../Color';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../../Screen';
import strings from '../../../language/strings';
import ActionMenu from '../../common/ActionMenu';
import {MENU_ICON_SIZE} from '../../common/MenuOptionItem';

const ContactModalContent = ({
  item,
  deleteContacts,
  colorTheme,
}) => {
  const navigation = useNavigation();

  const handleDelete = useCallback(() => {
    deleteContacts(item?._id);
  }, [deleteContacts, item]);

  const handleView = useCallback(() => {
    navigation.navigate(ScreenName.otherUser, {
      item: item,
    });
  }, [navigation, item]);

  const actions = useMemo(() => [
    {
      icon: <MaterialCommunityIcons name="delete" size={MENU_ICON_SIZE} color={Color.Red} />,
      label: strings.deleteContact,
      onSelect: handleDelete,
      textColor: colorTheme.textColor,
      isDanger: true
    },
    {
      icon: <Entypo name="eye" size={MENU_ICON_SIZE} color={colorTheme.textColor} />,
      label: strings.viewCard,
      onSelect: handleView,
      textColor: colorTheme.textColor,
      showDivider: false
    }
  ], [colorTheme.textColor, handleDelete, handleView]);

  return <ActionMenu actions={actions} />;
};

export default memo(ContactModalContent);
