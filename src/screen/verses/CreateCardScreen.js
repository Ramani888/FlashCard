import React, {useState, useMemo, useCallback, useRef, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {scale, verticalScale} from 'react-native-size-matters';
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

const CreateCardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [visible, setVisible] = useState(false);
  const [top, setTop] = useState('');
  const [bottom, setBottom] = useState('');
  const {cardTypeId, folderId, setId, initialData} = route.params;

  useEffect(() => {
    if (initialData) {
      setTop(initialData?.top);
      setBottom(initialData?.bottom);
    }
  }, [initialData]);

  // ======================================== Api ======================================== //

  const createCard = async () => {
    const rawData = {
      top: top,
      bottom: bottom,
      userId: global?.user?._id,
      cardTypeId: cardTypeId,
      folderId: folderId,
      setId: setId,
    };
    try {
      setVisible(true);
      const response = await apiPost(Api.card, '', JSON.stringify(rawData));
      if (response.success == true) {
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
      userId: global?.user?._id,
      cardTypeId: cardTypeId,
      folderId: folderId,
      setId: setId,
      top: top,
      bottom: bottom,
      note: '',
      isBlur: initialData?.isBlur == false ? 0 : 1,
    };
    try {
      setVisible(true);
      const response = await apiPut(Api.card, '', JSON.stringify(rawData));
      if (response.success == true) {
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
        goBack={true}
        title={
          <View style={styles.titleContainer}>
            <Text style={styles.titleLine}>CREATE</Text>
            <Text style={styles.titleLine}>GENERAL CARD</Text>
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
      style={styles.container}>
      <Loader visible={visible} />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled">
        <LinearGradient
          colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
          style={styles.headerContainer}>
          {header}
          {cardImage}
        </LinearGradient>

        <View style={styles.inputContainer}>
          <CustomeInputField
            placeholder="Top"
            placeholderTextColor={Color.mediumGray}
            onChangeText={handleTopChange}
            value={top}
            height={verticalScale(45)}
            marginTop={verticalScale(-30)}
            width="100%"
            inputContainerStyles={[
              styles.inputContainerStyle,
              styles.topInputStyle,
            ]}
          />
          <CustomeInputField
            placeholder="Bottom"
            height={verticalScale(180)}
            onChangeText={handleBottomChange}
            value={bottom}
            textArea={true}
            placeholderTextColor={Color.Gray}
            borderRadius={scale(10)}
            multiline={true}
            numberOfLines={8}
            textAlignVertical="top"
            inputContainerStyles={styles.inputContainerStyle}
          />
          <View style={styles.optionalContainer}>
            <Text style={styles.optionalText}>Optional - Add Note</Text>
          </View>

          <Pressable onPress={() => navigation.navigate(ScreenName.openAi)} style={styles.aiButton}>
            <Image
              source={require('../../Assets/Img/ai.png')}
              style={styles.aiImage}
            />
          </Pressable>

          <CustomeButton
            buttonColor={Color.theme1}
            buttonWidth="100%"
            buttonHeight={scale(45)}
            title="DONE"
            borderRadius={scale(10)}
            fontSize={scale(15)}
            fontColor={Color.White}
            fontFamily={Font.semiBold}
            marginTop={verticalScale(15)}
            marginBottom={verticalScale(15)}
            position={'absolute'}
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
    paddingBottom: verticalScale(20),
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
    backgroundColor: Color.White,
  },
  topInputStyle: {marginTop: verticalScale(-25)},
  imageContainer: {
    alignItems: 'center',
    marginVertical: verticalScale(50),
  },
  cardImage: {
    width: scale(124),
    height: scale(76),
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
  aiButton:{marginVertical:verticalScale(20)},
  aiImage:{width: scale(60), height: scale(60), alignSelf: 'center'}
});
