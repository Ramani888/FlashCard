import React, {useMemo, useCallback, useEffect} from 'react';
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
import {scale, verticalScale} from '../custome/Responsive';
import CustomeButton from '../custome/CustomeButton';
import Font from './Font';
import CustomeInputField from '../custome/CustomeInputField';
import {Switch} from '@rneui/themed';
import ColorCodePicker from './cards/ColorCodePicker';
import showMessageonTheScreen from './ShowMessageOnTheScreen';
import useTheme from './Theme';
import strings from '../language/strings';

const {width, height} = Dimensions.get('window');

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
  const colorTheme = useTheme();

  useEffect(() => {
    if (initialData) {
      setName(initialData?.name);
      setColor(initialData?.color);
      initialData?.isHighlight ? setColorView(true) : setColorView(false);
    }
  }, [initialData, setColor, setColorView, setName]);

  const iconSize = useMemo(() => scale(20), []);
  const userIcon = useMemo(() => require('../Assets/Img/userIcon.png'), []);
  const lockIcon = useMemo(() => require('../Assets/Img/lock.png'), []);

  const toggleSwitch = useCallback(
    () => setStatus(status => (status === 0 ? 1 : 0)),
    [setStatus],
  );

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
        <Text style={[styles.title, {color: colorTheme.textColor}]}>
          {title}
        </Text>
        <View style={styles.separator} />

        <CustomeInputField
          placeholder={strings.createName}
          placeholderTextColor={Color.mediumGray}
          onChangeText={setName}
          value={name}
          borderWidth={1}
          borderColor={Color.LightGray}
          inputContainerStyles={styles.inputContainer}
          inputStyles={[styles.inputStyles, {color: colorTheme.textColor}]}
          backgroundColor={colorTheme.listAndBoxColor}
        />

        {title !== 'CREATE NOTES' &&
          title !== 'EDIT NOTES' &&
          title !== 'CREATE FOLDER' &&
          title !== 'EDIT FOLDER' && (
            <View style={styles.switchContainer}>
              <View style={styles.switchContent}>
                <Image source={userIcon} style={styles.icon} />
                <Text
                  style={[styles.switchLabel, {color: colorTheme.textColor}]}>
                  {strings.public}
                </Text>
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
                <Text
                  style={[styles.switchLabel, {color: colorTheme.textColor}]}>
                  {strings.private}
                </Text>
              </View>
            </View>
          )}

        <View style={styles.colorSection}>
          <Text style={[styles.colorTitle, {color: colorTheme.textColor}]}>
            {strings.color}
          </Text>
          <View style={styles.separator} />

          <View style={styles.colorOptionsContainer}>
            <Pressable
              style={[
                styles.colorOption,
                {
                  borderWidth: !colorView ? scale(1.8) : scale(1),
                  borderColor: !colorView
                    ? colorTheme.textColor
                    : Color.LightGray,
                },
              ]}
              onPress={() => setColorView(false)}>
              <Text style={[styles.colorIndicator, {backgroundColor: color}]} />
            </Pressable>
            <Text style={[styles.orText, {color: colorTheme.textColor}]}>
              {strings.or}
            </Text>
            <Pressable
              style={[
                styles.colorOptionLarge,
                {
                  backgroundColor: color,
                  borderWidth: colorView ? scale(1.8) : scale(1),
                  borderColor: colorView
                    ? colorTheme.textColor
                    : Color.LightGray,
                },
              ]}
              onPress={() => setColorView(true)}
            />
          </View>

          <ColorCodePicker
            setSelectedColor={setColor}
            selectedColor={color}
            colorTheme={colorTheme}
          />
        </View>
      </View>
    ),
    [
      name,
      color,
      title,
      userIcon,
      lockIcon,
      toggleSwitch,
      setColorView,
      colorView,
      colorTheme,
      setColor,
      setName,
      status,
    ],
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderBody}
      <CustomeButton
        buttonColor={Color.theme1}
        buttonWidth="100%"
        title={strings.done}
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={Color.White}
        fontFamily={Font.semiBold}
        marginTop={verticalScale(15)}
        onPress={handleSubmit}
      />
    </ScrollView>
  );
};

export default React.memo(BottomSheetContent);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(15),
    height: '100%',
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
    paddingBottom: verticalScale(5),
    textTransform: 'uppercase',
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
