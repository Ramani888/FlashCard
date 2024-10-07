import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import CustomeHeader from '../../custome/CustomeHeader';
import Color from '../../component/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import Font from '../../component/Font';

const PrivacyScreen = () => {
  const renderHeader = useCallback(() => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={'PRIVACY & TERMS'}
        iconColor={Color.Black}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
      />
    );
  }, []);

  const renderBody = useCallback(() => {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.heading}>
            Bible Study Toolkit: Terms of Agreement & Privacy Policy
          </Text>
          <Text style={styles.lastUpdated}>
            Last updated: October 7th, 2024
          </Text>
          <Text style={styles.paragraph}>
            By signing up for and using Bible Study Toolkit (the "App"), you
            ("User") agree to the following Terms of Agreement and Privacy
            Policy. These terms outline the obligations, restrictions, and
            privacy policies associated with the use of this App. Please read
            carefully before creating an account.
          </Text>

          {/* Section 1 */}
          <Text style={styles.sectionTitle}>
            1. User Information and Access
          </Text>
          <Text style={styles.paragraph}>
            By creating an account, you agree that any information you input,
            upload, or save in the App can be viewed and used by the Bible Study
            Toolkit team as deemed necessary. This includes, but is not limited
            to, usage for app improvement, analytics, and troubleshooting.
          </Text>

          {/* Section 2 */}
          <Text style={styles.sectionTitle}>2. Public Content</Text>
          <Text style={styles.paragraph}>
            When toggling content to "Public Mode," you agree that such content
            can be viewed, shared, copied, or used by other users. You are
            responsible for ensuring that any public content complies with all
            terms outlined here.
          </Text>

          {/* Section 3 */}
          <Text style={styles.sectionTitle}>3. Email Subscription</Text>
          <Text style={styles.paragraph}>
            By signing up with your email, you are automatically subscribed to
            our email list. We reserve the right to email you regarding updates,
            news, roadmaps, or information about other apps and services. You
            may unsubscribe at any time using the link provided in the emails.
          </Text>

          {/* Add remaining sections here */}
          <Text style={styles.sectionTitle}>4. Appropriate Usage</Text>
          <Text style={styles.paragraph}>
            The App is intended for Bible study, church, and religious content
            only. Users agree not to upload or store content unrelated to these
            purposes, including but not limited to personal pictures, irrelevant
            documents, or non-religious materials. If other types content
            created or uploaded in app can somehow tie into the allowed content,
            then that is allowed.
          </Text>

          {/* Continue with other sections similar to this */}
          <Text style={styles.sectionTitle}>
            5. Cloud Storage and Data Loss
          </Text>
          <Text style={styles.paragraph}>
            Your content is saved in the cloud. Bible Study Toolkit is not
            responsible for any lost data, whether caused by technical issues,
            user error, or external factors. It is recommended that users back
            up their important data independently.
          </Text>

          {/* Add all other sections following this same pattern */}
        </View>
      </ScrollView>
    );
  }, []);

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

export default React.memo(PrivacyScreen);

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Color.transparent,
    height: verticalScale(90),
    alignItems: 'flex-end',
  },
  headerTitleStyle: {
    color: Color.Black,
    fontSize: scale(20),
  },
  container: {
    flex: 1,
    padding: scale(10),
    backgroundColor: '#f9f9f9',
  },
  section: {
    marginBottom: verticalScale(20),
  },
  heading: {
    fontSize: scale(20),
    fontFamily: Font.bold,
    textAlign: 'center',
    marginBottom: verticalScale(10),
    color: Color.Black,
  },
  lastUpdated: {
    fontSize: scale(12),
    textAlign: 'center',
    marginBottom: verticalScale(15),
    color: '#555',
  },
  sectionTitle: {
    fontSize: scale(16),
    fontFamily: Font.bold,
    marginVertical: verticalScale(10),
    color: Color.Black,
  },
  paragraph: {
    fontSize: scale(14),
    lineHeight: verticalScale(20),
    marginBottom: verticalScale(10),
    color: '#333',
    textAlign: 'justify',
  },
});
