import React, {useMemo, useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View, Button} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeHeader from '../../custome/CustomeHeader';
import Color from '../../component/Color';
import Font from '../../component/Font';

const cardData = [
  {
    cardName: 'Hebrews',
    number: '3 : 3 - 10',
    cardDesc:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    cardName: 'Luke',
    number: '1 : 3 - 7',
    cardDesc:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    cardName: 'Luke',
    number: '1 : 3 - 7',
    cardDesc:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
];

const SetDetailScreen = () => {
  const [blurredCardIndices, setBlurredCardIndices] = useState([]);
  const [allBlurred, setAllBlurred] = useState(false);
  const route = useRoute();
  const {setName} = route.params;

  const header = useMemo(
    () => (
      <CustomeHeader
        goBack={true}
        threeDotIcon={true}
        headerBackgroundColor={Color.transparent}
        title={
          <View style={styles.titleContainer}>
            <Text style={styles.titleLine}>VERSES</Text>
            <Text style={styles.titleLine}>{setName}</Text>
          </View>
        }
        iconStyle={styles.iconStyle}
        titleStyle={styles.headerTitle}
        containerStyle={styles.headerStyle}
      />
    ),
    [setName],
  );

  const toggleBlur = index => {
    setBlurredCardIndices(prevState =>
      prevState.includes(index)
        ? prevState.filter(i => i !== index)
        : [...prevState, index]
    );
  };

  const blurAllCards = () => {
    if (allBlurred) {
      setBlurredCardIndices([]); // Clear all blur
    } else {
      setBlurredCardIndices(cardData.map((_, index) => index)); // Blur all cards
    }
    setAllBlurred(!allBlurred);
  };

  const renderCard = ({item, index}) => {
    const isBlurred = blurredCardIndices.includes(index);
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.cardName}</Text>
          <Text style={styles.cardNumber}>{item.number}</Text>
          <View style={styles.cardActions}>
            <Pressable>
              <Image
                source={require('../../Assets/Img/infoIcon.png')}
                style={styles.infoIcon}
              />
            </Pressable>
            <Pressable onPress={() => toggleBlur(index)}>
              <Entypo
                name="eye"
                size={scale(11)}
                color={Color.Grey}
                style={styles.dotsIcon}
              />
            </Pressable>
            <Pressable onPress={() => {}} style={styles.dotIconView}>
              <Entypo
                name="dots-three-vertical"
                size={scale(11)}
                color={Color.Grey}
                style={styles.dotsIcon}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.cardBody}>
          {isBlurred && (
            <BlurView
              style={styles.absoluteBlur}
              blurType="light"
              blurAmount={10}
              overlayColor={'rgba(255, 255, 255, 0)'}
            />
          )}
          <Text style={[styles.cardDesc]}>
            {item.cardDesc}
          </Text>
        </View>
      </View>
    );
  };

  const renderBody = useMemo(
    () => (
      <View style={styles.bodyContainer}>
        <FlatList
          data={cardData}
          renderItem={renderCard}
          keyExtractor={(item, index) => index.toString()}
          style={styles.flatList}
          showsVerticalScrollIndicator={false}
        />
        {/* <Button title={allBlurred ? "Unblur All" : "Blur All"} onPress={blurAllCards} /> */}
      </View>
    ),
    [blurredCardIndices, allBlurred], // Re-render the list if the blur state changes
  );

  return (
    <LinearGradient
      colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
      style={styles.container}>
      {header}
      {renderBody}
    </LinearGradient>
  );
};

export default React.memo(SetDetailScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    backgroundColor: Color.transparent,
    height: verticalScale(125),
    alignItems: 'flex-end',
  },
  headerTitle: {
    top: verticalScale(50),
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleLine: {
    fontSize: scale(20),
    color: Color.White,
    fontFamily: Font.medium,
  },
  iconStyle: {
    bottom: verticalScale(30),
  },
  bodyContainer: {
    flex: 1,
    marginHorizontal: scale(15),
  },
  flatList: {
    flex: 1,
  },
  cardContainer: {
    marginBottom: verticalScale(10),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ececec',
    paddingVertical: verticalScale(10),
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
  },
  cardTitle: {
    fontSize: scale(14),
    fontFamily: Font.medium,
    color: Color.Black,
    paddingLeft: scale(10),
  },
  cardNumber: {
    fontSize: scale(14),
    fontFamily: Font.medium,
    color: Color.Black,
    paddingLeft: scale(20),
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
    position: 'absolute',
    right: scale(10),
  },
  dotIconView: {
    // Add any styles specific to the dot icon view if needed
  },
  cardBody: {
    backgroundColor: Color.White,
    padding: scale(10),
    borderBottomLeftRadius: scale(10),
    borderBottomRightRadius: scale(10),
    position: 'relative',
    overflow: 'hidden',
  },
  cardDesc: {
    fontSize: scale(12),
    color: Color.Black,
    fontFamily: Font.regular,
  },
  infoIcon: {
    width: scale(24),
    height: scale(24),
  },
  dotsIcon: {
    backgroundColor: '#e0e0e0',
    borderRadius: scale(5),
    padding: scale(4),
  },
  absoluteBlur: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000, // Ensure the blur view is behind the text
  },
});
