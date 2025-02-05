import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {scale, verticalScale} from '../../custome/Responsive';
import Color from '../Color';
import Font from '../Font';
import {ScreenName} from '../Screen';
import {useNavigation} from '@react-navigation/native';
import strings from '../../language/strings';

const AddNoteModalContent = ({item, folderId, setId, themeColor}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(ScreenName.createCard, {
      initialData: item,
      folderId: folderId,
      setId: setId,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.noneText, {color: themeColor.textColor}]}>
        {strings.none}
      </Text>
      <View style={styles.divider} />
      <Pressable onPress={handlePress} style={styles.dotIconView}>
        <Entypo
          name="plus"
          size={scale(20)}
          color={Color.White}
          style={styles.dotsIcon}
        />
      </Pressable>
    </View>
  );
};

export default AddNoteModalContent;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  noneText: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    textAlign: 'center',
  },
  divider: {
    borderBottomWidth: scale(0.5),
    borderBottomColor: Color.LightGray,
    paddingTop: verticalScale(5),
    width: '100%',
  },
  dotIconView: {
    alignItems: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(5),
  },
  dotsIcon: {
    backgroundColor: Color.theme1,
    borderRadius: scale(5),
    padding: scale(4),
  },
});
