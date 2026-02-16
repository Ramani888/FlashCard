import {View, Modal, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {scale} from 'react-native-size-matters';
import {UIActivityIndicator} from 'react-native-indicators';
import Color from './Color';

interface LoaderProps {
  visible: boolean;
  color?: string;
}

const Loader = memo<LoaderProps>(({visible, color}) => {
  // Early return if not visible to avoid unnecessary rendering
  if (!visible) return null;

  return (
    <Modal transparent={true} animationType="none" visible={visible}>
      <View style={styles.loaderContainer}>
        <UIActivityIndicator
          color={color || Color.theme2}
          animating={visible}
          size={scale(30)}
        />
      </View>
    </Modal>
  );
});

Loader.displayName = 'Loader';

export default Loader;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
