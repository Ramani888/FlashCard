import React, {useCallback, useMemo} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../Color';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';
import useTheme from '../Theme';
import strings from '../../language/strings';
import ActionMenu from '../common/ActionMenu';
import {MENU_ICON_SIZE} from '../common/MenuOptionItem';

const ModalContent = ({
  type,
  openBottomSheet,
  setEditBottomSheet,
  onDeletePress,
  onRemoveFolderPress,
  handleCreateSetClick,
  singleItem,
  folderId,
  getSetData,
}) => {
  const navigation = useNavigation();
  const colorTheme = useTheme();

  const handleDelete = useCallback(() => {
    if (onDeletePress) {
      onDeletePress();
    }
  }, [onDeletePress]);

  const handleRemoveFolder = useCallback(() => {
    if (onRemoveFolderPress) {
      onRemoveFolderPress(singleItem?._id);
    }
  }, [onRemoveFolderPress, singleItem?._id]);

  const setActions = useMemo(() => [
    {
      icon: <Entypo name="plus" size={MENU_ICON_SIZE} color={colorTheme.textColor} />,
      label: strings.createCard,
      onSelect: () => {
        navigation.navigate(ScreenName.createCard, {
          folderId: folderId,
          setId: singleItem?._id,
        });
      },
      textColor: colorTheme.textColor
    },
    {
      icon: <Feather name="folder-plus" size={MENU_ICON_SIZE} color={colorTheme.textColor} />,
      label: strings.assignFolder,
      onSelect: () => {
        navigation.navigate(ScreenName.asignFolder, {
          setId: singleItem?._id,
          folderId: singleItem?.folderId,
          screen: 'SetScreen',
        });
      },
      textColor: colorTheme.textColor
    },
    {
      icon: <MaterialIcons name="edit" size={MENU_ICON_SIZE} color={colorTheme.textColor} />,
      label: strings.editSet,
      onSelect: () => {
        setEditBottomSheet(true);
        openBottomSheet();
      },
      textColor: colorTheme.textColor
    },
    {
      icon: <MaterialCommunityIcons name="delete" size={MENU_ICON_SIZE} color={Color.Red} />,
      label: strings.deleteSet,
      onSelect: handleDelete,
      textColor: colorTheme.textColor,
      isDanger: true
    },
    {
      icon: <MaterialCommunityIcons name="folder-remove" size={MENU_ICON_SIZE} color={Color.Red} />,
      label: strings.removeFolder || 'Remove Folder',
      onSelect: handleRemoveFolder,
      textColor: colorTheme.textColor,
      isDanger: true,
      show: !!singleItem?.folderId
    }
  ], [
    colorTheme.textColor,
    folderId,
    singleItem,
    navigation,
    setEditBottomSheet,
    openBottomSheet,
    handleDelete,
    handleRemoveFolder,
  ]);

  const folderActions = useMemo(() => [
    {
      icon: <Entypo name="plus" size={MENU_ICON_SIZE} color={colorTheme.textColor} />,
      label: strings.createSet,
      onSelect: () => handleCreateSetClick(singleItem?._id),
      textColor: colorTheme.textColor
    },
    {
      icon: <MaterialIcons name="edit" size={MENU_ICON_SIZE} color={colorTheme.textColor} />,
      label: strings.editFolder,
      onSelect: () => {
        setEditBottomSheet(true);
        openBottomSheet();
      },
      textColor: colorTheme.textColor
    },
    {
      icon: <MaterialCommunityIcons name="delete" size={MENU_ICON_SIZE} color={Color.Red} />,
      label: strings.deleteFolder,
      onSelect: handleDelete,
      textColor: colorTheme.textColor,
      isDanger: true,
      showDivider: false
    }
  ], [
    colorTheme.textColor,
    singleItem,
    handleCreateSetClick,
    setEditBottomSheet,
    openBottomSheet,
    handleDelete,
  ]);

  return (
    <ActionMenu 
      actions={type === 'Set' ? setActions : folderActions}
    />
  );
};

export default React.memo(ModalContent);
