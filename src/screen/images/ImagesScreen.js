import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import CustomeHeader from '../../custome/CustomeHeader';
import Color from '../../component/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import CustomeButton from '../../custome/CustomeButton';
import Font from '../../component/Font';
import ImageComponent from '../../component/Images/ImageComponent';
import ImageFolderComponent from '../../component/Images/ImageFolderComponent';

const ImagesScreen = () => {
  const [tab, setTab] = useState('IMAGES');
  const [folderId, setFolderId] = useState('');

  const handleFolderClick = folderId => {
    setFolderId(folderId);
    setTab('IMAGES');
  };

  const renderHeader = () => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={'IMAGES'}
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
        title={'IMAGES'}
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={tab == 'IMAGES' ? Color.Black : Color.White}
        fontFamily={Font.medium}
        marginTop={verticalScale(15)}
        onPress={() => setTab('IMAGES')}
      />

      <CustomeButton
        buttonColor={tab == 'FOLDERS' ? Color.White : Color.theme1}
        buttonWidth={scale(150)}
        buttonHeight={scale(45)}
        title={'FOLDERS'}
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
          colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
          style={styles.headerContainer}>
          {renderHeader()}

          {buttons()}
        </LinearGradient>

        {tab == 'IMAGES' && <ImageComponent folderId={folderId} />}
        {tab == 'FOLDERS' && (
          <ImageFolderComponent onFolderClick={handleFolderClick} />
        )}
      </View>
    );
  };

  return <View style={{flex: 1}}>{renderBody()}</View>;
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
  title: {fontSize: scale(20), fontFamily: Font.medium},
  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(10),
  },
});
