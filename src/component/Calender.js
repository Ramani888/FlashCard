import React, {useState, useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Color from './Color';
import { scale, verticalScale } from 'react-native-size-matters';
import Font from './Font';

const Calender = () => {
  const [selectedDay, setSelectedDay] = useState('S');

  const renderBody = useCallback(() => {
    const days = ['S', 'M', 'T', 'W', 'TH', 'F']; // You can add more days if needed.

    return (
      <View style={styles.container}>
        {days.map(day => (
          <Pressable
            key={day}
            onPress={() => setSelectedDay(day)}
            style={[
              styles.dayButton,
              {
                backgroundColor:
                  selectedDay === day ? Color.theme1 : Color.WhiteDefault,
              },
            ]}>
            <Text
              style={[
                styles.dayText,
                {
                  color: selectedDay === day ? Color.White : Color.mediumGray,
                },
              ]}>
              {day}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  }, [selectedDay]);

  return <View>{renderBody()}</View>;
};

export default Calender;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf:'center',
    marginLeft:scale(7)
  },
  dayButton: {
    padding: scale(15),
    paddingVertical:verticalScale(10),
    borderRadius: scale(5),
    marginRight:scale(7)
  },
  dayText: {
    fontSize: scale(13), // `scale` function omitted for simplicity, add if necessary
    textAlign: 'center',
    fontFamily:Font.medium
  },
});
