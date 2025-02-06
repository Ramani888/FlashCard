import React, {useCallback} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Color from '../../component/Color';
import CustomeHeader from '../../custome/CustomeHeader';
import Font from '../../component/Font';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';

const AboutUsScreen = () => {
  const colorTheme = useTheme();

  const renderHeader = useCallback(() => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={strings.aboutUs}
        iconColor={colorTheme.textColor}
        containerStyle={styles.headerStyle}
        titleStyle={[styles.headerTitleStyle, {color: colorTheme.textColor}]}
      />
    );
  }, [colorTheme.textColor]);

  return (
    <View style={[styles.container, {backgroundColor: colorTheme.background1}]}>
      {renderHeader()}
      <ScrollView style={styles.container}>
        <View
          style={[
            styles.section,
            {backgroundColor: colorTheme.listAndBoxColor},
          ]}>
          <Text style={[styles.paragraph, {color: colorTheme.textColor}]}>
            {strings.aboutUsParagraph1}
          </Text>

          <Text style={[styles.paragraph, {color: colorTheme.textColor}]}>
            {strings.aboutUsParagraph2}
          </Text>

          <Text style={[styles.paragraph, {color: colorTheme.textColor}]}>
            {strings.aboutUsParagraph3}
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
