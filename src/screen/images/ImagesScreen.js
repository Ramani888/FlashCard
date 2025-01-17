import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import CustomeHeader from '../../custome/CustomeHeader';
import Color from '../../component/Color';
import {scale, verticalScale} from '../../custome/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import CustomeButton from '../../custome/CustomeButton';
import Font from '../../component/Font';
import ImageComponent from '../../component/Images/ImageComponent';
import ImageFolderComponent from '../../component/Images/ImageFolderComponent';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';

const ImagesScreen = () => {
  const [tab, setTab] = useState('IMAGES');
  const [folderId, setFolderId] = useState('');
  const [showFolder, setShowFolder] = useState(false);
  const colorTheme = useTheme();

  const handleFolderClick = folderId => {
    setFolderId(folderId);
    setTab('IMAGES');
  };

  const renderHeader = () => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        imageFolder={true}
        setShowFolder={setShowFolder}
        showFolder={showFolder}
        title={strings.homeTab5}
        titleStyle={styles.title}
        containerStyle={styles.headerStyle}
      />
    );
  };

  const buttons = () => (
    <View style={styles.buttonContainer}>
      <CustomeButton
        buttonColor={tab == 'IMAGES' ? Color.White : Color.theme1}
        buttonWidth={scale(150)}
        buttonHeight={scale(45)}
        title={strings.homeTab5}
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={tab == 'IMAGES' ? Color.Black : Color.White}
        fontFamily={Font.medium}
        marginTop={verticalScale(15)}
        textTransform={'uppercase'}
        onPress={() => setTab('IMAGES')}
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
        textTransform={'uppercase'}
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

        {tab == 'IMAGES' && <ImageComponent folderId={folderId} showFolder={showFolder}/>}
        {tab == 'FOLDERS' && (
          <ImageFolderComponent onFolderClick={handleFolderClick} />
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

export default React.memo(ImagesScreen);

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
  title: {
    fontSize: scale(20),
    fontFamily: Font.medium,
    textTransform: 'uppercase',
  },
  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(10),
  },
});
