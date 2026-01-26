import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {MenuOption} from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {Divider} from '@rneui/themed/dist/Divider';
import Color from '../Color';
import Font from '../Font';
import {scale, verticalScale, moderateScale} from '../../custome/Responsive';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';
import strings from '../../language/strings';

const ImageModalContent = ({
  type,
  openBottomSheet,
  setEditBottomSheet,
  deleteItem,
  imageId,
  colorTheme,
}) => {
  const navigation = useNavigation();

  const iconSize = useMemo(() => scale(20), []);

  const renderBody = useMemo(
    () => (
      <View style={styles.wrapper}>
        {type === 'Folder' ? (
          <View>
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
                  {strings.edit}
                </Text>
              </View>
            </MenuOption>
            <Divider />
            <MenuOption
              onSelect={() => {
                deleteItem(imageId);
              }}>
              <View style={[styles.container, styles.lastItem]}>
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
          </View>
        ) : (
          <View>
            <MenuOption
              onSelect={() => {
                deleteItem(imageId);
              }}>
              <View style={styles.container}>
                <MaterialCommunityIcons
                  name="delete"
                  size={iconSize}
                  color={Color.Red}
                />
                <Text style={[styles.text, {color: colorTheme.textColor}]}>
                  {strings.delete}
                </Text>
              </View>
            </MenuOption>
            <Divider />
            <MenuOption
              onSelect={() => {
                navigation.navigate(ScreenName.assignImageFolder, {
                  imageId: imageId,
                });
              }}>
              <View style={[styles.container, styles.lastItem]}>
                <Feather
                  name="folder-plus"
                  size={scale(15)}
                  color={colorTheme.textColor}
                />
                <Text style={[styles.text, {color: colorTheme.textColor}]}>
                  {strings.assignFolder}
                </Text>
              </View>
            </MenuOption>
          </View>
        )}
      </View>
    ),
    [
      iconSize,
      colorTheme,
      deleteItem,
      imageId,
      navigation,
      openBottomSheet,
      setEditBottomSheet,
      type,
    ],
  );

  return <View>{renderBody}</View>;
};

export default React.memo(ImageModalContent);

const styles = StyleSheet.create({
  wrapper: {
    padding: scale(12),
    display: 'flex',
    flexDirection: 'column',
    gap: verticalScale(4),
  },
  container: {
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
    marginVertical: verticalScale(5),
  },
  switchContent: {
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: moderateScale(13),
    color: Color.Black,
    fontFamily: Font.regular,
  },
  icon: {
    width: scale(20),
    height: scale(20),
  },
  lastItem: {
  },
});
