import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useCallback} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {scale, verticalScale} from '../custome/Responsive';
import Color from './Color';
import CustomeButton from '../custome/CustomeButton';
import Font from './Font';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const {height} = Dimensions.get('window');

const AIScreen = ({setOpenAIBottomsheet}) => {
  const refAiRBSheet = useRef();

  useEffect(() => {
    if (setOpenAIBottomsheet) {
      setOpenAIBottomsheet(refAiRBSheet);
    }
  }, [setOpenAIBottomsheet]);

  const handleEnterPress = useCallback(() => {
    // Add your functionality here
  }, []);

  return (
    <View>
      <RBSheet
        ref={refAiRBSheet}
        height={height * 0.75}
        openDuration={250}
        draggable
        customStyles={{container: styles.bottomSheetContainer}}>
        <View style={styles.sheetContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../Assets/Img/ai.png')}
              style={styles.imageStyle}
            />
            <View style={styles.innerContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.textStyle}>Get Verse or Ask Questions</Text>
              </View>
              <View style={styles.disclaimerContainer}>
                <Text style={styles.disclaimerTitle}>DISCLAIMER</Text>
                <Text style={styles.disclaimerText}>
                  AI is a tool to assist you and is not always accurate. Make
                  sure you always check the information provided.
                </Text>
              </View>
              <View style={styles.iconRow}>
                <IconWithLabel
                  IconComponent={Feather}
                  name="copy"
                  label="Copy"
                />
                <IconWithLabel
                  IconComponent={MaterialIcons}
                  name="refresh"
                  label="Refresh"
                />
              </View>
            </View>
          </View>
          <CustomeButton
            buttonColor={Color.theme1}
            buttonWidth="100%"
            title="ENTER"
            borderRadius={scale(10)}
            fontSize={scale(15)}
            fontColor={Color.White}
            fontFamily={Font.semiBold}
            marginTop={verticalScale(15)}
            onPress={handleEnterPress}
          />
        </View>
      </RBSheet>
    </View>
  );
};

const IconWithLabel = ({IconComponent, name, label}) => (
  <View style={styles.iconContainer}>
    <IconComponent name={name} size={scale(20)} color={Color.theme1} />
    <Text style={styles.iconText}>{label}</Text>
  </View>
);

export default React.memo(AIScreen);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
  },
  sheetContainer: {
    marginHorizontal: scale(15),
    gap: scale(10),
    marginVertical: verticalScale(15),
  },
  imageContainer: {
    borderWidth: scale(1),
    borderRadius: scale(20),
    borderColor: Color.LightGray,
    height: height * 0.58,
  },
  imageStyle: {
    width: scale(60),
    height: scale(60),
    alignSelf: 'center',
    marginTop: verticalScale(15),
  },
  innerContainer: {
    margin: scale(13),
    borderRadius: scale(20),
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    height: height * 0.43,
  },
  textContainer: {
    backgroundColor: '#ECECEC',
    borderTopRightRadius: scale(20),
    borderTopLeftRadius: scale(20),
  },
  textStyle: {
    fontSize: scale(15),
    fontFamily: Font.medium,
    color: Color.Black,
    paddingVertical: verticalScale(10),
    paddingLeft: scale(20),
  },
  disclaimerContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: verticalScale(10),
  },
  disclaimerTitle: {
    fontSize: scale(15),
    fontFamily: Font.medium,
    color: Color.mediumGray,
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: scale(12),
    fontFamily: Font.regular,
    color: Color.mediumGray,
    textAlign: 'center',
    lineHeight: verticalScale(18),
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: scale(10),
    marginRight: scale(10),
    marginBottom: verticalScale(5),
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: scale(12),
    color: Color.theme1,
    fontFamily: Font.regular,
    textAlign: 'center',
  },
});
