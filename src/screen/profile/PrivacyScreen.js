import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import CustomeHeader from '../../custome/CustomeHeader';
import Color from '../../component/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import Font from '../../component/Font';

const PrivacyScreen = () => {
  const renderHeader = useCallback(() => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={'PRIVACY & TERMS'}
        iconColor={Color.Black}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
      />
    );
  }, []);

  const renderBody = useCallback(() => {
    return (
      <View style={styles.bodyContainer}>
        <Text style={styles.bodyText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </Text>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

export default React.memo(PrivacyScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    backgroundColor: Color.transparent,
    height: verticalScale(90),
    alignItems: 'flex-end',
  },
  headerTitleStyle: {
    color: Color.Black,
    fontSize: scale(20),
  },
  bodyContainer: {
    margin: scale(15),
    padding: scale(10),
    backgroundColor: Color.White,
    borderRadius: scale(10),
  },
  bodyText: {
    fontSize: scale(13),
    fontFamily: Font.regular,
    color: Color.Black,
  },
});
