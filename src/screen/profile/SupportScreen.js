import React, {useCallback, useState, memo} from 'react';
import {
  FlatList,
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
import { scale,verticalScale } from '../../custome/Responsive';
import Font from '../../component/Font';
import CustomeButton from '../../custome/CustomeButton';
import {launchImageLibrary} from 'react-native-image-picker';
import Api from '../../Api/EndPoint';
import {apiPost} from '../../Api/ApiService';
import Loader from '../../component/Loader';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import CustomeInputField from '../../custome/CustomeInputField';

const issueData = [
  {issueName: 'Bug Report'},
  {issueName: 'Feedback'},
  {issueName: 'Issues'},
  {issueName: 'Suggestions'},
];

const options = {
  mediaType: 'photo',
  quality: 1,
  selectionLimit: 1,
};

const SupportScreen = () => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [visible, setVisible] = useState(false);
  const [imageFile, setImageFile] = useState({});
  const [issueDesc, setIssueDesc] = useState('');
  const [selectedIssueIndex, setSelectedIssueIndex] = useState(null);

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
    if (imageFile?.name && selectedIssue) {
      submit();
    } else {
      const message =
        !imageFile?.name && !selectedIssue
          ? 'Please enter issue detail'
          : !imageFile?.name
          ? 'Please attach the screenshot of your issue'
          : 'Please select issue';
      showMessageonTheScreen(message);
    }
  }, [imageFile, selectedIssue, submit]);

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
        title="SUPPORT"
        iconColor={Color.Black}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
      />
    ),
    [],
  );

  const renderIssue = useCallback(
    ({item, index}) => {
      const isSelected = selectedIssue === item.issueName;
      return (
        <View>
          <Pressable
            style={[
              styles.issueView,
              {backgroundColor: isSelected ? Color.theme1 : Color.WhiteDefault},
            ]}
            onPress={() => {
              setSelectedIssue(item.issueName);
              setSelectedIssueIndex(index);
            }}>
            <Text
              style={[
                styles.dot,
                {backgroundColor: isSelected ? Color.White : Color.Black},
              ]}
            />
            <Text
              style={[
                styles.issue,
                {color: isSelected ? Color.White : Color.Gray},
              ]}>
              {item.issueName}
            </Text>
          </Pressable>
          {selectedIssueIndex === index && (
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
              inputContainerStyles={styles.inputContainerStyle}
            />
          )}
        </View>
      );
    },
    [selectedIssue, selectedIssueIndex, issueDesc],
  );

  const renderBody = useCallback(
    () => (
      <ScrollView
        style={styles.bodyContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.issueHeading}>Please let us know</Text>
        <FlatList
          data={issueData}
          renderItem={renderIssue}
          style={{marginTop: verticalScale(10)}}
          keyExtractor={(item, index) => index.toString()}
        />
        <Text style={styles.note}>
          We will email you back as soon as possible.
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
            {imageFile.uri ? '' : 'Attach screenshot of issue'}
          </Text>
        </View>
      </ScrollView>
    ),
    [handleSelectFromGallery, renderIssue, imageFile],
  );

  return (
    <View style={styles.container}>
      <Loader visible={visible} />
      <StatusBar backgroundColor={Color.WhiteDefault} />
      {renderHeader()}
      {renderBody()}
      <CustomeButton
        buttonColor={Color.theme1}
        buttonWidth="90%"
        buttonHeight={scale(45)}
        title="SUBMIT"
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
  headerTitleStyle: {color: Color.Black, fontSize: scale(20)},
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
});
