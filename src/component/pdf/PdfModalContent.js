import React, {useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Switch} from '@rneui/themed';
import Color from '../Color';
import Font from '../Font';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';
import {useSelector} from 'react-redux';

const PdfModalContent = ({
  closeModal,
  openBottomSheet,
  setEditBottomSheet,
  deletePdf,
  pdfId,
}) => {
  const navigation = useNavigation();
  const [value, setValue] = useState(false);

  const iconSize = useMemo(() => scale(20), []);
  const userIcon = useMemo(() => require('../../Assets/Img/userIcon.png'), []);
  const lockIcon = useMemo(() => require('../../Assets/Img/lock.png'), []);

  const renderBody = useMemo(
    () => (
      <View>
        <Pressable
          style={styles.container}
          onPress={() => {
            setEditBottomSheet(true);
            openBottomSheet();
          }}>
          <MaterialIcons name="edit" size={iconSize} color={Color.Black} />
          <Text style={styles.text}>Edit Folder</Text>
        </Pressable>
        <Pressable
          style={[styles.container]}
          onPress={() => {
            deletePdf(pdfId);
            closeModal();
          }}>
          <MaterialCommunityIcons
            name="delete"
            size={iconSize}
            color={Color.Red}
          />
          <Text style={styles.text}>Delete Folder</Text>
        </Pressable>
        <Pressable
          style={[styles.container, styles.lastItem]}
          onPress={() => {
            navigation.navigate(ScreenName.assignPdfFolder, {pdfId: pdfId});
            closeModal();
          }}>
          <Feather name="folder-plus" size={scale(15)} color={Color.Black} />
          <Text style={styles.text}>Assign Folder</Text>
        </Pressable>
      </View>
    ),
    [value, iconSize, userIcon, lockIcon],
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
    fontSize: scale(14),
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
