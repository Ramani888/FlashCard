import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../Color';
import Font from '../Font';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';

const PressableItem = ({icon, text, onPress, customTextStyle, isLast}) => (
  <Pressable
    style={[styles.container, isLast && styles.lastItem]}
    onPress={onPress}>
    {icon}
    <Text style={[styles.text, customTextStyle]}>{text}</Text>
  </Pressable>
);

const SetDetailModalContent = ({
  closeModal,
  cardTypeId,
  cardTypeName,
  folderId,
  setId,
  setLayout,
  layout,
  blurAllCard,
}) => {
  const navigation = useNavigation();

  return (
    <View>
      <PressableItem
        icon={
          <MaterialCommunityIcons
            name="swap-vertical"
            size={scale(15)}
            color={Color.Black}
          />
        }
        text="Change Order"
        onPress={closeModal}
      />
      <PressableItem
        icon={
          <MaterialCommunityIcons
            name="blur"
            size={scale(15)}
            color={Color.Black}
          />
        }
        text={'Blur All'}
        onPress={() => {
          blurAllCard(true);
          closeModal();
        }}
      />
      <PressableItem
        icon={<Entypo name="plus" size={scale(19)} color={Color.Black} />}
        text="Create Card"
        onPress={() => {
          navigation.navigate(ScreenName.createCard, {
            cardTypeId: cardTypeId,
            cardTypeName: cardTypeName,
            folderId: folderId,
            setId: setId,
          });
          closeModal();
        }}
        customTextStyle={{marginLeft: scale(-3)}}
      />
      <PressableItem
        icon={
          layout == 'single' ? (
            <Image
              source={require('../../Assets/Img/gridLayout.png')}
              style={styles.layoutIcon}
            />
          ) : (
            <Image
              source={require('../../Assets/Img/singleLayout.png')}
              style={styles.layoutIcon}
            />
          )
        }
        text="Layout"
        onPress={() => {
          layout == 'single' ? setLayout('grid') : setLayout('single');
          closeModal();
        }}
        customTextStyle={{marginLeft: scale(-3)}}
        isLast
      />
    </View>
  );
};

export default React.memo(SetDetailModalContent);

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
  layoutIcon: {width: scale(19), height: scale(19)},
});
