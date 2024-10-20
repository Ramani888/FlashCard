import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useCallback, useState} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../component/Color';
import CustomeButton from '../custome/CustomeButton';
import Font from '../component/Font';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomeHeader from '../custome/CustomeHeader';
import LinearGradient from 'react-native-linear-gradient';

const {height} = Dimensions.get('window');

const AiScreen = ({setOpenAIBottomsheet}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const refAiRBSheet = useRef();

  useEffect(() => {
    if (setOpenAIBottomsheet) {
      setOpenAIBottomsheet(refAiRBSheet);
    }
  }, [setOpenAIBottomsheet]);

  const handleEnterPress = useCallback(() => {
    // Add your functionality here
  }, []);

  const renderHeader = useCallback(
    () => (
      <CustomeHeader
        goBack={true}
        title={'AI'}
        iconColor={Color.White}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
      />
    ),
    [],
  );

  return (
    <LinearGradient
      colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
      style={styles.container}>
      {renderHeader()}

      <View style={styles.innerContainer}>
        <TextInput
          placeholder="Enter Message"
          value={question}
          onChangeText={setQuestion}
          placeholderTextColor={Color.mediumGray}
          style={{paddingLeft: scale(10)}}
        />

        <Text></Text>
        <View style={styles.iconRow}>
          <IconWithLabel IconComponent={Feather} name="copy" label="Copy" />
          <IconWithLabel
            IconComponent={MaterialIcons}
            name="refresh"
            label="Refresh"
          />
        </View>
      </View>
      <CustomeButton
        buttonColor={Color.theme1}
        buttonWidth="90%"
        title="ENTER"
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={Color.White}
        fontFamily={Font.semiBold}
        alignSelf={'center'}
        marginTop={verticalScale(15)}
        onPress={handleEnterPress}
      />
    </LinearGradient>
  );
};

const IconWithLabel = ({IconComponent, name, label}) => (
  <View style={styles.iconContainer}>
    <IconComponent name={name} size={scale(20)} color={Color.theme1} />
    <Text style={styles.iconText}>{label}</Text>
  </View>
);

export default React.memo(AiScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    height: verticalScale(90),
    alignItems: 'flex-end',
  },
  headerTitleStyle: {
    color: Color.White,
    fontSize: scale(20),
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
    marginHorizontal: scale(17),
    borderRadius: scale(10),
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    height: '75%',
    backgroundColor: Color.White,
    marginTop: verticalScale(10),
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
  topView: {margin: scale(10)},
  text: {fontSize: scale(12), color: Color.Black, fontFamily: Font.regular},
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
    position: 'absolute',
    bottom: verticalScale(10),
    right: scale(10),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: scale(15),
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
