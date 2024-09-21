import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../Color';
import Font from '../Font';
import CustomeButton from '../../custome/CustomeButton';
import Calender from '../Calender';

const PushNotificationComponent = () => {
  const [time, setTime] = useState('AM');

  const renderBody = () => {
    return (
      <View style={styles.bodyContainer}>
        <Text style={styles.notificationHeading}>Set Push Notification</Text>
        <View
          style={{
            flexDirection: 'row',
            borderRadius: scale(10),
            alignSelf: 'center',
          }}>
          <CustomeButton
            buttonColor={time == 'AM' ? Color.theme1 : Color.WhiteDefault}
            buttonWidth={scale(50)}
            buttonHeight={scale(35)}
            title={'AM'}
            borderTopLeftRadius={scale(10)}
            borderBottomLeftRadius={scale(10)}
            fontSize={scale(12)}
            fontColor={time == 'AM' ? Color.White : Color.theme1}
            fontFamily={Font.medium}
            marginTop={verticalScale(5)}
            onPress={() => setTime('AM')}
          />
          <CustomeButton
            buttonColor={time == 'PM' ? Color.theme1 : Color.WhiteDefault}
            buttonWidth={scale(50)}
            buttonHeight={scale(35)}
            title={'PM'}
            borderTopRightRadius={scale(10)}
            borderBottomRightRadius={scale(10)}
            fontSize={scale(12)}
            fontColor={time == 'PM' ? Color.White : Color.theme1}
            fontFamily={Font.medium}
            marginTop={verticalScale(5)}
            onPress={() => setTime('PM')}
          />
        </View>
        <Text style={{fontSize:scale(55),color:Color.Black,textAlign:'center',marginVertical:verticalScale(8)}}>07:35</Text>
        <Calender/>

        <CustomeButton
          buttonColor={Color.theme1}
          buttonWidth={scale(310)}
          buttonHeight={scale(45)}
          title={'DONE'}
          borderRadius={scale(10)}
          fontSize={scale(15)}
          fontColor={Color.White}
          fontFamily={Font.semiBold}
          marginTop={verticalScale(15)}
        />
      </View>
    );
  };
  return <View style={styles.container}>{renderBody()}</View>;
};

export default PushNotificationComponent;

const styles = StyleSheet.create({
  container: {flex: 1},
  bodyContainer: {flex: 1,alignItems:'center'},
  notificationHeading: {
    fontSize: scale(22),
    color: Color.Black,
    fontFamily: Font.medium,
    marginBottom: verticalScale(10),
  },
});
