import {ToastAndroid} from 'react-native';

const showMessageonTheScreen = message => {
  ToastAndroid.show(message, ToastAndroid.SHORT);
};

export default showMessageonTheScreen;
