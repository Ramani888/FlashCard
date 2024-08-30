import React, { useRef } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import Color from '../component/Color';
import Font from '../component/Font';
import { Avatar } from '@rneui/themed';

const CustomeHeader = ({
  goBack,
  title,
  profileImage,
  edit,
  titleStyle,
  containerStyle,
  avtarContainerStyle,
  iconSize = scale(25),
  iconColor = Color.White,
  iconStyle,
  searchIcon,
  setSearch,
  search,
  openEditModal,
  setEditRef,
}) => {
  const navigation = useNavigation();
  const editRef = useRef(null);

  // React.useEffect(() => {
  //   setEditRef(editRef); // Ensure ref is set in parent component
  // }, [setEditRef]);

  return (
    <View style={[styles.headerContainer, containerStyle]}>
      {goBack && (
        <Pressable
          onPress={navigation.goBack}
          style={[styles.iconContainer, iconStyle]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <AntDesign name="arrowleft" size={iconSize} color={iconColor} />
        </Pressable>
      )}
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      {profileImage && (
        <Pressable style={styles.avtarContainer}>
          <Avatar
            size="large"
            rounded
            source={{ uri: 'https://example.com/avatar.jpg' }}
            title="JD"
            containerStyle={styles.avatar}
          />
        </Pressable>
      )}
      {searchIcon && (
        <Pressable
          style={[styles.searchIcon, avtarContainerStyle]}
          onPress={() => setSearch(!search)}>
          <AntDesign name="search1" size={scale(20)} color={Color.White} />
        </Pressable>
      )}
      {edit && (
        <Pressable
          ref={editRef}
          style={styles.editIcon}
          onPress={() => openEditModal(editRef)}>
          <AntDesign name="edit" size={scale(20)} color={Color.White} />
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
  avtarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    top: verticalScale(15),
  },
  avatar: {
    backgroundColor: '#BDBDBD',
  },
  editIcon: {
    position: 'absolute',
    right: scale(15),
  },
});
