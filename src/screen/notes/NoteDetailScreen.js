import {
  BackHandler,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import CustomeHeader from '../../custome/CustomeHeader';
import Color from '../../component/Color';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale, verticalScale} from '../../custome/Responsive';
import Font from '../../component/Font';
import LinearGradient from 'react-native-linear-gradient';
import CustomeInputField from '../../custome/CustomeInputField';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';

const {height} = Dimensions.get('window');

const NoteDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [notes, setNotes] = useState('');
  const notesRef = useRef('');
  const colorTheme = useTheme();
  const {noteName, note, noteId, noteColor, editNote, colorView} = route.params;

  const lineHeight = 10;
  const paddingOffset = 80;

  const responsiveNumberOfLines = Math.floor(
    (height - paddingOffset) / lineHeight,
  );

  useEffect(() => {
    if (note) {
      setNotes(note);
    }
  }, [note]);

  const handleNoteDesc = text => {
    setNotes(text);
    notesRef.current = text;
  };

  useEffect(() => {
    const backAction = () => {
      saveNote();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [saveNote]);

  const saveNote = useCallback(() => {
    editNote(
      true,
      noteId,
      noteName,
      noteColor,
      notesRef.current ? notesRef.current : global.note,
      colorView,
    );
    navigation.goBack();
  }, [colorView, editNote, navigation, noteColor, noteId, noteName]);

  const renderHeader = () => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        saveNote={saveNote}
        title={strings.homeTab3}
        titleStyle={styles.title}
        containerStyle={styles.headerStyle}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      enabled={Platform.OS === 'ios' ? true : false}>
      <LinearGradient
        colors={colorTheme.gradientTheme}
        style={styles.headerContainer}>
        {renderHeader()}

        <View style={styles.view}>
          <CustomeInputField
            placeholder={strings.addNote}
            height={'99%'}
            onChangeText={handleNoteDesc}
            value={notes}
            textArea={true}
            placeholderTextColor={Color.Gray}
            borderRadius={scale(10)}
            multiline={true}
            numberOfLines={responsiveNumberOfLines}
            textAlignVertical="top"
            backgroundColor={colorTheme.listAndBoxColor}
            inputContainerStyles={styles.inputContainerStyle}
            inputStyles={[styles.input, {color: colorTheme.textColor}]}
          />
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default React.memo(NoteDetailScreen);

const styles = StyleSheet.create({
  container: {flex: 1},
  headerContainer: {
    flex: 1,
    backgroundColor: Color.theme1,
    paddingBottom: verticalScale(20),
  },
  headerStyle: {
    backgroundColor: Color.transparent,
    height: verticalScale(90),
    alignItems: 'flex-end',
  },
  title: {fontSize: scale(20), fontFamily: Font.medium, top: verticalScale(45)},
  inputContainerStyle: {
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    borderRadius: scale(10),
    marginBottom: verticalScale(15),
    backgroundColor: Color.White,
  },
  input: {lineHeight: verticalScale(22)},
  view: {marginHorizontal: scale(15), flex: 1},
});
