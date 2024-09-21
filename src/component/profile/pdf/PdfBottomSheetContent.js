import React, {useMemo, useState, useCallback, useEffect} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Color from '../../Color';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import CustomeButton from '../../../custome/CustomeButton';
import Font from '../../Font';
import CustomeInputField from '../../../custome/CustomeInputField';
import ColorCodePicker from '../../verses/ColorCodePicker';
import showMessageonTheScreen from '../../ShowMessageOnTheScreen';
import AntDesign from 'react-native-vector-icons/AntDesign';

const {width, height} = Dimensions.get('window');

const PdfBottomSheetContent = ({
  closeBottomSheet,
  title,
  setName,
  name,
  setColor,
  color,
}) => {
  const handleSubmit = () => {
    closeBottomSheet();
  };

  const renderBody = useMemo(
    () => (
      <View style={styles.bodyContainer}>
        <Pressable style={styles.closeButton} onPress={closeBottomSheet}>
          <AntDesign name="close" size={scale(15)} color={Color.Black} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.separator} />

        <Image
          source={require('../../../Assets/Img/folderFram.png')}
          style={{
            width: width * 0.23,
            height: height * 0.12,
            alignSelf: 'center',
            marginTop: verticalScale(10),
          }}
        />

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

        <View style={styles.colorSection}>
          <Text style={styles.colorTitle}>Color</Text>
          <View style={styles.separator} />

          <ColorCodePicker setSelectedColor={setColor} selectedColor={color} />
        </View>
      </View>
    ),
    [name, color],
  );

  return (
    <View style={styles.container}>
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
        onPress={handleSubmit}
      />
    </View>
  );
};

export default React.memo(PdfBottomSheetContent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: scale(15),
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
  closeButton: {
    height: scale(26),
    width: scale(26),
    borderRadius: scale(13),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.WhiteDefault,
    position: 'absolute',
    top: verticalScale(-30),
    right: scale(-7),
  },
});
