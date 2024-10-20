import React, {useCallback} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import Color from '../../component/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import CustomeHeader from '../../custome/CustomeHeader';

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
            Bible Flashcards & AI** was created by a born again Christian with a
            mission to equip the saints with powerful tools to study God's Word
            anywhere, anytime. This app is designed to help believers strengthen
            their memory, grow in evangelism, and sharpen their apologetics
            skills, ensuring you're always prepared to share the Gospel in any
            situation.
          </Text>

          <Text style={[styles.paragraph,{marginTop:verticalScale(-23)}]}>
            Our tools allow you to quickly grasp teachings, Scripture, history,
            and much more, while building an organized treasure trove of content
            that’s easy to access and reference. Whether you're learning alone
            or with others, **Bible Flashcards & AI** helps you retain what
            you've studied and always be ready in and out of season, no matter
            who you meet.
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
    height: verticalScale(90),
    alignItems: 'flex-end',
  },
  headerTitleStyle: {
    color: Color.Black,
    fontSize: scale(20),
  },
  heading: {
    fontSize: scale(20),
    fontWeight: 'bold',
    marginBottom: verticalScale(15),
    textAlign: 'center',
    color: Color.Black,
  },
  paragraph: {
    fontSize: scale(14),
    marginBottom: verticalScale(10),
    lineHeight: verticalScale(21),
    textAlign: 'justify',
    color: Color.Black,
  },
  bold: {
    fontWeight: 'bold',
  },
  listItem: {
    fontSize: scale(14),
    marginBottom: verticalScale(5),
    paddingLeft: scale(10),
    lineHeight: verticalScale(21),
    color: Color.Black,
  },
  extra: {marginBottom: verticalScale(10)},
  section: {
    marginBottom: verticalScale(20),
    backgroundColor: '#fff',
    padding: scale(15),
    borderRadius: scale(10),
    elevation: scale(1),
    margin: scale(15),
    marginTop: verticalScale(5),
  },
});
