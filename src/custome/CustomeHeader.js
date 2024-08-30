import React from 'react';
import { StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import Color from '../component/Color';
import Font from '../component/Font';

const CustomeHeader = ({
  goBack,
  title,
  titleStyle,
  containerStyle,
  iconSize = scale(25),
  iconColor = Color.White,
  iconStyle,
  searchIcon,
  setSearch,
  search,
}) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.headerContainer, containerStyle]}>
      {goBack && (
        <Pressable
          onPress={navigation.goBack}
          style={[styles.iconContainer, iconStyle]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <AntDesign
            name="arrowleft"
            size={iconSize}
            color={iconColor}
          />
        </Pressable>
      )}
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      {searchIcon && (
        <Pressable style={styles.searchIcon} onPress={() => setSearch(!search)}>
          <AntDesign name="search1" size={scale(20)} color={Color.White} />
        </Pressable>
      )}
    </View>
  );
};

export default React.memo(CustomeHeader);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(60),
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    backgroundColor: Color.White,
  },
  iconContainer: {
    padding: scale(5),
    position: 'absolute',
    left: scale(10),
    zIndex: 1, // Ensure it appears above other elements
  },
  title: {
    fontSize: scale(15),
    color: Color.White,
    fontFamily: Font.medium,
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  searchIcon: {
    backgroundColor: Color.iconBackground,
    borderRadius: scale(5),
    position: 'absolute',
    right: scale(15),
    padding: scale(10),
  },
});
