import React, {useCallback} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Color from '../../component/Color';
import CustomeHeader from '../../custome/CustomeHeader';
import Font from '../../component/Font';

const AboutUsScreen = () => {
  const renderHeader = useCallback(() => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={'ABOUT US'}
        iconColor={Color.Black}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
      />
    );
  }, []);

  return (
    <View style={{flex: 1}}>
      {renderHeader()}
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Bible Flashcards & AI was created by a born again Christian with a
            mission to equip the saints with powerful tools to study God's Word
            anywhere, anytime. This app is designed to help believers strengthen
            their memory, grow in evangelism, and sharpen their apologetics
            skills, ensuring you're always prepared to share the Gospel in any
            situation.
          </Text>

          <Text style={styles.paragraph}>
            Our tools allow you to quickly grasp teachings, Scripture, history,
            and much more, while building an organized treasure trove of content
            that’s easy to access and reference. Whether you're learning alone
            or with others, Bible Flashcards & AI helps you retain what you've
            studied and always be ready in and out of season, no matter who you
            meet.
          </Text>

          <Text style={styles.paragraph}>
            With no barriers to entry, this app ensures that every believer can
            be fully equipped to live out their faith effectively. Key features
            include AI-powered Bible assistance, customizable flashcards,
            notetaking, image organization, and the ability to easily share and
            copy study material.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default React.memo(AboutUsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    backgroundColor: Color.transparent,
    height: hp('12%'),
    alignItems: 'flex-end',
  },
  headerTitleStyle: {
    color: Color.Black,
    fontSize: wp('5%'),
  },
  heading: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    textAlign: 'center',
    color: Color.Black,
  },
  paragraph: {
    fontSize: wp('4%'),
    marginBottom: hp('2%'),
    lineHeight: hp('2.8%'),
    textAlign: 'justify',
    color: Color.Black,
  },
  bold: {
    fontFamily: Font.bold,
  },
  listItem: {
    fontSize: wp('4%'),
    marginBottom: hp('1%'),
    paddingLeft: wp('2.5%'),
    lineHeight: hp('2.8%'),
    color: Color.Black,
  },
  extra: {
    marginBottom: hp('2%'),
  },
  section: {
    marginBottom: hp('2.5%'),
    backgroundColor: '#fff',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    elevation: wp('0.5%'),
    margin: wp('4%'),
    marginTop: hp('1%'),
  },
});
