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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';
import {apiPut} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import useTheme from '../Theme';
import strings from '../../language/strings';
import { verticalScale } from 'react-native-size-matters';
import { Divider } from '@rneui/themed/dist/Divider';

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

  const iconSize = useMemo(() => scale(20), []);
  const userIcon = useMemo(() => require('../../Assets/Img/userIcon.png'), []);
  const lockIcon = useMemo(() => require('../../Assets/Img/lock.png'), []);

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

  const renderSetContent = useCallback(() => (
    <>
      <MenuOption
        onSelect={() => {
          navigation.navigate(ScreenName.createCard, {
            folderId: folderId,
            setId: singleItem?._id,
          });
        }}>
        <View style={styles.container}>
          <Entypo name="plus" size={iconSize} color={colorTheme.textColor} />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.createCard}
          </Text>
        </View>
      </MenuOption>
      <Divider />

      <MenuOption
        onSelect={() => {
          navigation.navigate(ScreenName.asignFolder, {
            setId: singleItem?._id,
            folderId: singleItem?.folderId,
            screen: 'SetScreen',
          });
        }}>
        <View style={styles.container}>
          <Feather
            name="folder-plus"
            size={iconSize}
            color={colorTheme.textColor}
          />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.assignFolder}
          </Text>
        </View>
      </MenuOption>
      <Divider />

      <MenuOption
        onSelect={() => {
          setEditBottomSheet(true);
          openBottomSheet();
        }}>
        <View style={styles.container}>
          <MaterialIcons
            name="edit"
            size={iconSize}
            color={colorTheme.textColor}
          />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.editSet}
          </Text>
        </View>
      </MenuOption>
      <Divider />

      <MenuOption onSelect={handleDelete}>
        <View style={styles.container}>
          <MaterialCommunityIcons
            name="delete"
            size={iconSize}
            color={Color.Red}
          />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.deleteSet}
          </Text>
        </View>
      </MenuOption>
      <Divider />

      <MenuOption
        onSelect={handleRemoveFolder}>
        <View style={styles.container}>
          <MaterialCommunityIcons
            name="folder-remove"
            size={iconSize}
            color={Color.Red}
          />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.removeFolder || 'Remove Folder'}
          </Text>
        </View>
      </MenuOption>
      <Divider />

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
    </>
  ), [
    folderId,
    singleItem,
    navigation,
    iconSize,
    colorTheme.textColor,
    setEditBottomSheet,
    openBottomSheet,
    handleDelete,
    handleRemoveFolder,
    value,
    userIcon,
    lockIcon,
  ]);

  const renderFolderContent = useCallback(() => (
    <>
      <MenuOption onSelect={() => handleCreateSetClick(singleItem?._id)}>
        <View style={styles.container}>
          <Entypo name="plus" size={iconSize} color={colorTheme.textColor} />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.createSet}
          </Text>
        </View>
      </MenuOption>
      <Divider />

      <MenuOption
        onSelect={() => {
          setEditBottomSheet(true);
          openBottomSheet();
        }}>
        <View style={styles.container}>
          <MaterialIcons
            name="edit"
            size={iconSize}
            color={colorTheme.textColor}
          />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.editFolder}
          </Text>
        </View>
      </MenuOption>
      <Divider />

      <MenuOption onSelect={handleDelete}>
        <View style={[styles.container, styles.folderModal]}>
          <MaterialCommunityIcons
            name="delete"
            size={iconSize}
            color={Color.Red}
          />
          <Text style={[styles.text, {color: colorTheme.textColor}]}>
            {strings.deleteFolder}
          </Text>
        </View>
      </MenuOption>
    </>
  ), [
    singleItem,
    iconSize,
    colorTheme.textColor,
    handleCreateSetClick,
    setEditBottomSheet,
    openBottomSheet,
    handleDelete,
  ]);

  return (
    <View style={styles.wrapper}>
      {type === 'Set' ? renderSetContent() : renderFolderContent()}
    </View>
  );
};

export default React.memo(ModalContent);

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
    color: Color.Black,
    fontFamily: Font.regular,
    textTransform: 'capitalize',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  folderModal: {
    borderBottomWidth: 0,
  },
});
