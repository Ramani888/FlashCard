import {BackHandler, Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeHeader from '../../custome/CustomeHeader';
import Color from '../../component/Color';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import Font from '../../component/Font';
import LinearGradient from 'react-native-linear-gradient';
import CustomeInputField from '../../custome/CustomeInputField';
import CustomeButton from '../../custome/CustomeButton';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';

const {height} = Dimensions.get('window');

const NoteDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [notes, setNotes] = useState('');
  const {noteName, note, noteId, noteColor, editNote, colorView} = route.params;

  useEffect(() => {
    if (note) {
      setNotes(note);
    }
  }, [note]);

  const handleNoteDesc = text => {
    setNotes(text);
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

  const renderHeader = () => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        saveNote={saveNote}
        title={noteName}
        titleStyle={styles.title}
        containerStyle={styles.headerStyle}
      />
    );
  };

  const saveNote = () => {
    editNote(true, noteId, noteName, noteColor, notes, colorView);
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
      style={styles.headerContainer}>
      {renderHeader()}

      <View style={{marginHorizontal: scale(15)}}>
        <CustomeInputField
          placeholder={'Add Note'}
          height={height - 100}
          onChangeText={handleNoteDesc}
          value={notes}
          textArea={true}
          placeholderTextColor={Color.Gray}
          borderRadius={scale(10)}
          multiline={true}
          numberOfLines={32}
          textAlignVertical="top"
          inputContainerStyles={styles.inputContainerStyle}
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
});
