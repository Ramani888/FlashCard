import React, {useEffect, useRef, useCallback, useState} from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  Dimensions,
} from 'react-native';
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
import VideoAds from './ads/VideoAds';

const {width, height} = Dimensions.get('window');

const AiScreen = ({setOpenAIBottomsheet}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [inputHeight, setInputHeight] = useState(verticalScale(190));
  const [userCredit, setUserCredit] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const refAiRBSheet = useRef();
  const colorTheme = useTheme();
  const adRef = useRef();

  useEffect(() => {
    if (question) {
      setAnswer('');
    }
  }, [question]);

  useEffect(() => {
    getProfileData(true);
    if (setOpenAIBottomsheet) {
      setOpenAIBottomsheet(refAiRBSheet);
    }
  }, [setOpenAIBottomsheet]);

  const getAnswer = async () => {
    const rawData = {message: question};
    try {
      setVisible(true);
      const response = await apiPost(
        Api.chatGptAi,
        '',
        JSON.stringify(rawData),
      );
      if (response) {
        setAnswer(response?.response);
        updateCredit(1, 'debited');
      }
    } catch (error) {
      console.error('Error in chatGpt API:', error);
    } finally {
      setVisible(false);
    }
  };

  const getProfileData = async showLoader => {
    try {
      if (showLoader) {
        setVisible(true);
      }
      const response = await apiGet(
        `${Api.profile}?userId=${global.user?._id}`,
      );
      setUserCredit(response?.userCreditData?.credit);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setVisible(false);
    }
  };

  const updateCredit = async (credit, type) => {
    const rawData = {userId: global.user?._id, credit: credit, type: type};
    try {
      setVisible(true);
      const response = await apiPut(Api.credit, '', JSON.stringify(rawData));
      if (response.success) {
        getProfileData(false);
      }
    } catch (error) {
      console.error('Error updating credit:', error);
    } finally {
      setVisible(false);
    }
  };

  const handleEnterPress = () => {
    if (userCredit > 0) {
      getAnswer();
    } else {
      showMessageonTheScreen(strings.aiLimitMessage);
    }
  };

  const copyToClipboard = () => {
    console.log('answer', answer);
    Clipboard.setString(JSON.stringify(answer));
    showMessageonTheScreen(JSON.stringify(answer));
  };

  const handleShowAd = () => {
    if (adRef.current) {
      adRef.current.showAd();
    }
  };

  const renderHeader = useCallback(
    () => (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack
        showVideoAd={handleShowAd}
        setLoading={setLoading}
        title={strings.homeTab2}
        iconColor={Color.White}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
        iconStyle={{bottom: verticalScale(5)}}
        videoIconStyle={{top: verticalScale(47)}}
      />
    ),
    [],
  );

  return (
    <LinearGradient
      colors={colorTheme.gradientTheme}
      style={styles.Wrapper}
    >
      <View style={[styles.Container]}>
        <Loader visible={visible} />
        <Loader visible={loading} />
        <View style={styles.Header}>
          {renderHeader()}
          <VideoAds
            ref={adRef}
            updateCredit={updateCredit}
            setLoading={setLoading}
            loading={loading}
          />
        </View>
        <View style={styles.Body}>
          <View style={[styles.CardContainer, {backgroundColor: colorTheme.listAndBoxColor}]}>
            <View style={styles.CardHeader}>
              <Text style={[styles.headerText, {color: colorTheme.textColor}]}>
                {strings.aiHeader}
              </Text>
            </View>
            <ScrollView style={styles.CardBodyScroll} contentContainerStyle={styles.CardBody} showsVerticalScrollIndicator={true}>
              <TextInput
                placeholder={strings.aiPlaceholder}
                value={question}
                onChangeText={setQuestion}
                multiline
                placeholderTextColor="#D1D1D6"
                onContentSizeChange={event =>
                  setInputHeight(
                    event.nativeEvent.contentSize.height + verticalScale(10),
                  )
                }
                style={[
                  styles.textInput,
                  {
                    height: answer ? inputHeight : verticalScale(190),
                    color: colorTheme.textColor,
                  },
                ]}
              />
              <Text style={[styles.answer, {color: colorTheme.textColor}]}>
                {answer}
              </Text>
            </ScrollView>
            <View style={styles.CardFooter}>
              <Pressable onPress={() => answer && copyToClipboard()}>
                <IconWithLabel
                  IconComponent={Feather}
                  name="copy"
                  label={strings.copy}
                />
              </Pressable>
              <Pressable onPress={() => setAnswer('') || setQuestion('')}>
                <IconWithLabel
                  IconComponent={MaterialIcons}
                  name="refresh"
                  label={strings.refresh}
                />
              </Pressable>
            </View>
          </View>
        </View>
        <View style={styles.Footer}>
          <CustomeButton
            buttonColor={Color.theme1}
            buttonWidth="90%"
            title={strings.enter}
            borderRadius={scale(10)}
            fontSize={scale(15)}
            fontColor={Color.White}
            fontFamily={Font.semiBold}
            alignSelf="center"
            onPress={handleEnterPress}
          />
        </View>
      </View>
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
  container: {flex: 1},
  scrollViewContent: {flexGrow: 2},
  headerStyle: {
    backgroundColor: Color.transparent,
    height: verticalScale(90),
    alignItems: 'flex-end',
  },
  headerTitleStyle: {
    color: Color.White,
    fontSize: scale(22),
    bottom: verticalScale(5),
  },
  headerView: {
    marginHorizontal: scale(17),
    borderTopLeftRadius: scale(15),
    borderTopRightRadius: scale(15),
  },
  headerText: {
    fontSize: scale(15),
    fontFamily: Font.medium,
    // padding: scale(10),
  },
  innerContainer: {
    marginHorizontal: scale(17),
    borderBottomLeftRadius: scale(15),
    borderBottomRightRadius: scale(15),
    height: verticalScale(490),
  },
  textInput: {
    paddingLeft: scale(10),
    color: Color.mediumGray,
    fontSize: moderateScale(14),
    fontFamily: Font.medium,
    textAlignVertical: 'top',
  },
  answerView: {height: '80%', color: 'red'},
  answer: {
    fontSize: moderateScale(14),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(10),
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
  iconContainer: {alignItems: 'center'},
  iconText: {
    fontSize: scale(10),
    color: Color.theme1,
    fontFamily: Font.medium,
    paddingTop: verticalScale(3),
  },

  Wrapper: {
    flex: 1,
  },
  Container: {
    flex: 1,
    height: height
  },
  Header: {
    height: verticalScale(90),
    width: width,
  },
  Body: {
    flex: 1,
    width: width,
    height: height - verticalScale(180),
    paddingLeft: scale(20),
    paddingRight: scale(20),
  },
  Footer: {
    height: verticalScale(90),
    width: width,
    justifyContent: 'center',
    alignItems: 'center'
  },
  CardContainer: {
    height: '100%',
    borderTopLeftRadius: scale(15),
    borderTopRightRadius: scale(15),
    borderBottomLeftRadius: scale(15),
    borderBottomRightRadius: scale(15),
  },
  CardHeader: {
    height: '7%',
    borderBottomWidth: 1,
    paddingLeft: scale(10),
    justifyContent: 'center'
  },
  CardBodyScroll: {
    flex: 1,
  },
  CardBody: {
  },
  CardFooter: {
    height: '10%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: scale(15),
    paddingRight: scale(10),
  }
});
