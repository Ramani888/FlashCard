import {Alert, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {MenuOption} from 'react-native-popup-menu';
import {Divider} from '@rneui/themed/dist/Divider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scale, verticalScale} from '../../../custome/Responsive';
import Color from '../../Color';
import Font from '../../Font';
import {launchImageLibrary} from 'react-native-image-picker';
import strings from '../../../language/strings';

const ProfileModalContent = ({
  openUserNameBottomSheets,
  openEmailBottomSheets,
  updateProfilePic,
  handleLogout,
  colorTheme,
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
      }
    } catch (error) {
      console.log('Error picking image: ', error);
      Alert.alert('Error', 'Something went wrong while picking the image');
    }
  };

  const renderBody = () => {
    return (
      <View style={styles.wrapper}>
        <MenuOption
          onSelect={() => {
            pickImage();
          }}>
          <View style={styles.container}>
            <FontAwesome
              name="photo"
              size={scale(15)}
              color={colorTheme.textColor}
            />
            <Text style={[styles.text, {color: colorTheme.textColor}]}>
              {strings.picture}
            </Text>
          </View>
        </MenuOption>
        <Divider />
        <MenuOption
          onSelect={() => {
            handleLogout();
          }}>
          <View style={[styles.container, styles.lastItem]}>
            <MaterialCommunityIcons
              name="logout"
              size={scale(16)}
              color={Color.Red}
            />
            <Text style={[styles.text, {color: Color.Red}]}>
              {strings.logout}
            </Text>
          </View>
        </MenuOption>
      </View>
    );
  };
  return <View>{renderBody()}</View>;
};

export default ProfileModalContent;

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
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
});
