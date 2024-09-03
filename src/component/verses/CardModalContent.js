import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../Color';
import Font from '../Font';

const CardModalContent = ({closeModal}) => {
  const renderBody = () => {
    return (
      <View>
        <Pressable
          style={styles.container}
          onPress={() => {
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
          <MaterialCommunityIcons
            name="delete"
            size={scale(15)}
            color={Color.Red}
          />
          <Text style={styles.text}>Delete</Text>
        </Pressable>

        <Pressable
          style={[
            styles.container,
            {borderBottomWidth: scale(0), marginBottom: verticalScale(-5)},
          ]}
          onPress={() => {
            closeModal();
          }}>
          <Image
            source={require('../../Assets/Img/moveFolder.png')}
            style={{width: scale(16), height: scale(16)}}
          />
          <Text style={styles.text}>Move</Text>
        </Pressable>
      </View>
    );
  };
  return <View>{renderBody()}</View>;
};

export default CardModalContent;

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
