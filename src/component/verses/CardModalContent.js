import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../Color';
import Font from '../Font';

// Reusable Pressable Item Component
const PressableItem = ({icon, iconStyle, text, onPress, isLast}) => (
  <Pressable
    style={[styles.container, isLast && styles.lastItem]}
    onPress={onPress}>
    {icon}
    <Text style={styles.text}>{text}</Text>
  </Pressable>
);

const CardModalContent = ({closeModal}) => {
  return (
    <View>
      <PressableItem
        icon={<MaterialIcons name="edit" size={scale(15)} color={Color.Black} />}
        text="Edit"
        onPress={closeModal}
      />
      <PressableItem
        icon={
          <MaterialCommunityIcons
            name="delete"
            size={scale(15)}
            color={Color.Red}
          />
        }
        text="Delete"
        onPress={closeModal}
      />
      <PressableItem
        icon={
          <Image
            source={require('../../Assets/Img/moveFolder.png')}
            style={styles.iconImage}
          />
        }
        text="Move"
        onPress={closeModal}
        isLast={true} // Indicate that this is the last item
      />
    </View>
  );
};

export default React.memo(CardModalContent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: scale(5),
    borderBottomWidth: scale(0.7),
    borderBottomColor: Color.mediumGray,
    height: verticalScale(33),
  },
  lastItem: {
    borderBottomWidth: 0,
    marginBottom: verticalScale(-5),
  },
  text: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(10),
  },
  iconImage: {
    width: scale(16),
    height: scale(16),
  },
});