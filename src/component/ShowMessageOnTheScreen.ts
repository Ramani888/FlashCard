import {ToastAndroid, Platform, Alert} from 'react-native';

/**
 * Shows a message to the user using platform-appropriate toast/alert
 * @param message - The message to display to the user
 */
const showMessageonTheScreen = (message: string): void => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    // iOS fallback - could use a toast library later
    Alert.alert('', message);
  }
};

export default showMessageonTheScreen;
