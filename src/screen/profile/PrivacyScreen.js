import React, {useCallback} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {scale, verticalScale, moderateScale} from '../../custome/Responsive';
import Color from '../../component/Color';
import Font from '../../component/Font';
import CustomeHeader from '../../custome/CustomeHeader';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';

const TermsScreen = () => {
  const colorTheme = useTheme();

  const renderHeader = useCallback(() => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={strings.privacyAndTerms}
        iconColor={colorTheme.textColor}
        containerStyle={styles.headerStyle}
        titleStyle={[styles.headerTitleStyle, {color: colorTheme.textColor}]}
      />
    );
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: colorTheme.background1}}>
      {renderHeader()}
      <ScrollView style={styles.container}>
        <View style={[styles.section,{backgroundColor:colorTheme.listAndBoxColor}]}>
          <View style={styles.contentContainer}>
            <Text style={[styles.title,{color:colorTheme.textColor}]}>
              Bible Flashcards & AI: Terms of Agreement & Privacy Policy
            </Text>
            <Text style={[styles.date,{color:colorTheme.textColor}]}>Last updated: October 7th, 2024</Text>
            <Text style={[styles.text,{color:colorTheme.textColor}]}>
              By signing up for and using Bible Flashcards & AI (the "App"), you
              ("User") agree to the following Terms of Agreement and Privacy
              Policy. These terms outline the obligations, restrictions, and
              privacy policies associated with the use of this App. Please read
              carefully before creating an account.
            </Text>

            <Text style={[styles.subTitle,{color:colorTheme.textColor}]}>1. User Information and Access</Text>
            <Text style={[styles.text,{color:colorTheme.textColor}]}>
              By creating an account, you agree that any information you input,
              upload, or save in the App can be viewed and used by the Bible
              Flashcards & AI team as deemed necessary. This includes, but is
              not limited to, usage for app improvement, analytics, and
              troubleshooting.
            </Text>

            <Text style={[styles.subTitle,{color:colorTheme.textColor}]}>2. Public Content</Text>
            <Text style={[styles.text,{color:colorTheme.textColor}]}>
              When toggling content to "Public Mode," you agree that such
              content can be viewed, shared, copied, or used by other users. You
              are responsible for ensuring that any public content complies with
              all terms outlined here.
            </Text>

            <Text style={[styles.subTitle,{color:colorTheme.textColor}]}>3. Email Subscription</Text>
            <Text style={[styles.text,{color:colorTheme.textColor}]}>
              By signing up with your email, you are automatically subscribed to
              our email list. We reserve the right to email you regarding
              updates, news, roadmaps, or information about other apps and
              services. You may unsubscribe at any time using the link provided
              in the emails.
            </Text>

            <Text style={[styles.subTitle,{color:colorTheme.textColor}]}>4. Appropriate Usage</Text>
            <Text style={[styles.text,{color:colorTheme.textColor}]}>
              The App is intended for Bible study and religious content only.
              Users agree not to upload or store content unrelated to these
              purposes, including but not limited to personal pictures,
              irrelevant documents, or non-religious materials. If other types
              of content created or uploaded in the app can somehow tie into the
              allowed content, then that is allowed.
            </Text>

            <Text style={[styles.subTitle,{color:colorTheme.textColor}]}>5. Cloud Storage and Data Loss</Text>
            <Text style={[styles.text,{color:colorTheme.textColor}]}>
              Your content is saved in the cloud. Bible Flashcards & AI is not
              responsible for any lost data, whether caused by technical issues,
              user error, or external factors. It is recommended that users back
              up their important data independently.
            </Text>

            <Text style={[styles.subTitle,{color:colorTheme.textColor}]}>
              6. Pricing and Subscription Tiers
            </Text>
            <Text style={[styles.text,{color:colorTheme.textColor}]}>
              The pricing for subscription tiers, including any paid or free
              versions of the App, can change at any time. Changes will be
              communicated via email or in-app notifications.
            </Text>

            <Text style={[styles.subTitle,{color:colorTheme.textColor}]}>
              7. Content Creation and Storage Limits
            </Text>
            <Text style={[styles.text,{color:colorTheme.textColor}]}>
              We reserve the right to pause or discontinue your content if it
              consumes an excessive amount of storage. While we offer paid tiers
              to mitigate these issues, unknown future demands and scalability
              could result in changes.
            </Text>

            <Text style={[styles.subTitle,{color:colorTheme.textColor}]}>
              8. Advertisements for Paid Subscribers
            </Text>
            <Text style={[styles.text,{color:colorTheme.textColor}]}>
              Even if you are a paid subscriber, you acknowledge and agree that
              advertisements may still be shown, for example, when using our
              AI-powered tools, due to unpredictable compute and storage usage.
            </Text>

            <Text style={[styles.subTitle,{color:colorTheme.textColor}]}>
              9. Account Suspension or Termination
            </Text>
            <Text style={[styles.text,{color:colorTheme.textColor}]}>
              We reserve the right to delete, suspend, or discontinue your
              account at any time if we feel you are misusing the App for
              purposes outside of Bible study, church, or religious content.
              Prohibited activities include, but are not limited to, using the
              app for unlawful purposes, attempting to interfere with
              functionality or security of the app, and posting or transmitting
              offensive, inappropriate, or harmful content.
            </Text>

            <Text style={[styles.subTitle,{color:colorTheme.textColor}]}>10. Data Privacy and Security</Text>
            <Text style={[styles.text,{color:colorTheme.textColor}]}>
              While we strive to maintain the security of your data, we cannot
              guarantee complete protection against breaches or privacy issues.
              Bible Flashcards & AI is not responsible for any data breaches but
              will take reasonable measures to keep your information safe and
              secure.
            </Text>

            <Text style={[styles.subTitle,{color:colorTheme.textColor}]}>11. Changes to the Terms</Text>
            <Text style={[styles.text,{color:colorTheme.textColor}]}>
              Bible Flashcards & AI reserves the right to modify these terms at
              any time. Continued use of the App constitutes acceptance of the
              updated terms.
            </Text>

            <Text style={[styles.subTitle,{color:colorTheme.textColor}]}>12. Refunds</Text>
            <Text style={[styles.text,{color:colorTheme.textColor}]}>
              As soon as payment goes through when purchasing a subscription,
              there is no refund. Simply cancel and you will not be charged the
              following month.
            </Text>

            <Text style={[styles.subTitle,{color:colorTheme.textColor}]}>13. Governing Law</Text>
            <Text style={[styles.text,{color:colorTheme.textColor}]}>
              These Terms of Agreement and Privacy Policy will be governed by
              and construed in accordance with the laws of where the app is
              registered under. Any disputes arising from the use of this App
              shall be resolved under the jurisdiction the app was first
              registered under.
            </Text>

            <Text style={[styles.text,{color:colorTheme.textColor}]}>
              By creating an account and using the App, you acknowledge that you
              have read, understood, and agree to abide by these Terms of
              Agreement and Privacy Policy.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(10),
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
  section: {
    marginBottom: verticalScale(20),
    backgroundColor: Color.White,
    elevation: scale(2),
    margin: scale(6),
    marginTop: verticalScale(5),
    padding: scale(15),
    borderRadius: scale(10),
  },
  contentContainer: {
    paddingBottom: verticalScale(40),
  },
  title: {
    fontSize: moderateScale(22),
    fontFamily: Font.bold,
    textAlign: 'center',
    marginBottom: verticalScale(10),
    color: Color.Black,
  },
  date: {
    fontSize: moderateScale(14),
    textAlign: 'center',
    color: 'gray',
    marginBottom: verticalScale(20),
  },
  subTitle: {
    fontSize: moderateScale(18),
    fontFamily: Font.bold,
    marginVertical: verticalScale(10),
    color: Color.Black,
  },
  text: {
    fontSize: moderateScale(14),
    lineHeight: verticalScale(21),
    marginBottom: verticalScale(10),
    color: Color.Black,
    textAlign: 'justify',
  },
});

export default TermsScreen;
