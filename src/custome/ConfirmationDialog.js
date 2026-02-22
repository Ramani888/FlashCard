import React, {memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {moderateScale, scale, verticalScale} from './Responsive';
import Color from '../component/Color';
import CustomeButton from './CustomeButton';
import CustomeModal from './CustomeModal';
import useTheme from '../component/Theme';
import Font from '../component/Font';

/**
 * ConfirmationDialog Component
 * A reusable confirmation dialog that follows the project's theme
 * 
 * @param {boolean} isVisible - Controls the visibility of the dialog
 * @param {string} title - The title of the confirmation dialog
 * @param {string} message - The message/question to display
 * @param {function} onConfirm - Callback function when confirm button is pressed
 * @param {function} onCancel - Callback function when cancel button is pressed
 * @param {string} confirmText - Text for the confirm button (default: "Confirm")
 * @param {string} cancelText - Text for the cancel button (default: "Cancel")
 * @param {string} confirmButtonColor - Custom color for confirm button (default: theme1)
 * @param {string} cancelButtonColor - Custom color for cancel button (default: mediumGray)
 * @param {string} titleColor - Custom color for title (default: theme1)
 * @param {boolean} isDanger - If true, uses error/danger styling (red color)
 */
const ConfirmationDialog = memo(({
  isVisible,
  title = 'Confirm Action',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonColor,
  cancelButtonColor,
  titleColor,
  isDanger = false,
}) => {
  const colorTheme = useTheme();

  // Determine button colors based on isDanger prop
  const getConfirmColor = () => {
    if (confirmButtonColor) return confirmButtonColor;
    return isDanger ? Color.error : Color.theme1;
  };

  const getCancelColor = () => {
    if (cancelButtonColor) return cancelButtonColor;
    return Color.mediumGray;
  };

  const getTitleColor = () => {
    if (titleColor) return titleColor;
    return isDanger ? Color.error : Color.theme1;
  };

  return (
    <CustomeModal
      visible={isVisible}
      onClose={onCancel}
      closeModal={false}
      mainPadding={scale(5)}
      backgroundColor={colorTheme.modelBackground}
      content={
        <View
          style={[
            styles.container,
            {backgroundColor: colorTheme.modelBackgroundView},
          ]}>
          <Text
            style={[
              styles.title,
              {color: getTitleColor()},
            ]}>
            {title}
          </Text>
          <Text
            style={[
              styles.message,
              {color: colorTheme.textColor},
            ]}>
            {message}
          </Text>
          <View style={styles.btnView}>
            <CustomeButton
              title={cancelText}
              buttonWidth={'45%'}
              buttonHeight={verticalScale(35)}
              buttonColor={getCancelColor()}
              fontSize={moderateScale(14)}
              fontFamily={Font.semiBold}
              fontColor={Color.White}
              borderRadius={moderateScale(10)}
              marginTop={verticalScale(10)}
              marginBottom={verticalScale(10)}
              marginRight={scale(10)}
              textTransform={'uppercase'}
              onPress={onCancel}
            />
            <CustomeButton
              title={confirmText}
              buttonWidth={'45%'}
              buttonHeight={verticalScale(35)}
              buttonColor={getConfirmColor()}
              fontSize={moderateScale(14)}
              fontFamily={Font.semiBold}
              fontColor={Color.White}
              borderRadius={moderateScale(10)}
              marginTop={verticalScale(10)}
              marginBottom={verticalScale(10)}
              textTransform={'uppercase'}
              onPress={onConfirm}
            />
          </View>
        </View>
      }
    />
  );
});

ConfirmationDialog.displayName = 'ConfirmationDialog';

export default ConfirmationDialog;

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(15),
  },
  title: {
    fontSize: scale(18),
    fontFamily: Font.bold,
    textAlign: 'center',
    marginTop: verticalScale(10),
  },
  message: {
    fontSize: scale(15),
    fontFamily: Font.medium,
    textAlign: 'center',
    marginTop: verticalScale(10),
    marginHorizontal: scale(15),
    lineHeight: verticalScale(20),
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(10),
    width: '100%',
  },
});
