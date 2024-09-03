import React, {useMemo, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Color from './Color';
import {scale, verticalScale} from 'react-native-size-matters';
import CustomeButton from '../custome/CustomeButton';
import Font from './Font';
import CustomeInputField from '../custome/CustomeInputField';
import {Switch} from '@rneui/themed';
import ColorCodePicker from './verses/ColorCodePicker';

const BottomSheetContent = ({closeBottomSheet, title}) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState(false);
  console.log('value',value)
  const [selectedColor, setSelectedColor] = useState(null);

  const iconSize = useMemo(() => scale(20), []);
  const userIcon = useMemo(() => require('../Assets/Img/userIcon.png'), []);
  const lockIcon = useMemo(() => require('../Assets/Img/lock.png'), []);

  const renderBody = useMemo(
    () => (
      <View style={styles.bodyContainer}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.separator} />

        <CustomeInputField
          placeholder="Create Name"
          placeholderTextColor={Color.mediumGray}
          onChangeText={setName}
          value={name}
          borderWidth={1}
          borderColor={Color.LightGray}
          height={verticalScale(45)}
          marginTop={verticalScale(10)}
          width="100%"
        />

        <View style={styles.switchContainer}>
          <View style={styles.switchContent}>
            <Image source={userIcon} style={styles.icon} />
            <Text style={styles.switchLabel}>Public</Text>
          </View>

          <Switch
            value={value}
            onValueChange={setValue}
            thumbColor={value ? Color.theme1 : '#8E9494'}
            trackColor={{false: '#E7EAEB', true: Color.theme2}}
          />

          <View style={styles.switchContent}>
            <Image source={lockIcon} style={styles.icon} />
            <Text style={styles.switchLabel}>Private</Text>
          </View>
        </View>

        <View style={styles.colorSection}>
          <Text style={styles.colorTitle}>Color</Text>

          <View style={styles.separator} />

          <View style={styles.colorOptionsContainer}>
            <View style={styles.colorOption}>
              <Text
                style={[
                  styles.colorIndicator,
                  {backgroundColor: selectedColor},
                ]}></Text>
            </View>
            <Text
              style={{
                fontSize: scale(16),
                color: Color.Black,
                fontFamily: Font.medium,
              }}>
              Or
            </Text>
            <View
              style={[
                styles.colorOptionLarge,
                {backgroundColor: selectedColor},
              ]}></View>
          </View>
          <ColorCodePicker
            setSelectedColor={setSelectedColor}
            selectedColor={selectedColor}
          />
        </View>
      </View>
    ),
    [value, name, userIcon, lockIcon, selectedColor], // Dependencies for useMemo
  );

  return (
    <View style={styles.container}>
      {renderBody}
      <CustomeButton
        buttonColor={Color.theme1}
        buttonWidth="100%"
        buttonHeight={scale(45)}
        title="DONE"
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={Color.White}
        fontFamily={Font.semiBold}
        marginTop={verticalScale(15)}
        onPress={() => closeBottomSheet()}
      />
    </View>
  );
};

export default React.memo(BottomSheetContent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: scale(15),
  },
  bodyContainer: {
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    borderRadius: scale(10),
    height: verticalScale(405),
    padding: scale(10),
  },
  title: {
    fontSize: scale(20),
    color: Color.Black,
    fontFamily: Font.medium,
    textAlign: 'center',
    paddingBottom: verticalScale(8),
  },
  separator: {
    borderBottomWidth: scale(1),
    borderBottomColor: Color.LightGray,
  },
  switchContainer: {
    width: scale(200),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: verticalScale(5),
  },
  switchContent: {
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: scale(13),
    color: Color.Black,
    fontFamily: Font.regular,
  },
  icon: {
    width: scale(30),
    height: scale(30),
  },
  colorSection: {
    marginTop: verticalScale(10),
  },
  colorTitle: {
    fontSize: scale(20),
    color: Color.Black,
    fontFamily: Font.medium,
    textAlign: 'center',
    paddingBottom: verticalScale(5),
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(13),
  },
  colorOption: {
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    borderRadius: scale(10),
    width: scale(130),
    height: verticalScale(40),
    justifyContent: 'center',
  },
  colorIndicator: {
    width: scale(13),
    height: verticalScale(30),
    borderRadius: scale(8),
    marginLeft: scale(5),
  },
  colorOptionLarge: {
    height: verticalScale(40),
    // backgroundColor: Color.Green,
    borderRadius: scale(10),
    width: scale(130),
  },
});

// #a378ff
// #ea80fc
// #ff8a80
// #1de9b6
// #25c6da

// #81dbfe
// #438afe
// #81b0fd

// #bdbdbd

// #ff9f7f

// #ffd27f
