import {BackHandler, Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
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

  const responsiveNumberOfLines = Math.floor((height - paddingOffset) / lineHeight);

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
  }, []);

  const saveNote = () => {
    editNote(
      true,
      noteId,
      noteName,
      noteColor,
      notesRef.current ? notesRef.current : global.note,
      colorView,
    );
    navigation.goBack();
  };

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
    <LinearGradient
      colors={colorTheme.gradientTheme}
      style={styles.headerContainer}>
      {renderHeader()}

      <View style={{marginHorizontal: scale(15)}}>
        <CustomeInputField
          placeholder={strings.addNote}
          height={height - 100}
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
  );
};

export default React.memo(NoteDetailScreen);

const styles = StyleSheet.create({
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
  input: {lineHeight: verticalScale(22),},
});
