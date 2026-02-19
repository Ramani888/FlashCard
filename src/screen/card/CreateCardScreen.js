import React, {useState, useMemo, useCallback, useRef, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {scale, verticalScale} from '../../custome/Responsive';
import CustomeHeader from '../../custome/CustomeHeader';
import CustomeInputField from '../../custome/CustomeInputField';
import Color from '../../component/Color';
import Font from '../../component/Font';
import CustomeButton from '../../custome/CustomeButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {apiPost, apiPut} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import Loader from '../../component/Loader';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
// import AIScreen from '../../component/AIScreen';
import {ScreenName} from '../../component/Screen';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';
import {useAppSelector} from '../../redux/hooks';

const CreateCardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [visible, setVisible] = useState(false);
  const [top, setTop] = useState('');
  const [bottom, setBottom] = useState('');
  const [noteVisible, setNoteVisible] = useState(false);
  const [note, setNote] = useState('');
  const {folderId, setId, initialData, editNote} = route.params;
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const colorTheme = useTheme();
  
  // Get user from Redux state instead of global
  const user = useAppSelector(state => state.auth.user);
  const userId = user?._id;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardOpen(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardOpen(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (initialData) {
      setTop(initialData?.top);
      setBottom(initialData?.bottom);
    }
    if (editNote) {
      setNoteVisible(true);
      setNote(initialData?.note);
    }
  }, [initialData, editNote]);

  // ======================================== Api ======================================== //

  const createCard = async () => {
    const rawData = {
      top: top,
      bottom: bottom,
      userId: userId,
      folderId: folderId,
      setId: setId,
      note: note,
    };

    try {
      setVisible(true);
      const response = await apiPost(Api.card, '', JSON.stringify(rawData));
      if (response.success === true) {
        showMessageonTheScreen(response?.message);
        navigation.goBack();
      }
    } catch (err) {
      console.log('Error creating card:', err);
    } finally {
      setVisible(false);
    }
  };

  const updateCard = async () => {
    const rawData = {
      _id: initialData?._id,
      userId: userId,
      folderId: folderId,
      setId: setId,
      top: top,
      bottom: bottom,
      note: note,
      isBlur: initialData?.isBlur === false ? 0 : 1,
    };
    try {
      setVisible(true);
      const response = await apiPut(Api.card, '', JSON.stringify(rawData));
      if (response.success === true) {
        showMessageonTheScreen(response?.message);
        navigation.goBack();
      }
    } catch (error) {
      console.log('error in update card', error);
    } finally {
      setVisible(false);
    }
  };

  // ======================================== End ======================================== //

  const handleTopChange = useCallback(text => setTop(text), []);
  const handleBottomChange = useCallback(text => setBottom(text), []);

  const header = useMemo(
    () => (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={
          <View style={styles.titleContainer}>
            <Text style={styles.titleLine}>{strings.createCard}</Text>
          </View>
        }
        titleStyle={styles.headerTitle}
        containerStyle={styles.headerStyle}
      />
    ),
    [],
  );

  const cardImage = useMemo(
    () => (
      <View style={styles.imageContainer}>
        <Image
          source={require('../../Assets/Img/singleCard.png')}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>
    ),
    [],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {backgroundColor: colorTheme.background}]}>
      <Loader visible={visible} />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled">
        <LinearGradient
          colors={colorTheme.gradientTheme}
          style={styles.headerContainer}>
          {header}
          {cardImage}
        </LinearGradient>

        <View style={styles.inputContainer}>
          <CustomeInputField
            placeholder={strings.top}
            placeholderTextColor={Color.mediumGray}
            onChangeText={handleTopChange}
            value={top}
            height={verticalScale(45)}
            width="100%"
            backgroundColor={colorTheme.listAndBoxColor}
            inputContainerStyles={[
              styles.inputContainerStyle,
              styles.topInputStyle,
            ]}
            inputStyles={{color: colorTheme.textColor}}
          />
          <CustomeInputField
            placeholder={strings.bottom}
            height={verticalScale(180)}
            onChangeText={handleBottomChange}
            value={bottom}
            textArea={true}
            placeholderTextColor={Color.Gray}
            borderRadius={scale(10)}
            multiline={true}
            numberOfLines={8}
            textAlignVertical="top"
            backgroundColor={colorTheme.listAndBoxColor}
            inputContainerStyles={styles.inputContainerStyle}
            inputStyles={{color: colorTheme.textColor}}
          />

          {noteVisible && (
            <CustomeInputField
              placeholder={strings.note}
              height={verticalScale(180)}
              onChangeText={setNote}
              value={note}
              textArea={true}
              placeholderTextColor={Color.Gray}
              borderRadius={scale(10)}
              multiline={true}
              numberOfLines={8}
              textAlignVertical="top"
              backgroundColor={colorTheme.listAndBoxColor}
              inputStyles={{color: colorTheme.textColor}}
              inputContainerStyles={styles.inputContainerStyle}
            />
          )}

          <Pressable
            style={[
              styles.optionalContainer,
              {backgroundColor: colorTheme.listAndBoxColor},
            ]}
            onPress={() => setNoteVisible(!noteVisible)}>
            <Text style={[styles.optionalText, {color: colorTheme.textColor}]}>
              {strings.homeTab3}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate(ScreenName.aiScreen)}
            style={[
              styles.aiButton,
              {marginBottom: noteVisible ? verticalScale(30) : 0},
            ]}>
            <Image
              source={require('../../Assets/Img/ai.png')}
              style={styles.aiImage}
            />
          </Pressable>

          <CustomeButton
            buttonColor={Color.theme1}
            buttonWidth="100%"
            buttonHeight={scale(45)}
            title={strings.done}
            borderRadius={scale(10)}
            fontSize={scale(15)}
            fontColor={Color.White}
            fontFamily={Font.semiBold}
            marginTop={noteVisible ? verticalScale(0) : verticalScale(35)}
            marginBottom={verticalScale(0)}
            bottom={verticalScale(10)}
            onPress={() => {
              if (initialData) {
                updateCard();
              } else {
                createCard();
              }
            }}
          />
        </View>
        {/* <AiScreen setOpenAIBottomsheet={setOpenAIBottomsheet} /> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default React.memo(CreateCardScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  headerContainer: {
    justifyContent: 'flex-end',
  },
  headerStyle: {
    backgroundColor: Color.transparent,
    height: verticalScale(85),
    alignItems: 'flex-end',
  },
  headerTitle: {top: verticalScale(40)},
  titleContainer: {
    alignItems: 'center',
  },
  titleLine: {
    fontSize: scale(20),
    color: Color.White,
    fontFamily: Font.medium,
  },
  inputContainerStyle: {
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    borderRadius: scale(10),
    marginBottom: verticalScale(15),
    // backgroundColor: 'red',
  },
  topInputStyle: {marginTop: verticalScale(15)},
  imageContainer: {
    alignItems: 'center',
    marginVertical: verticalScale(40),
  },
  cardImage: {
    width: scale(124),
    height: scale(80),
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: scale(15),
  },
  optionalContainer: {
    width: scale(158),
    height: verticalScale(30),
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: verticalScale(-8),
  },
  optionalText: {
    fontSize: scale(12.5),
    color: Color.Black,
  },
  icon: {
    backgroundColor: Color.WhiteDefault,
    borderRadius: scale(5),
    padding: scale(10),
    width: scale(30),
  },
  aiButton: {marginVertical: verticalScale(27)},
  aiImage: {width: scale(60), height: scale(60), alignSelf: 'center'},
});
