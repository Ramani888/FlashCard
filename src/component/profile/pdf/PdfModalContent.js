import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../Color';
import Font from '../../Font';

const PdfModalContent = ({closeModal}) => {
  const renderBody = () => {
    return (
      <View>
        <Pressable
          style={styles.container}
          onPress={() => {
            // openUserNameBottomSheets();
            closeModal();
          }}>
          <MaterialIcons name="edit" size={scale(15)} color={Color.Black} />
          <Text style={styles.text}>Edit</Text>
        </Pressable>
        <Pressable
          style={styles.container}
          onPress={() => {
            closeModal();
          }}>
          <MaterialIcons name="delete" size={scale(15)} color={Color.Red} />
          <Text style={styles.text}>Delete</Text>
        </Pressable>
        <Pressable
          style={[
            styles.container,
            {borderBottomWidth: scale(0), marginBottom: verticalScale(-5)},
          ]}
          onPress={() => {
            // openUserNameBottomSheets();
            closeModal();
          }}>
          <Feather name="folder-plus" size={scale(15)} color={Color.Black} />
          <Text style={styles.text}>Assign Folder</Text>
        </Pressable>
      </View>
    );
  };
  return <View style={{flex:1}}>{renderBody()}</View>;
};

export default PdfModalContent;

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
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(10),
  },
});
