import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Color from '../Color';
import {scale, verticalScale} from 'react-native-size-matters';
import Font from '../Font';
import {BlurView} from '@react-native-community/blur';
import Entypo from 'react-native-vector-icons/Entypo';

const CardGridLayout = ({
  item,
  updateCard,
  threeDotIconRef,
  setItem,
  openCardModal,
}) => {
  return (
    <View style={{margin: scale(5)}}>
      <View style={styles.gridCardHeader}>
        <View>
          <Text style={styles.cardTitle}>{item.top}</Text>
          <Text style={[styles.cardNumber, {paddingLeft: scale(12)}]}>
            1 : 3 - 7
          </Text>
        </View>
        <View style={[styles.cardActions, styles.gridCardAction]}>
          <Pressable>
            <Image
              source={require('../../Assets/Img/infoIcon.png')}
              style={styles.infoIcon}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              const isBlurred = item?.isBlur == 0 ? 1 : 0;
              updateCard(
                item?._id,
                item.top,
                item.bottom,
                item?.note,
                isBlurred,
              );
            }}>
            {item?.isBlur ? (
              <Entypo
                name="eye-with-line"
                size={scale(11)}
                color={Color.Grey}
                style={styles.dotsIcon}
              />
            ) : (
              <Entypo
                name="eye"
                size={scale(11)}
                color={Color.Grey}
                style={styles.dotsIcon}
              />
            )}
          </Pressable>
          <Pressable
            ref={threeDotIconRef}
            onPress={() => {
              setItem(item);
              openCardModal();
            }}
            style={styles.dotIconView}>
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
        {item?.isBlur && (
          <BlurView
            style={styles.absoluteBlur}
            blurType="light"
            blurAmount={10}
            overlayColor={'rgba(255, 255, 255, 0)'}
          />
        )}
        <Text style={[styles.cardDesc, {width: scale(130)}]}>
          {item.bottom}
        </Text>
      </View>
    </View>
  );
};

export default CardGridLayout;

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
  dotIconView: {},
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
  modal: {
    position: 'absolute',
    backgroundColor: Color.White,
    elevation: scale(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: scale(0.3),
    shadowRadius: scale(4),
    borderRadius: scale(10),
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 1000,
  },
  gridCardHeader: {
    backgroundColor: '#ececec',
    width: scale(150),
    paddingVertical: scale(20),
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    alignItems: 'flex-start',
  },
  gridCardAction: {flexDirection: 'column', paddingVertical: verticalScale(5)},
});
