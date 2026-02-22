import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {MenuOption} from 'react-native-popup-menu';
import {Divider} from '@rneui/themed';
import {scale, verticalScale} from '../../custome/Responsive';
import Font from '../Font';
import Color from '../Color';

// Standard icon size for all menu items
export const MENU_ICON_SIZE = scale(17);

/**
 * Reusable menu option item component
 * Use this for consistent menu items across all modal content components
 * 
 * @example
 * <MenuOptionItem
 *   icon={<MaterialIcons name="edit" size={MENU_ICON_SIZE} color={colorTheme.textColor} />}
 *   label={strings.edit}
 *   onPress={() => handleEdit(item)}
 *   textColor={colorTheme.textColor}
 * />
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon component (MaterialIcons, Entypo, etc.)
 * @param {string} props.label - Text label for the option
 * @param {Function} props.onPress - Callback when item is selected
 * @param {string} props.textColor - Color for the text (from theme)
 * @param {boolean} props.isDanger - Use danger/red color for text (for delete, remove actions)
 * @param {boolean} props.isDisabled - Disable the menu option
 * @param {boolean} props.showDivider - Show divider after this item (default: true)
 */
const MenuOptionItem = ({
  icon,
  label,
  onPress,
  textColor,
  isDanger = false,
  isDisabled = false,
  showDivider = true,
}) => {
  return (
    <>
      <MenuOption onSelect={onPress} disabled={isDisabled}>
        <View style={styles.container}>
          {icon}
          <Text 
            style={[
              styles.text, 
              {color: isDanger ? Color.Red : textColor}
            ]}
          >
            {label}
          </Text>
        </View>
      </MenuOption>
      {showDivider && <Divider />}
    </>
  );
};

export default memo(MenuOptionItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  text: {
    fontSize: scale(14),
    fontFamily: Font.regular,
  },
});
