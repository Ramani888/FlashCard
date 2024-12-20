import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useCallback, useState} from 'react';
import {scale, verticalScale, moderateScale} from '../custome/Responsive';
import Color from '../component/Color';
import CustomeButton from '../custome/CustomeButton';
import Font from '../component/Font';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomeHeader from '../custome/CustomeHeader';
import LinearGradient from 'react-native-linear-gradient';
import {apiGet, apiPost, apiPut} from '../Api/ApiService';
import Api from '../Api/EndPoint';
import Loader from '../component/Loader';
import showMessageonTheScreen from '../component/ShowMessageOnTheScreen';
import Clipboard from '@react-native-clipboard/clipboard';
import useTheme from '../component/Theme';
import strings from '../language/strings';

const {height} = Dimensions.get('window');

const AiScreen = ({setOpenAIBottomsheet}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [inputHeight, setInputHeight] = useState(verticalScale(190));
  const [userCredit, setUserCredit] = useState('');
  const colorTheme = useTheme();

  const [visible, setVisible] = useState(false);
  const refAiRBSheet = useRef();

  useEffect(() => {
    if (question) {
      setAnswer('');
    }
  }, [question]);

  useEffect(() => {
    getProfileData(true);
  }, []);

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
        updateCredit();
      }
    } catch (error) {
      console.log('error in chatGpt api', error);
    } finally {
      setVisible(false);
    }
  };

  const getProfileData = async visible => {
    try {
      visible && setVisible(true);
      const response = await apiGet(
        `${Api.profile}?userId=${global.user?._id}`,
      );
      setUserCredit(response?.userCreditData?.credit);
    } catch (error) {
      console.log('error in get profile api', error);
    } finally {
      setVisible(false);
    }
  };

  const updateCredit = async () => {
    const rawData = {
      userId: global.user?._id,
      credit: 1,
      type: 'debited',
    };
    try {
      setVisible(true);
      const response = await apiPut(Api.credit, '', JSON.stringify(rawData));
      if (response.success == true) {
        getProfileData(false);
      }
    } catch (error) {
      console.log('error in update card', error);
    }
  };

  // ================================== Api ==================================== //

  useEffect(() => {
    if (setOpenAIBottomsheet) {
      setOpenAIBottomsheet(refAiRBSheet);
    }
  }, [setOpenAIBottomsheet]);

  const handleEnterPress = () => {
    if (userCredit > 0) {
      getAnswer();
    } else {
      showMessageonTheScreen(strings.aiLimitMessage);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(answer);
    showMessageonTheScreen('Copied');
  };

  const renderHeader = useCallback(
    () => (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={strings.homeTab2}
        iconColor={Color.White}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
      />
    ),
    [],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled">
        <LinearGradient
          colors={colorTheme.gradientTheme}
          style={styles.container}>
          <Loader visible={visible} />
          {renderHeader()}

          <View>
            <View
              style={[
                styles.headerView,
                {backgroundColor: colorTheme.background},
              ]}>
              <Text style={[styles.headerText, {color: colorTheme.textColor}]}>
                {strings.aiHeader}
              </Text>
            </View>
            <View
              style={[
                styles.innerContainer,
                {backgroundColor: colorTheme.listAndBoxColor},
              ]}>
              <TextInput
                placeholder={
                  strings.aiPlaceholder
                }
                value={question}
                onChangeText={setQuestion}
                multiline={true}
                placeholderTextColor="#D1D1D6"
                onContentSizeChange={event =>
                  setInputHeight(
                    event.nativeEvent.contentSize.height + verticalScale(10),
                  )
                }
                style={[
                  styles.textInput,
                  {height: answer ? inputHeight : verticalScale(190)},
                ]}
              />
              <ScrollView style={styles.answerView}>
                <Text style={styles.answer}>{answer}</Text>
              </ScrollView>
              <View style={styles.iconRow}>
                <Pressable onPress={() => answer && copyToClipboard()}>
                  <IconWithLabel
                    IconComponent={Feather}
                    name="copy"
                    label={strings.copy}
                  />
                </Pressable>
                <Pressable
                  onPress={() => {
                    setAnswer('');
                    setQuestion('');
                  }}>
                  <IconWithLabel
                    IconComponent={MaterialIcons}
                    name="refresh"
                    label={strings.refresh}
                  />
                </Pressable>
              </View>
            </View>
          </View>
          <CustomeButton
            buttonColor={Color.theme1}
            buttonWidth="90%"
            title={strings.enter}
            borderRadius={scale(10)}
            fontSize={scale(15)}
            fontColor={Color.White}
            fontFamily={Font.semiBold}
            alignSelf={'center'}
            marginTop={verticalScale(15)}
            marginBottom={verticalScale(10)}
            onPress={handleEnterPress}
          />
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollViewContent: {
    flexGrow: 2,
  },
  headerStyle: {
    backgroundColor: Color.transparent,
    height: verticalScale(90),
    alignItems: 'flex-end',
  },
  headerTitleStyle: {
    color: Color.White,
    fontSize: scale(20),
  },
  headerView: {
    marginHorizontal: scale(17),
    borderTopLeftRadius: scale(15),
    borderTopRightRadius: scale(15),
  },
  headerText: {
    fontSize: scale(15),
    fontFamily: Font.medium,
    padding: scale(10),
  },
  innerContainer: {
    marginHorizontal: scale(17),
    borderBottomLeftRadius: scale(15),
    borderBottomRightRadius: scale(15),
    height: verticalScale(490),
    backgroundColor: Color.White,
    // marginTop: verticalScale(10),
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
    textAlignVertical: 'top',
  },
});
