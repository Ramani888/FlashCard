import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {MenuOption} from 'react-native-popup-menu';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Switch} from '@rneui/themed';
import Color from '../Color';
import Font from '../Font';
import {scale} from '../../custome/Responsive';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';
import {apiPut} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
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
  const [value, setValue] = useState(singleItem?.isPrivate);
  const isFirstRender = useRef(true);
  const colorTheme = useTheme();

  const userIcon = useMemo(() => require('../../Assets/Img/userIcon.png'), []);
  const lockIcon = useMemo(() => require('../../Assets/Img/lock.png'), []);

  const handleUpdateSetSecret = useCallback(async () => {
    try {
      const response = await apiPut(
        Api.Set,
        '',
        JSON.stringify({...singleItem, isPrivate: value}),
      );
      getSetData(true, response?.message);
    } catch (error) {
      console.log('error in edit Set api', error);
    }
  }, [getSetData, singleItem, value]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      handleUpdateSetSecret();
    }
  }, [value, handleUpdateSetSecret]);

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

  const customSwitch = useMemo(() => (
    <MenuOption disabled>
      <View style={styles.switchContainer}>
        <Image source={userIcon} style={styles.icon} />
        <View style={styles.switchContent}>
          <Switch
            value={value}
            onValueChange={() => setValue(!value)}
            thumbColor={value ? Color.theme1 : '#8E9494'}
            trackColor={{false: '#E7EAEB', true: Color.theme2}}
          />
          <Text style={[styles.switchLabel, {color: colorTheme.textColor}]}>
            {value ? strings.private : strings.public}
          </Text>
        </View>
        <Image source={lockIcon} style={styles.icon} />
      </View>
    </MenuOption>
  ), [value, userIcon, lockIcon, colorTheme.textColor]);

  return (
    <ActionMenu 
      actions={type === 'Set' ? setActions : folderActions}
      customContent={type === 'Set' ? customSwitch : null}
    />
  );
};

export default React.memo(ModalContent);

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(6),
  },
  switchContent: {
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: wp('3.3%'),
    color: Color.Black,
    fontFamily: Font.regular,
  },
  icon: {
    width: wp('5%'),
    height: wp('5%'),
  },
});
