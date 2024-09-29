import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import CustomeHeader from '../../custome/CustomeHeader';
import Color from '../../component/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import Font from '../../component/Font';
import CustomeButton from '../../custome/CustomeButton';

const issueData = [
  {issueName: 'Bug Report'},
  {issueName: 'Feedback'},
  {issueName: 'Issues'},
  {issueName: 'Suggestions'},
  {issueName: 'ETC'},
];

const SupportScreen = () => {
  const [selectedIssue, setSelectedIssue] = useState('');

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
        <View style={{marginTop:verticalScale(70),alignItems:'center'}}>
          <Image
            source={require('../../Assets/Img/imageFram.png')}
            style={styles.image}
          />
          <Text style={styles.screenshotText}>Attach screenshot of issue</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
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
        onPress={() => ''}
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
    marginTop:verticalScale(10)
  },
  image: {width: scale(95), height: scale(95)},
});
