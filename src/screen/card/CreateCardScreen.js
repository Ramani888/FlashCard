import React, {useState, useMemo, useCallback, useEffect, memo} from 'react';
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
import {useLoader} from '../../context';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';
import {useAppSelector} from '../../redux/hooks';

const CreateCardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {showLoader, hideLoader} = useLoader();
  const colorTheme = useTheme();
  
  // Get params
  const {folderId, setId, initialData, editNote} = route.params || {};
  
  // Get user from Redux state
  const userId = useAppSelector(state => state.auth.user?._id);
  
  // Form state
  const [top, setTop] = useState('');
  const [bottom, setBottom] = useState('');
  const [noteVisible, setNoteVisible] = useState(false);
  const [note, setNote] = useState('');

  // Initialize form with existing data (edit mode)
  useEffect(() => {
    if (initialData) {
      setTop(initialData.top || '');
      setBottom(initialData.bottom || '');
      
      if (editNote) {
        setNoteVisible(true);
        setNote(initialData.note || '');
      }
    }
  }, [initialData, editNote]);

  // ======================================== API Calls ======================================== //

  const createCard = useCallback(async () => {
    if (!userId) {
      showMessageonTheScreen('User not found');
      return;
    }

    const rawData = {
      top,
      bottom,
      userId,
      folderId,
      setId,
      note,
    };

    try {
      showLoader();
      const response = await apiPost(Api.card, '', JSON.stringify(rawData));
      if (response?.success) {
        showMessageonTheScreen(response.message);
        navigation.goBack();
      }
    } catch (err) {
      console.error('Error creating card:', err);
      showMessageonTheScreen('Failed to create card');
    } finally {
      hideLoader();
    }
  }, [userId, top, bottom, folderId, setId, note, showLoader, hideLoader, navigation]);

  const updateCard = useCallback(async () => {
    if (!userId || !initialData?._id) {
      showMessageonTheScreen('Invalid data');
      return;
    }

    const rawData = {
      _id: initialData._id,
      userId,
      folderId,
      setId,
      top,
      bottom,
      note,
      isBlur: initialData.isBlur === false ? 0 : 1,
    };

    try {
      showLoader();
      const response = await apiPut(Api.card, '', JSON.stringify(rawData));
      if (response?.success) {
        showMessageonTheScreen(response.message);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error updating card:', error);
      showMessageonTheScreen('Failed to update card');
    } finally {
      hideLoader();
    }
  }, [userId, initialData, folderId, setId, top, bottom, note, showLoader, hideLoader, navigation]);

  // ======================================== Handlers ======================================== //

  const handleTopChange = useCallback(text => setTop(text), []);
  const handleBottomChange = useCallback(text => setBottom(text), []);
  const handleNoteChange = useCallback(text => setNote(text), []);
  
  const toggleNoteVisible = useCallback(() => {
    setNoteVisible(prev => !prev);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!top.trim()) {
      showMessageonTheScreen('Please enter top text');
      return;
    }
    if (!bottom.trim()) {
      showMessageonTheScreen('Please enter bottom text');
      return;
    }

    if (initialData) {
      updateCard();
    } else {
      createCard();
    }
  }, [top, bottom, initialData, createCard, updateCard]);

  // ======================================== Memoized Components ======================================== //

  // ======================================== Memoized Components ======================================== //

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
    [strings.createCard],
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

  const gradientColors = useMemo(() => colorTheme.gradientTheme, [colorTheme.gradientTheme]);
  
  const inputContainerStyle = useMemo(
    () => [styles.inputContainerStyle, styles.topInputStyle],
    [],
  );

  // ======================================== Render ======================================== //

  // ======================================== Render ======================================== //

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {backgroundColor: colorTheme.background}]}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <LinearGradient colors={gradientColors} style={styles.headerContainer}>
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
            inputContainerStyles={inputContainerStyle}
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
              onChangeText={handleNoteChange}
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
            onPress={toggleNoteVisible}>
            <Text style={[styles.optionalText, {color: colorTheme.textColor}]}>
              {strings.homeTab3}
            </Text>
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
            marginTop={verticalScale(35)}
            marginBottom={verticalScale(0)}
            bottom={verticalScale(10)}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default memo(CreateCardScreen);

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
  },
  topInputStyle: {
    marginTop: verticalScale(15),
  },
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
});
