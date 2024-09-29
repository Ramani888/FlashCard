import React, {useState, useCallback, useEffect} from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../Color';

const colors = [
  '#FFFFFF',
  '#a378ff',
  '#ea80fc',
  '#ff8a80',
  '#1de9b6',
  '#25c6da',
  '#81dbfe',
  '#438afe',
  '#81b0fd',
  '#bdbdbd',
  '#ff9f7f',
  '#ffd27f',
];

const {width, height} = Dimensions.get('window');

const ColorCodePicker = ({setSelectedColor, selectedColor}) => {
  useEffect(() => {
    setSelectedColor(
      selectedColor === undefined || selectedColor === ''
        ? colors[1]
        : selectedColor,
    );
  }, [selectedColor]);

  const renderItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={[
          styles.colorBox,
          {backgroundColor: item},
          selectedColor === item && styles.selectedColor,
        ]}
        onPress={() => setSelectedColor(item)}></TouchableOpacity>
    ),
    [selectedColor],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={colors}
        renderItem={renderItem}
        keyExtractor={item => item}
        numColumns={6}
        key={'_'}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: scale(10),
    backgroundColor: Color.WhiteDefault,
    padding: scale(3),
    marginTop: height * 0.02,
    borderRadius: scale(10),
  },
  colorBox: {
    width: width * 0.09,
    height: height * 0.05,
    margin: scale(5),
    borderRadius: scale(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: scale(1),
    borderColor: '#ccc',
  },
  selectedColor: {
    borderColor: '#000',
    borderWidth: scale(2),
  },
  checkmark: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: '#fff',
    position: 'absolute',
    top: scale(5),
    right: scale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorText: {
    textAlign: 'center',
    marginTop: verticalScale(10),
    fontSize: scale(14),
    color: '#000',
  },
  row: {
    justifyContent: 'space-around',
  },
});

export default ColorCodePicker;
