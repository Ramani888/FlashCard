import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CustomeButton from '../../custome/CustomeButton';
import Color from '../Color';
import {scale, verticalScale} from 'react-native-size-matters';
import Font from '../Font';

const TimerComponent = () => {
  const [time, setTime] = useState(0); // Start at 0 seconds
  const [isRunning, setIsRunning] = useState(false);
  const refRBSheet = useRef();

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
  };

  // Convert seconds to HH:MM:SS format
  const formatTime = time => {
    const getSeconds = `0${time % 60}`.slice(-2);
    const minutes = Math.floor(time / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2);

    return {
      hours: getHours,
      minutes: getMinutes,
      seconds: getSeconds,
    };
  };

  const { hours, minutes, seconds } = formatTime(time);

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.timerHeading}>Set Timer</Text>
        <View style={styles.timerWrapper}>
          <Text style={styles.timerText}>{hours}:{minutes}:{seconds}</Text>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Hours</Text>
            <Text style={styles.labelText}>Minutes</Text>
            <Text style={styles.labelText}>Seconds</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <CustomeButton
            buttonColor={Color.theme1}
            buttonWidth={scale(150)}
            buttonHeight={scale(45)}
            title={'START'}
            borderRadius={scale(10)}
            fontSize={scale(15)}
            fontColor={Color.White}
            fontFamily={Font.semiBold}
            marginTop={verticalScale(15)}
            onPress={startTimer}
          />
          <CustomeButton
            buttonColor={Color.WhiteDefault}
            buttonWidth={scale(150)}
            buttonHeight={scale(45)}
            title={'STOP'}
            borderRadius={scale(10)}
            fontSize={scale(15)}
            fontColor={Color.theme1}
            fontFamily={Font.semiBold}
            marginTop={verticalScale(15)}
            onPress={stopTimer}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.White,
  },
  subContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  timerHeading: {
    fontSize: scale(22),
    color: Color.Black,
    fontFamily: Font.medium,
    marginTop: verticalScale(-25),
    marginBottom:verticalScale(10)
  },
  timerWrapper: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  timerText: {
    fontSize: scale(50),
    fontWeight: 'bold',
    color: Color.Black,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '48%',
    marginLeft:scale(25),
    marginTop: verticalScale(10),
  },
  labelText: {
    fontSize: scale(12),
    color: Color.Gray,
    fontFamily: Font.regular,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    gap: scale(15),
  },
});

export default TimerComponent;
