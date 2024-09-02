import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Color from '../../component/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import CustomeHeader from '../../custome/CustomeHeader';

const NotesScreen = () => {
  const renderHeader = () => {
    return (
      <CustomeHeader
        goBack={true}
        title={'Notes'}
        iconColor={Color.White}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
      />
    );
  };

  const renderBody = () => {
    return <View></View>;
  };

  return (
    <View style={{flex: 1}}>
      <StatusBar translucent backgroundColor="transparent" />
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

export default React.memo(NotesScreen);

const styles = StyleSheet.create({
  headerStyle: {
    height: verticalScale(90),
   alignItems:'flex-end',
  },
  headerTitleStyle: {color: Color.White, fontSize: scale(20)},
  gradientStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: verticalScale(70), // Adjust to match header height or more
  },
});
