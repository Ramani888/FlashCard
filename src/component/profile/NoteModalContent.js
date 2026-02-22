import React, {useCallback, useMemo} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../Color';
import strings from '../../language/strings';
import useTheme from '../Theme';
import ActionMenu from '../common/ActionMenu';
import {MENU_ICON_SIZE} from '../common/MenuOptionItem';

const NoteModalContent = ({
  item,
  openBottomSheet,
  setEditBottomSheet,
  onDeletePress,
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
    if (onDeletePress) {
      onDeletePress(item);
    }
  }, [item, onDeletePress]);

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
      onSelect: handleDelete,
      textColor: colorTheme.textColor,
      isDanger: true,
      showDivider: false
    }
  ], [colorTheme.textColor, handleEdit, handleDelete]);

  return <ActionMenu actions={actions} />;
};

export default React.memo(NoteModalContent);
