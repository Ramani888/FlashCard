import React, {useCallback, useState, memo} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomeHeader from '../../custome/CustomeHeader';
import Color from '../../component/Color';
import {scale, verticalScale} from '../../custome/Responsive';
import Font from '../../component/Font';
import CustomeButton from '../../custome/CustomeButton';
import {launchImageLibrary} from 'react-native-image-picker';
import Api from '../../Api/EndPoint';
import {apiPost} from '../../Api/ApiService';
import Loader from '../../component/Loader';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import CustomeInputField from '../../custome/CustomeInputField';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';

const options = {
  mediaType: 'photo',
  quality: 1,
  selectionLimit: 1,
};

const SupportScreen = () => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [visible, setVisible] = useState(false);
  const [imageFile, setImageFile] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const colorTheme = useTheme();

  const submit = useCallback(async () => {
    const formdata = new FormData();
    formdata.append('image', imageFile);
    formdata.append('supportType', selectedIssue);
    formdata.append('supportMessage', issueDesc);
    formdata.append('userId', global.user?._id);

    try {
      setVisible(true);
      const response = await apiPost(Api.support, '', formdata);
      if (response?.success) {
        showMessageonTheScreen(response.message);
        setSelectedIssue('');
        setImageFile({});
      }
    } catch (error) {
      console.log('error in upload image api', error);
    } finally {
      setVisible(false);
    }
  }, [imageFile, selectedIssue, issueDesc]);

  const handleSubmit = useCallback(() => {
    if (selectedIssue) {
      submit();
    } else {
      const message = strings.selectIssue;
      showMessageonTheScreen(message);
    }
  }, [selectedIssue, submit]);

  const handleSelectFromGallery = useCallback(async () => {
    const result = await launchImageLibrary(options);
    const data = result.assets;
    if (data && data.length > 0) {
      setImageFile({
        uri: data[0].uri,
        type: data[0].type,
        name: data[0].fileName,
      });
    }
  }, []);

  const renderHeader = useCallback(
    () => (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={strings.profileTab2}
        iconColor={colorTheme.textColor}
        containerStyle={styles.headerStyle}
        titleStyle={[styles.headerTitleStyle, {color: colorTheme.textColor}]}
      />
    ),
    [colorTheme.textColor],
  );

  const renderIssue = useCallback(
    issueName => {
      const isSelected = selectedIssue === issueName;
      return (
        <View>
          <Pressable
            style={[
              styles.issueView,
              {
                backgroundColor: isSelected
                  ? Color.theme1
                  : colorTheme.listAndBoxColor,
              },
            ]}
            onPress={() => {
              setSelectedIssue(issueName);
            }}>
            <Text
              style={[
                styles.dot,
                {
                  backgroundColor: isSelected
                    ? Color.White
                    : colorTheme.textColor,
                },
              ]}
            />
            <Text
              style={[
                styles.issue,
                {color: isSelected ? Color.White : colorTheme.textColor},
              ]}>
              {issueName}
            </Text>
          </Pressable>
          {isSelected && (
            <CustomeInputField
              placeholder={`Enter ${selectedIssue}...`}
              height={verticalScale(180)}
              onChangeText={setIssueDesc}
              value={issueDesc}
              textArea
              placeholderTextColor={Color.LightGray}
              borderRadius={scale(10)}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              backgroundColor={colorTheme.listAndBoxColor}
              inputStyles={{color: colorTheme.textColor}}
              inputContainerStyles={styles.inputContainerStyle}
            />
          )}
        </View>
      );
    },
    [
      selectedIssue,
      issueDesc,
      colorTheme.listAndBoxColor,
      colorTheme.textColor,
    ],
  );

  const renderBody = useCallback(
    () => (
      <ScrollView
        style={styles.bodyContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.issueHeading}>{strings.pleaseLetusKnow}</Text>
        {renderIssue(strings.bugReport)}
        {renderIssue(strings.feedback)}
        {renderIssue(strings.issues)}
        {renderIssue(strings.suggestions)}
        <Text style={[styles.inform, {color: colorTheme.textColor}]}>
          {strings.imformMessage}
        </Text>
        <View style={styles.screenshotContainer}>
          <Pressable onPress={handleSelectFromGallery}>
            <Image
              source={
                imageFile.uri
                  ? {uri: imageFile.uri}
                  : require('../../Assets/Img/imageFram.png')
              }
              style={imageFile.uri ? styles.selectedImage : styles.image}
            />
          </Pressable>
          <Text style={styles.screenshotText}>
            {imageFile.uri ? '' : strings.attachScreenShot}
          </Text>
        </View>
      </ScrollView>
    ),
    [handleSelectFromGallery, renderIssue, imageFile, colorTheme.textColor],
  );

  return (
    <View style={[styles.container, {backgroundColor: colorTheme.background1}]}>
      <Loader visible={visible} />
      <StatusBar backgroundColor={colorTheme.background1} />
      {renderHeader()}
      {renderBody()}
      <CustomeButton
        buttonColor={Color.theme1}
        buttonWidth="90%"
        buttonHeight={scale(45)}
        title={strings.submit}
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={Color.White}
        fontFamily={Font.semiBold}
        marginHorizontal={scale(15)}
        marginBottom={verticalScale(10)}
        onPress={handleSubmit}
      />
    </View>
  );
};

export default memo(SupportScreen);

const styles = StyleSheet.create({
  container: {flex: 1},
  headerStyle: {
    backgroundColor: Color.transparent,
    height: verticalScale(90),
    alignItems: 'flex-end',
  },
  headerTitleStyle: {
    color: Color.Black,
    fontSize: scale(20),
    textTransform: 'uppercase',
  },
  dot: {
    width: scale(7),
    height: scale(7),
    borderRadius: scale(3.5),
  },
  bodyContainer: {flex: 1, margin: scale(15)},
  issueView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(3),
    marginBottom: verticalScale(5),
    paddingHorizontal: scale(8),
    borderRadius: scale(5),
  },
  issueHeading: {
    fontSize: scale(15),
    color: Color.Gray,
    fontFamily: Font.regular,
    marginBottom: verticalScale(5),
  },
  issue: {
    fontSize: scale(14),
    fontFamily: Font.regular,
    paddingLeft: scale(10),
  },
  note: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    marginTop: verticalScale(10),
  },
  screenshotContainer: {
    marginVertical: verticalScale(100),
    alignItems: 'center',
  },
  screenshotText: {
    fontSize: scale(15),
    color: Color.mediumGray,
    fontFamily: Font.regular,
    marginTop: verticalScale(10),
  },
  inputContainerStyle: {
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    borderRadius: scale(10),
    marginBottom: verticalScale(15),
    backgroundColor: Color.White,
  },
  image: {
    width: scale(95),
    height: scale(95),
    alignSelf: 'center',
  },
  selectedImage: {
    width: scale(95),
    height: scale(95),
    alignSelf: 'center',
    borderRadius: scale(5),
    marginTop: verticalScale(30),
  },
  inform: {marginTop: verticalScale(10)},
});
