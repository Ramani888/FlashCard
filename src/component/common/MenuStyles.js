import {StyleSheet} from 'react-native';
import {scale, verticalScale} from '../../custome/Responsive';

/**
 * Standard icon size for all menu items
 * Import this constant to use consistent icon sizes
 */
export const MENU_ICON_SIZE = scale(17);

/**
 * Standard menu styles
 * Use these for consistent styling across all modal content components
 */
export const menuStyles = StyleSheet.create({
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
  // Common menu options container style
  menuOptionsContainer: {
    borderRadius: scale(8),
    padding: 0,
  },
});

/**
 * Reusable function to get menu options style with theme background
 * Use this in MenuOptions customStyles prop
 * 
 * @example
 * <MenuOptions customStyles={getMenuOptionsStyle(colorTheme.modelNewBackground)}>
 *   <YourModalContent {...props} />
 * </MenuOptions>
 * 
 * @param {string} backgroundColor - Background color from theme
 * @returns {Object} Style object for MenuOptions
 */
export const getMenuOptionsStyle = (backgroundColor) => ({
  optionsContainer: {
    ...menuStyles.menuOptionsContainer,
    backgroundColor,
  },
});
