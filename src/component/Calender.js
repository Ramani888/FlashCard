import React, { useState, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Color from './Color';
import { scale, verticalScale } from 'react-native-size-matters';
import Font from './Font';

const Calender = () => {
  const [selectedDays, setSelectedDays] = useState([]);

  // Toggle day selection
  const toggleDaySelection = useCallback((day) => {
    setSelectedDays(prevSelectedDays => {
      if (prevSelectedDays.includes(day)) {
        // If day is already selected, deselect it
        return prevSelectedDays.filter(selectedDay => selectedDay !== day);
      } else {
        // If day is not selected, add it to the selection
        return [...prevSelectedDays, day];
      }
    });
  }, []);

  const renderBody = useCallback(() => {
    const days = ['S', 'M', 'T', 'W', 'TH', 'F']; // Add more days as necessary

    return (
      <View style={styles.container}>
        {days.map(day => (
          <Pressable
            key={day}
            onPress={() => toggleDaySelection(day)}
            style={[
              styles.dayButton,
              {
                backgroundColor: selectedDays.includes(day)
                  ? Color.theme1
                  : Color.WhiteDefault,
              },
            ]}>
            <Text
              style={[
                styles.dayText,
                {
                  color: selectedDays.includes(day)
                    ? Color.White
                    : Color.mediumGray,
                },
              ]}>
              {day}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  }, [selectedDays, toggleDaySelection]);

  return <View>{renderBody()}</View>;
};

export default React.memo(Calender);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginLeft: scale(7),
  },
  dayButton: {
    padding: scale(15),
    paddingVertical: verticalScale(10),
    borderRadius: scale(5),
    marginRight: scale(7),
  },
  dayText: {
    fontSize: scale(13),
    textAlign: 'center',
    fontFamily: Font.medium,
  },
});
