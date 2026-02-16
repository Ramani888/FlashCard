import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import {MenuOption} from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scale, verticalScale} from '../../../custome/Responsive';
import Color from '../../Color';
import Font from '../../Font';
import strings from '../../../language/strings';

const ProfileModalContent = ({
  handleLogout,
  colorTheme,
}) => {
  const onLogoutPress = useCallback(() => {
    handleLogout();
  }, [handleLogout]);

  return (
    <View style={styles.wrapper}>
      <MenuOption onSelect={onLogoutPress}>
        <View style={styles.container}>
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

export default React.memo(ProfileModalContent);

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
});

