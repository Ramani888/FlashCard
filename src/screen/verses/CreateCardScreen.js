import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Image, StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { scale, verticalScale } from 'react-native-size-matters';
import CustomeHeader from '../../custome/CustomeHeader';
import CustomeInputField from '../../custome/CustomeInputField';
import Color from '../../component/Color';
import Font from '../../component/Font';
import CustomeButton from '../../custome/CustomeButton';

const CreateCardScreen = () => {
  const [top, setTop] = useState('');
  const [bottom, setBottom] = useState('');

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
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps='handled'
      >
        <LinearGradient
          colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
          style={styles.headerContainer}
        >
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
            // position={'absolute'}
            // bottom={verticalScale(10)}
            onPress={() => refRBSheet.current.open()}
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
});
