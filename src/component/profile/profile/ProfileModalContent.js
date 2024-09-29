import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../Color';
import Font from '../../Font';
import {launchImageLibrary} from 'react-native-image-picker';

const ProfileModalContent = ({
  closeModal,
  openUserNameBottomSheets,
  openEmailBottomSheets,
  updateProfilePic,
}) => {
  const pickImage = async () => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 1,
        maxWidth: 800,
        maxHeight: 800,
      };

      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorMessage) {
        console.log('ImagePicker Error: ', result.errorMessage);
        Alert.alert('Error', result.errorMessage);
      } else {
        const data = result.assets;
        const file = {
          uri: data[0].uri,
          type: data[0].type,
          name: data[0].fileName,
        };
        updateProfilePic(file);
        // console.log('Image selected: ', file);
      }
    } catch (error) {
      console.log('Error picking image: ', error);
      Alert.alert('Error', 'Something went wrong while picking the image');
    }
  };

  const renderBody = () => {
    return (
      <View>
        <Pressable
          style={[
            styles.container,
            {borderBottomWidth: scale(0), marginBottom: verticalScale(-5)},
          ]}
          onPress={() => {
            pickImage();
            closeModal();
          }}>
          <FontAwesome name="photo" size={scale(15)} color={Color.Black} />
          <Text style={styles.text}>Picture</Text>
        </Pressable>

        {/* <Pressable
          style={styles.container}
          onPress={() => {
            openUserNameBottomSheets();
            closeModal();
          }}>
          <MaterialIcons name="edit" size={scale(15)} color={Color.Black} />
          <Text style={styles.text}>Username</Text>
        </Pressable> */}

        {/* <Pressable
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
        </Pressable> */}
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
