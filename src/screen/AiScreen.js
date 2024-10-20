import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useCallback, useState} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Color from '../component/Color';
import CustomeButton from '../custome/CustomeButton';
import Font from '../component/Font';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomeHeader from '../custome/CustomeHeader';
import LinearGradient from 'react-native-linear-gradient';
import {apiPost} from '../Api/ApiService';
import Api from '../Api/EndPoint';
import Loader from '../component/Loader';
import showMessageonTheScreen from '../component/ShowMessageOnTheScreen';
import Clipboard from '@react-native-clipboard/clipboard';

const {height} = Dimensions.get('window');

const AiScreen = ({setOpenAIBottomsheet}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const [visible, setVisible] = useState(false);
  const refAiRBSheet = useRef();

  useEffect(() => {
    if (question) {
      setAnswer('');
    }
  }, [question]);

  // ================================== Api ==================================== //

  const getAnswer = async () => {
    const rawData = {
      message: question,
    };
    try {
      setVisible(true);
      const response = await apiPost(
        Api.chatGptAi,
        '',
        JSON.stringify(rawData),
      );
      if (response) {
        setAnswer(response?.response);
      }
    } catch (error) {
      console.log('error in chatGpt api', error);
    } finally {
      setVisible(false);
    }
  };

  // ================================== Api ==================================== //

  useEffect(() => {
    if (setOpenAIBottomsheet) {
      setOpenAIBottomsheet(refAiRBSheet);
    }
  }, [setOpenAIBottomsheet]);

  const handleEnterPress = () => {
    getAnswer();
  };

  const copyToClipboard = () => {
    Clipboard.setString(answer);
    showMessageonTheScreen('Copied');
  };

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
      <Loader visible={visible} />
      {renderHeader()}

      <View style={styles.innerContainer}>
        <TextInput
          placeholder="Enter Message"
          value={question}
          onChangeText={setQuestion}
          multiline={true}
          placeholderTextColor={Color.mediumGray}
          style={styles.textInput}
        />
        <ScrollView style={styles.answerView}>
          <Text style={styles.answer}>{answer}</Text>
        </ScrollView>
        <View style={styles.iconRow}>
          <Pressable onPress={() => answer && copyToClipboard()}>
            <IconWithLabel IconComponent={Feather} name="copy" label="Copy" />
          </Pressable>
          <Pressable
            onPress={() => {
              setAnswer('');
              setQuestion('');
            }}>
            <IconWithLabel
              IconComponent={MaterialIcons}
              name="refresh"
              label="Refresh"
            />
          </Pressable>
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: scale(15),
    marginRight: scale(10),
    marginBottom: verticalScale(5),
    marginTop: verticalScale(10),
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
  answerView: {height: '80%', color: 'red'},
  answer: {
    fontSize: moderateScale(14),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(10),
    height: '100%',
  },
  textInput: {
    paddingLeft: scale(10),
    color: Color.mediumGray,
    fontSize: moderateScale(14),
    fontFamily: Font.medium,
  },
});
