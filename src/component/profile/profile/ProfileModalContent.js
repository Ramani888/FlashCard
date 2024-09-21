import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../Color';
import Font from '../../Font';

const ProfileModalContent = ({
  closeModal,
  openUserNameBottomSheets,
  openEmailBottomSheets,
}) => {
  const renderBody = () => {
    return (
      <View>
        <Pressable
          style={styles.container}
          onPress={() => {
            closeModal();
          }}>
          <FontAwesome name="photo" size={scale(15)} color={Color.Black} />
          <Text style={styles.text}>Picture</Text>
        </Pressable>

        <Pressable
          style={styles.container}
          onPress={() => {
            openUserNameBottomSheets();
            closeModal();
          }}>
          <MaterialIcons name="edit" size={scale(15)} color={Color.Black} />
          <Text style={styles.text}>Username</Text>
        </Pressable>

        <Pressable
          style={[
            styles.container,
            {borderBottomWidth: scale(0), marginBottom: verticalScale(-5)},
          ]}
          onPress={() => {
            openEmailBottomSheets();
            closeModal();
          }}>
          <MaterialCommunityIcons
            name="email-outline"
            size={scale(19)}
            color={Color.Black}
          />
          <Text style={[styles.text, {marginLeft: scale(-3)}]}>Email</Text>
        </Pressable>
      </View>
    );
  };
  return <View>{renderBody()}</View>;
};

export default ProfileModalContent;

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
