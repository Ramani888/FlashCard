import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../Color';
import Font from '../Font';

const SetDetailModalContent = ({closeModal, blurAllCards, allBlurred}) => {
  const renderBody = () => {
    return (
      <View>
        <Pressable
          style={styles.container}
          onPress={() => {
            closeModal();
          }}>
          <MaterialCommunityIcons
            name="swap-vertical"
            size={scale(15)}
            color={Color.Black}
          />
          <Text style={styles.text}>Change Order</Text>
        </Pressable>

        <Pressable
          style={styles.container}
          onPress={() => {
            blurAllCards();
            closeModal();
          }}>
          <MaterialCommunityIcons
            name="blur"
            size={scale(15)}
            color={Color.Black}
          />
          <Text style={styles.text}>
            {allBlurred ? 'Remove Blur' : 'Blur All'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.container}
          onPress={() => {
            closeModal();
          }}>
          <Entypo name="plus" size={scale(19)} color={Color.Black} />
          <Text style={[styles.text, {marginLeft: scale(-3)}]}>
            Create Card
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.container,
            {borderBottomWidth: scale(0), marginBottom: verticalScale(-5)},
          ]}
          onPress={() => {
            closeModal();
          }}>
          <Entypo name="grid" size={scale(19)} color={Color.Black} />
          <Text style={[styles.text, {marginLeft: scale(-3)}]}>Layout</Text>
        </Pressable>
      </View>
    );
  };
  return <View>{renderBody()}</View>;
};

export default SetDetailModalContent;

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
