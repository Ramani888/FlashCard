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
            Welcome to <Text style={styles.bold}>Bible Study Toolkit</Text>, an
            all-in-one app created by a born-again Christian with the goal of
            equipping the saints for their journey with Jesus. Our mission is to
            provide believers with the tools they need to study the Word,
            evangelize effectively, and stay organized in their spiritual
            growth—anytime, anywhere.
          </Text>

          <Text style={styles.paragraph}>
            With <Text style={styles.bold}>Bible Study Toolkit</Text>, you can:
          </Text>
          <Text style={styles.listItem}>
            - Study and access Bible materials on the go
          </Text>
          <Text style={styles.listItem}>
            - Create custom flashcards and copy your friends' flashcards
          </Text>
          <Text style={styles.listItem}>
            - Add specific notes to each flashcard, allowing you to grasp and
            remember study material more effectively
          </Text>
          <Text style={styles.listItem}>
            - Save and organize images and PDFs for easy reference
          </Text>
          <Text style={styles.listItem}>
            - Create and organize notes effortlessly
          </Text>
          <Text style={styles.listItem}>
            - Use AI to assist with your study and evangelism efforts
          </Text>
          <Text style={[styles.listItem, styles.extra]}>
            - Equip yourself to share the Gospel with confidence
          </Text>

          <Text style={styles.paragraph}>
            This app was developed with a passion to serve fellow believers,
            built on a tight budget, but designed to meet the needs of many
            saints as it stands. We are always working on improvements and new
            features, driven by the needs of our community.
          </Text>

          <Text style={styles.paragraph}>
            If you find <Text style={styles.bold}>Bible Study Toolkit</Text>{' '}
            helpful, please consider becoming a monthly subscriber. Your support
            will help us continue to grow and implement even more tools to
            benefit believers worldwide.
          </Text>

          <Text style={styles.paragraph}>
            Thank you for being part of this journey with us as we strive to
            serve and grow together!
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
