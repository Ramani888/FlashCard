import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import CustomeHeader from '../../custome/CustomeHeader';
import Color from '../../component/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import Font from '../../component/Font';
import CustomeButton from '../../custome/CustomeButton';
import {launchImageLibrary} from 'react-native-image-picker';
import Api from '../../Api/EndPoint';
import {apiPost} from '../../Api/ApiService';
import Loader from '../../component/Loader';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';

const issueData = [
  {issueName: 'Bug Report'},
  {issueName: 'Feedback'},
  {issueName: 'Issues'},
  {issueName: 'Suggestions'},
  {issueName: 'ETC'},
];

const SupportScreen = () => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [visible, setVisible] = useState(false);
  const [imageFile, setImageFile] = useState({});

  // =================================== Api ================================ //

  const submit = async () => {
    var formdata = new FormData();
    formdata.append('image', imageFile);
    formdata.append('supportType', selectedIssue);
    formdata.append('userId', global.user?._id);
    try {
      setVisible(true);
      const response = await apiPost(Api.support, '', formdata);
      if (response?.success == true) {
        showMessageonTheScreen(response?.message);
        setSelectedIssue('');
        setImageFile({});
      }
    } catch (error) {
      console.log('error in upload image api', error);
    } finally {
      setVisible(false);
    }
  };

  // =================================== Api ================================ //

  const handleSubmit = () => {
    if (imageFile?.name && selectedIssue) {
      submit();
    } else {
      if (!imageFile?.name && !selectedIssue) {
        showMessageonTheScreen('Please enter issue detail');
      } else {
        !imageFile?.name &&
          showMessageonTheScreen('Please attach the screenshot of your issue');
        !selectedIssue && showMessageonTheScreen('Please select issue');
      }
    }
  };

  const options = {
    mediaType: 'photo',
    quality: 1,
    selectionLimit: 1,
  };

  const handleSelectFromGallery = async () => {
    const result = await launchImageLibrary(options);
    const data = result.assets;
    const file = {
      uri: data[0].uri,
      type: data[0].type,
      name: data[0].fileName,
    };
    setImageFile(file);
  };

  const renderHeader = () => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={'SUPPORT'}
        iconColor={Color.Black}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
      />
    );
  };

  const renderIssue = ({item}) => {
    const isSelected = selectedIssue === item?.issueName;

    return (
      <Pressable
        style={[
          styles.issueView,
          {backgroundColor: isSelected ? Color.theme1 : Color.WhiteDefault},
        ]}
        onPress={() => setSelectedIssue(item?.issueName)}>
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
          {item?.issueName}
        </Text>
      </Pressable>
    );
  };

  const renderBody = () => {
    return (
      <View style={styles.bodyContainer}>
        <Text style={styles.issueHeading}>Please let us know</Text>
        <View>
          <FlatList
            data={issueData}
            renderItem={renderIssue}
            style={{marginTop: verticalScale(10)}}
          />
          <Text style={styles.note}>
            We will email you back as soon as posible.
          </Text>
        </View>
        <Pressable
          style={{marginTop: verticalScale(70), alignItems: 'center'}}
          onPress={() => handleSelectFromGallery()}>
          {imageFile?.uri ? (
            <Image
              source={{uri: imageFile?.uri}}
              style={[
                styles.image,
                {borderRadius: scale(5), marginTop: verticalScale(30)},
              ]}
            />
          ) : (
            <Image
              source={require('../../Assets/Img/imageFram.png')}
              style={styles.image}
            />
          )}
          <Text style={styles.screenshotText}>
            {imageFile?.uri ? '' : 'Attach screenshot of issue'}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
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
        onPress={() => handleSubmit()}
      />
    </View>
  );
};

export default React.memo(SupportScreen);

const styles = StyleSheet.create({
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
  screenshotText: {
    fontSize: scale(15),
    color: Color.mediumGray,
    fontFamily: Font.regular,
    marginTop: verticalScale(10),
  },
  image: {width: scale(95), height: scale(95)},
});
