import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {scale, verticalScale, moderateScale} from '../../custome/Responsive';
import Color from '../../component/Color';
import Font from '../../component/Font';
import CustomeHeader from '../../custome/CustomeHeader';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const HEADER_HEIGHT = verticalScale(60);
const TAB_HEIGHT = verticalScale(65);

const TermsScreen = ({route}) => {
  const colorTheme = useTheme();
  const initialTab = route?.params?.tab || 'terms';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (route?.params?.tab) {
      setActiveTab(route.params.tab);
    }
  }, [route?.params?.tab]);

  const renderHeader = useCallback(() => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={''}
        iconColor={colorTheme.textColor}
        containerStyle={styles.headerStyle}
        titleStyle={[styles.headerTitleStyle, {color: colorTheme.textColor}]}
      />
    );
  }, [colorTheme.textColor]);

  const renderTabs = () => {
    return (
      <View style={[styles.tabOuterContainer, {backgroundColor: '#E8E8E8'}]}>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.8}
          onPress={() => setActiveTab('terms')}>
          {activeTab === 'terms' ? (
            <LinearGradient
              colors={colorTheme.gradientTheme}
              style={styles.activeTabGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Text style={[styles.tabText, styles.activeTabText]}>
                Terms and Conditions
              </Text>
            </LinearGradient>
          ) : (
            <Text style={styles.tabText}>Terms and Conditions</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.8}
          onPress={() => setActiveTab('privacy')}>
          {activeTab === 'privacy' ? (
            <LinearGradient
              colors={colorTheme.gradientTheme}
              style={styles.activeTabGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Text style={[styles.tabText, styles.activeTabText]}>
                Privacy Policy
              </Text>
            </LinearGradient>
          ) : (
            <Text style={styles.tabText}>Privacy Policy</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderPrivacyPolicy = () => {
    return (
      <View style={styles.contentContainer}>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          Bible Flashcards & Notes ("we," "our," or "us") operates from the
          United States. This Privacy Policy explains how we collect, use, and
          protect information when you use our mobile application.
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          1. Information We Collect
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          We collect the following information:
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          Account Information{'\n'}
          • Email address{'\n'}
          • Encrypted authentication credentials
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          User Content{'\n'}
          • Flashcards{'\n'}
          • Notes{'\n'}
          • Study content you create or modify
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          Device & Usage Information{'\n'}
          • Basic device information (such as device type, operating system){'\n'}
          • App usage data{'\n'}
          • Advertising identifiers (for ads)
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          We do not collect:{'\n'}
          • Government ID numbers{'\n'}
          • Financial information{'\n'}
          • Precise GPS location{'\n'}
          • Sensitive personal data
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          2. How We Use Information
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          We use your information to:{'\n'}
          • Create and manage your account{'\n'}
          • Provide secure cloud storage and synchronization{'\n'}
          • Display advertisements{'\n'}
          • Maintain and improve app functionality{'\n'}
          • Prevent abuse and maintain security
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          3. Advertising
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          We use third-party advertising services, including:
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          Google AdMob
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          AdMob may collect device identifiers and usage data to provide
          personalized or non-personalized advertisements in accordance with its
          own privacy policy.
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          Users in certain regions (such as the European Economic Area) may be
          presented with consent options for personalized advertising where
          required by law.
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          4. Cloud Storage & Security
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          User content is stored using secure cloud infrastructure provided by
          third-party hosting services.
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          We implement reasonable administrative and technical safeguards.
          However, no system can guarantee absolute security.
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          5. Data Retention
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          We retain your information for as long as your account remains active.
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          You may request deletion of your account and associated data by
          contacting: support@biblestudycards.app
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          Upon verified request, we will delete your account and stored data
          within a reasonable timeframe, unless retention is required by law.
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          6. International Users
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          If you access the app from outside the United States, you understand
          that your information may be processed and stored in the United
          States.
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          We comply with applicable data protection laws, including general
          principles of the GDPR and other international privacy regulations
          where applicable.
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          7. Children's Privacy
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          This app is not directed to children under 13 years of age. We do not
          knowingly collect personal information from children under 13.
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          If we become aware that such information has been collected, we will
          delete it promptly.
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          8. Changes to This Policy
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          We may update this Privacy Policy periodically. Updates will be
          reflected by revising the "Last Updated" date.
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          Continued use of the app after changes means you accept the revised
          policy.
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          10. Contact
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          If you have questions about this Privacy Policy, contact:{'\n'}
          support@biblestudycards.app
        </Text>
      </View>
    );
  };

  const renderTermsAndConditions = () => {
    return (
      <View style={styles.contentContainer}>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          By accessing or using Bible Flashcards & Notes, you agree to these
          Terms & Conditions.
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          1. Use of the App
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          You agree to use the app only for lawful purposes and in
          accordance with these Terms.
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          You may not:
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          • Attempt to disrupt or reverse engineer the app{'\n'}
          • Upload unlawful or harmful content{'\n'}
          • Use the app to violate any applicable laws
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          2. Accounts
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          You are responsible for maintaining the confidentiality of your
          account credentials.
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          You are responsible for all activities that occur under your
          account.
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          3. User Content
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          You retain ownership of the content you create within the app.
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          By using the app, you grant us a limited license to store and
          process your content solely for the purpose of operating and
          improving the service.
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          We are not responsible for user-generated content.
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          4. Disclaimer
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          The app is provided "as is" and "as available."
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          We make no warranties regarding:{'\n'}
          • Accuracy of content{'\n'}
          • Availability of service{'\n'}
          • Continuous or error-free operation
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          5. Limitation of Liability
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          To the fullest extent permitted by law, we are not liable for
          indirect, incidental, special, or consequential damages arising
          from use of the app.
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          6. Account Termination
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          We reserve the right to suspend or terminate accounts that violate
          these Terms.
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          Users may request account deletion at any time.
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          7. Changes to Terms
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          We may update these Terms periodically. Continued use of the app
          constitutes acceptance of updated Terms.
        </Text>

        <Text style={[styles.subTitle, {color: colorTheme.textColor}]}>
          9. Governing Law
        </Text>
        <Text style={[styles.text, {color: colorTheme.textColor}]}>
          These Terms shall be governed by the laws of the United States and
          the State of California.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.mainContainer, {backgroundColor: colorTheme.background1}]}>
      {/* Header - Fixed */}
      <View style={styles.headerContainer}>
        {renderHeader()}
      </View>

      {/* Tabs - Fixed */}
      <View style={styles.tabsContainer}>
        {renderTabs()}
      </View>

      {/* Content - Scrollable */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.contentCard, {backgroundColor: colorTheme.background}]}>
          {activeTab === 'privacy' ? renderPrivacyPolicy() : renderTermsAndConditions()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main container takes full screen
  mainContainer: {
    flex: 1,
  },
  
  // Header container - Fixed height
  headerContainer: {
    height: HEADER_HEIGHT,
  },
  headerStyle: {
    backgroundColor: Color.transparent,
    height: HEADER_HEIGHT,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerTitleStyle: {
    color: Color.Black,
    fontSize: scale(20),
  },
  
  // Tabs container - Fixed height
  tabsContainer: {
    height: TAB_HEIGHT,
    justifyContent: 'center',
  },
  tabOuterContainer: {
    flexDirection: 'row',
    marginHorizontal: scale(16),
    backgroundColor: '#E8E8E8',
    borderRadius: scale(25),
    padding: scale(4),
    gap: scale(6),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(22),
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  activeTabGradient: {
    width: '100%',
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(22),
  },
  tabText: {
    fontSize: moderateScale(15),
    fontFamily: Font.medium,
    color: '#999999',
  },
  activeTabText: {
    fontFamily: Font.bold,
    color: Color.White,
  },
  
  // Scrollable content area - Takes remaining space
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(20),
  },
  contentCard: {
    backgroundColor: Color.White,
    padding: scale(20),
    borderRadius: scale(12),
    marginTop: verticalScale(10),
  },
  
  // Content text styles
  contentContainer: {
    paddingBottom: verticalScale(10),
  },
  subTitle: {
    fontSize: moderateScale(16),
    fontFamily: Font.bold,
    marginTop: verticalScale(15),
    marginBottom: verticalScale(8),
    color: Color.Black,
  },
  text: {
    fontSize: moderateScale(14),
    fontFamily: Font.regular,
    lineHeight: verticalScale(22),
    marginBottom: verticalScale(12),
    color: Color.Black,
    textAlign: 'left',
  },
});

export default TermsScreen;
