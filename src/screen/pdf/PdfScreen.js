import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import CustomeHeader from '../../custome/CustomeHeader';
import Color from '../../component/Color';
import {scale, verticalScale} from '../../custome/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import CustomeButton from '../../custome/CustomeButton';
import Font from '../../component/Font';
import PdfComponent from '../../component/pdf/PdfComponent';
import PdfFolderComponent from '../../component/pdf/PdfFolderComponent';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';

const PdfScreen = () => {
  const [tab, setTab] = useState('PDF');
  const [folderId, setFolderId] = useState('');
  const colorTheme = useTheme();

  const renderHeader = () => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={strings.pdf}
        titleStyle={styles.title}
        containerStyle={styles.headerStyle}
      />
    );
  };

  const handleFolderClick = folderId => {
    setFolderId(folderId);
    setTab('PDF');
  };

  const buttons = () => (
    <View style={styles.buttonContainer}>
      <CustomeButton
        buttonColor={tab == 'PDF' ? Color.White : Color.theme1}
        buttonWidth={scale(150)}
        buttonHeight={scale(45)}
        title={strings.homeTab4}
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={tab == 'PDF' ? Color.Black : Color.White}
        fontFamily={Font.medium}
        marginTop={verticalScale(15)}
        onPress={() => setTab('PDF')}
      />

      <CustomeButton
        buttonColor={tab == 'FOLDERS' ? Color.White : Color.theme1}
        buttonWidth={scale(150)}
        buttonHeight={scale(45)}
        title={strings.folder}
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={tab == 'FOLDERS' ? Color.Black : Color.White}
        fontFamily={Font.medium}
        marginTop={verticalScale(15)}
        onPress={() => setTab('FOLDERS')}
      />
    </View>
  );

  const renderBody = () => {
    return (
      <View style={{flex: 1}}>
        <LinearGradient
          colors={colorTheme.gradientTheme}
          style={styles.headerContainer}>
          {renderHeader()}

          {buttons()}
        </LinearGradient>

        {tab == 'PDF' && <PdfComponent folderId={folderId} />}
        {tab == 'FOLDERS' && (
          <PdfFolderComponent onFolderClick={handleFolderClick} />
        )}
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colorTheme.background1}}>
      {renderBody()}
    </View>
  );
};

export default React.memo(PdfScreen);

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Color.theme1,
    paddingBottom: verticalScale(20),
  },
  headerStyle: {
    backgroundColor: Color.transparent,
    height: verticalScale(90),
    alignItems: 'flex-end',
  },
  title: {fontSize: scale(20), fontFamily: Font.medium},
  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(10),
  },
});
