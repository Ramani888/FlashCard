import React, {useMemo} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../Color';
import strings from '../../../language/strings';
import ActionMenu from '../../common/ActionMenu';
import {MENU_ICON_SIZE} from '../../common/MenuOptionItem';

const ProfileModalContent = ({
  onLogoutPress,
  onDeleteAccountPress,
  colorTheme,
}) => {
  const actions = useMemo(() => [
    {
      icon: <MaterialCommunityIcons name="logout" size={MENU_ICON_SIZE} color={Color.Red} />,
      label: strings.logout,
      onSelect: onLogoutPress,
      textColor: colorTheme.textColor,
      isDanger: true
    },
    {
      icon: <MaterialCommunityIcons name="account-remove" size={MENU_ICON_SIZE} color={Color.Red} />,
      label: strings.deleteAccount,
      onSelect: onDeleteAccountPress,
      textColor: colorTheme.textColor,
      isDanger: true,
      showDivider: false
    }
  ], [colorTheme.textColor, onLogoutPress, onDeleteAccountPress]);

  return <ActionMenu actions={actions} />;
};

export default React.memo(ProfileModalContent);