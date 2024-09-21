import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Color from '../component/Color';
import CustomeHeader from '../custome/CustomeHeader';
import {scale, verticalScale} from 'react-native-size-matters';
import CustomeInputField from '../custome/CustomeInputField';
import Feather from 'react-native-vector-icons/Feather';
import CustomeButton from '../custome/CustomeButton';
import Font from '../component/Font';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../component/Screen';

const GlobalLiveFeedScreen = () => {
  const navigation = useNavigation();
  const [searchHashtags, setSearchHashtags] = useState('');
  const [selectedButton, setSelectedButton] = useState('VERSES');

  const renderHeader = () => {
    return (
      <CustomeHeader
        goBack={true}
        title={'GLOBAL LIVE FEED'}
        iconStyle={styles.iconStyle}
        containerStyle={styles.headerStyle}
        titleStyle={styles.headerTitleStyle}
      />
    );
  };

  const renderButtons = useCallback(
    () => (
      <View style={styles.buttonsContainer}>
        {['VERSES', 'Q + As', 'GENERAL'].map((title, index) => (
          <CustomeButton
            key={index}
            buttonColor={selectedButton == title ? Color.theme1 : Color.White}
            buttonWidth={scale(100)}
            buttonHeight={scale(45)}
            title={title}
            borderRadius={scale(10)}
            fontSize={scale(15)}
            fontColor={selectedButton == title ? Color.White : Color.Black}
            fontFamily={Font.semiBold}
            onPress={() => {
              setSelectedButton(title);
              //   title == 'VERSES' && navigation.navigate(ScreenName.verses);
              //   title == 'Q + As' && navigation.navigate(ScreenName.qaScreen);
            }}
          />
        ))}
      </View>
    ),
    [selectedButton],
  );

  const renderBody = () => {
    return (
      <LinearGradient
        colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
        style={styles.headerContainer}>
        {renderHeader()}
        <Image
          source={require('../Assets/Img/earthBigIcon.png')}
          style={styles.earthImage}
        />
        <View style={styles.searchContainer}>
          <View style={styles.hashIconView} onPress={() => setSearch(!search)}>
            <Feather
              name="hash"
              size={scale(10)}
              color={Color.White}
              style={styles.hashIcon}
            />
          </View>
          <CustomeInputField
            placeholder={'Search Hashtags'}
            placeholderTextColor={Color.Gainsboro}
            onChangeText={setSearchHashtags}
            value={searchHashtags}
            backgroundColor={'#3a6675'}
            borderWidth={0}
            height={verticalScale(40)}
            width={scale(280)}
          />
        </View>
        {renderButtons()}
      </LinearGradient>
    );
  };
  return <View>{renderBody()}</View>;
};

export default React.memo(GlobalLiveFeedScreen);

const styles = StyleSheet.create({
  headerContainer: {
    height: verticalScale(338),
  },
  headerStyle: {
    height: verticalScale(90),
    alignItems: 'flex-end',
  },
  headerTitleStyle: {
    color: Color.White,
    fontSize: scale(20),
  },
  iconStyle: {
    bottom: verticalScale(1),
  },
  earthImage: {
    width: scale(96),
    height: scale(96),
    alignSelf: 'center',
    marginTop: verticalScale(10),
  },
  searchContainer: {
    marginHorizontal: scale(15),
    backgroundColor: '#3a6675',
    borderWidth: scale(0.5),
    borderColor: '#3a6675',
    height: verticalScale(45),
    borderRadius: scale(10),
    marginTop: verticalScale(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  hashIconView: {
    backgroundColor: '#496e7c',
    borderRadius: scale(5),
    padding: scale(7),
    marginLeft: scale(8),
  },
  hashIcon: {
    backgroundColor: '#040415',
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: scale(15),
    marginTop: verticalScale(20),
  },
});
