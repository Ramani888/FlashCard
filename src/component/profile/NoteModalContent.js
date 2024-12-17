import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scale, verticalScale} from '../../custome/Responsive';
import Color from '../Color';
import Font from '../Font';
import strings from '../../language/strings';

const NoteModalContent = ({
  item,
  closeModal,
  openBottomSheet,
  setEditBottomSheet,
  deleteData,
  colorTheme
}) => {
  const renderBody = () => {
    return (
      <View>
        <Pressable
          style={styles.container}
          onPress={() => {
            setEditBottomSheet(true);
            openBottomSheet();
            closeModal();
          }}>
          <MaterialIcons name="edit" size={scale(15)} color={colorTheme.textColor} />
          <Text style={[styles.text,{color:colorTheme.textColor}]}>{strings.edit}</Text>
        </Pressable>

        <Pressable
          style={[
            styles.container,
            {borderBottomWidth: scale(0), marginBottom: verticalScale(-2)},
          ]}
          onPress={() => {
            deleteData(item?._id);
            closeModal();
          }}>
          <MaterialCommunityIcons
            name="delete"
            size={scale(15)}
            color={Color.Red}
          />
          <Text style={[styles.text,{color:colorTheme.textColor}]}>{strings.delete}</Text>
        </Pressable>
      </View>
    );
  };
  return <View>{renderBody()}</View>;
};

export default NoteModalContent;

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
});
