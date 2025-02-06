import React, {useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../Color';
import Font from '../Font';
import {scale, verticalScale} from '../../custome/Responsive';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import strings from '../../language/strings';

const PdfModalContent = ({
  closeModal,
  type,
  openBottomSheet,
  setEditBottomSheet,
  deleteItem,
  pdfId,
  colorTheme,
}) => {
  const navigation = useNavigation();
  const iconSize = useMemo(() => scale(20), []);
  const userIcon = useMemo(() => require('../../Assets/Img/userIcon.png'), []);
  const lockIcon = useMemo(() => require('../../Assets/Img/lock.png'), []);

  const renderBody = useMemo(
    () => (
      <View>
        {type === 'Folder' ? (
          <View>
            <Pressable
              style={styles.container}
              onPress={() => {
                setEditBottomSheet(true);
                openBottomSheet();
                closeModal();
              }}>
              <MaterialIcons
                name="edit"
                size={iconSize}
                color={colorTheme.textColor}
              />
              <Text style={[styles.text, {color: colorTheme.textColor}]}>
                {strings.edit}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.container, styles.lastItem]}
              onPress={() => {
                deleteItem(pdfId);
                closeModal();
              }}>
              <MaterialCommunityIcons
                name="delete"
                size={iconSize}
                color={Color.Red}
              />
              <Text style={[styles.text, {color: colorTheme.textColor}]}>
                {strings.deleteFolder}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View>
            <Pressable
              style={styles.container}
              onPress={() => {
                setEditBottomSheet(true);
                openBottomSheet();
                closeModal();
              }}>
              <MaterialIcons
                name="edit"
                size={iconSize}
                color={colorTheme.textColor}
              />
              <Text style={[styles.text, {color: colorTheme.textColor}]}>
                {strings.edit}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.container]}
              onPress={() => {
                deleteItem(pdfId);
                closeModal();
              }}>
              <MaterialCommunityIcons
                name="delete"
                size={iconSize}
                color={Color.Red}
              />
              <Text style={[styles.text, {color: colorTheme.textColor}]}>
                {strings.delete}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.container, styles.lastItem]}
              onPress={() => {
                navigation.navigate(ScreenName.assignPdfFolder, {pdfId: pdfId});
                closeModal();
              }}>
              <Feather
                name="folder-plus"
                size={scale(15)}
                color={colorTheme.textColor}
              />
              <Text style={[styles.text, {color: colorTheme.textColor}]}>
                {strings.assignFolder}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    ),
    [
      iconSize,
      closeModal,
      colorTheme,
      deleteItem,
      navigation,
      setEditBottomSheet,
      pdfId,
      openBottomSheet,
      type,
    ],
  );

  return <View>{renderBody}</View>;
};

export default React.memo(PdfModalContent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: scale(5),
    borderBottomWidth: scale(0.7),
    borderBottomColor: Color.mediumGray,
    height: verticalScale(33),
  },
  text: {
    fontSize: wp('3.8%'),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(10),
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
    fontSize: scale(13),
    color: Color.Black,
    fontFamily: Font.regular,
  },
  icon: {
    width: scale(20),
    height: scale(20),
  },
  lastItem: {
    borderBottomWidth: 0,
    marginBottom: verticalScale(-5),
  },
});
