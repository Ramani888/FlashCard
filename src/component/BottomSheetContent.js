import React, {useMemo, useState, useCallback, useEffect} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Color from './Color';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import CustomeButton from '../custome/CustomeButton';
import Font from './Font';
import CustomeInputField from '../custome/CustomeInputField';
import {Switch} from '@rneui/themed';
import ColorCodePicker from './cards/ColorCodePicker';
import showMessageonTheScreen from './ShowMessageOnTheScreen';

const {width, height} = Dimensions.get('window');

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

const BottomSheetContent = ({
  closeBottomSheet,
  title,
  name,
  setName,
  status,
  setStatus,
  color,
  setColor,
  setColorView,
  colorView,
  create,
  initialData,
}) => {
  useEffect(() => {
    if (initialData) {
      setName(initialData?.name);
      setColor(initialData?.color);
      initialData?.isHighlight ? setColorView(true) : setColorView(false);
    }
  }, [initialData]);

  const iconSize = useMemo(() => scale(20), []);
  const userIcon = useMemo(() => require('../Assets/Img/userIcon.png'), []);
  const lockIcon = useMemo(() => require('../Assets/Img/lock.png'), []);

  const toggleSwitch = () => setStatus(status => (status === 0 ? 1 : 0));

  const handleSubmit = () => {
    if (name && status !== null && color) {
      create();
      closeBottomSheet();
      setName('');
      setStatus('');
      setColor('');
      setColorView(false);
    } else {
      showMessageonTheScreen('All fields are required');
    }
  };

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
          inputContainerStyles={styles.inputContainer}
          inputStyles={styles.inputStyles}
        />

        {title !== 'CREATE NOTES' &&
          title !== 'EDIT NOTES' &&
          title !== 'CREATE FOLDER' &&
          title !== 'EDIT FOLDER' && (
            <View style={styles.switchContainer}>
              <View style={styles.switchContent}>
                <Image source={userIcon} style={styles.icon} />
                <Text style={styles.switchLabel}>Public</Text>
              </View>

              <Switch
                value={status === 1}
                onValueChange={toggleSwitch}
                color={status === 1 ? '#FF0000' : '#4CAF50'}
                trackColor={{false: '#d3d3d3', true: '#d3d3d3'}}
                thumbColor={status === 1 ? '#FF0000' : '#4CAF50'}
              />

              <View style={styles.switchContent}>
                <Image source={lockIcon} style={styles.icon} />
                <Text style={styles.switchLabel}>Private</Text>
              </View>
            </View>
          )}

        <View style={styles.colorSection}>
          <Text style={styles.colorTitle}>Color</Text>
          <View style={styles.separator} />

          <View style={styles.colorOptionsContainer}>
            <Pressable
              style={[
                styles.colorOption,
                {
                  borderWidth: !colorView ? scale(1.8) : scale(1),
                  borderColor: !colorView ? Color.Black : Color.LightGray,
                },
              ]}
              onPress={() => setColorView(false)}>
              <Text style={[styles.colorIndicator, {backgroundColor: color}]} />
            </Pressable>
            <Text style={styles.orText}>Or</Text>
            <Pressable
              style={[
                styles.colorOptionLarge,
                {
                  backgroundColor: color,
                  borderWidth: colorView ? scale(1.8) : scale(1),
                  borderColor: colorView ? Color.Black : Color.LightGray,
                },
              ]}
              onPress={() => setColorView(true)}
            />
          </View>

          <ColorCodePicker setSelectedColor={setColor} selectedColor={color} />
        </View>
      </View>
    ),
    [
      name,
      color,
      setStatus,
      title,
      userIcon,
      lockIcon,
      toggleSwitch,
      setColorView,
      colorView,
    ],
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderBody}
      <CustomeButton
        buttonColor={Color.theme1}
        buttonWidth="100%"
        title="DONE"
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={Color.White}
        fontFamily={Font.semiBold}
        marginTop={verticalScale(15)}
        marginBottom={verticalScale(8)}
        onPress={handleSubmit}
      />
    </ScrollView>
  );
};

export default React.memo(BottomSheetContent);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(15),
    height: verticalScale(400),
  },
  bodyContainer: {
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    borderRadius: scale(10),
    padding: scale(10),
  },
  title: {
    fontSize: scale(20),
    color: Color.Black,
    fontFamily: Font.medium,
    textAlign: 'center',
    paddingBottom: height * 0.01,
  },
  separator: {
    borderBottomWidth: scale(1),
    borderBottomColor: Color.LightGray,
  },
  inputContainer: {
    width: '100%',
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    paddingHorizontal: scale(8),
    backgroundColor: Color.White,
    borderRadius: scale(10),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
    height: verticalScale(45),
  },
  inputStyles: {
    height: verticalScale(45),
    fontSize: scale(13),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(5),
  },
  switchContainer: {
    width: width * 0.6,
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
    width: width * 0.07,
    height: height * 0.04,
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
    width: width * 0.36,
    height: height * 0.06,
    justifyContent: 'center',
  },
  colorIndicator: {
    width: scale(13),
    height: height * 0.05,
    borderRadius: scale(8),
    marginLeft: scale(5),
  },
  colorOptionLarge: {
    height: height * 0.06,
    width: width * 0.36,
    borderWidth: scale(1),
    borderRadius: scale(10),
    borderColor: Color.LightGray,
  },
  orText: {
    fontSize: scale(16),
    color: Color.Black,
    fontFamily: Font.medium,
  },
});
