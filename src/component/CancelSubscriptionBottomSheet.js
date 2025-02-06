import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {scale, verticalScale} from 'react-native-size-matters';
import Font from './Font';
import Color from './Color';
import CustomeButton from '../custome/CustomeButton';
import strings from '../language/strings';

const CancelSubscriptionBottomSheet = ({
  item,
  colorTheme,
  closeSubscriptionBottomSheet,
  cancelSubscription,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Cancel Subscription</Text>
      <View
        style={[
          styles.subscriptionView,
          // {backgroundColor: colorTheme.subscriptionView},
        ]}>
        <View style={styles.subscriptionContainer}>
          <View style={styles.subscriptionInfo}>
            <Image
              source={{uri: item?.icon}}
              style={styles.subscriptionImage}
              resizeMode="contain"
            />
            <Text
              style={[styles.subscriptionName, {color: colorTheme.textColor}]}>
              {item?.name}
            </Text>
          </View>
          <View style={styles.subscriptionPriceContainer}>
            <Text style={styles.subscriptionPrice}>{item?.price}</Text>
          </View>
        </View>
        <View style={styles.bottomView}>
          {item?.points && item?.points[0] && (
            <View style={styles.creditView}>
              <Entypo
                name="dot-single"
                size={scale(20)}
                color={colorTheme.textColor}
              />
              <Text style={[styles.credit, {color: colorTheme.textColor}]}>
                {item?.points[0]}
              </Text>
            </View>
          )}
          {item?.points && item?.points[1] && (
            <View style={styles.creditView}>
              <Entypo
                name="dot-single"
                size={scale(20)}
                color={colorTheme.textColor}
              />
              <Text style={[styles.credit, {color: colorTheme.textColor}]}>
                {item?.points[1]}
              </Text>
            </View>
          )}
        </View>
      </View>

      <CustomeButton
        buttonColor={Color.theme1}
        buttonWidth="100%"
        buttonHeight={scale(45)}
        title={strings.confirm}
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={Color.White}
        fontFamily={Font.semiBold}
        marginTop={verticalScale(15)}
        bottom={verticalScale(10)}
        onPress={() => {
          cancelSubscription();
          closeSubscriptionBottomSheet();
        }}
      />
    </View>
  );
};

export default CancelSubscriptionBottomSheet;

const styles = StyleSheet.create({
  container: {width: '92%'},
  heading: {
    fontSize: scale(19),
    color: Color.Black,
    fontFamily: Font.medium,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: verticalScale(15),
  },
  subscriptionView: {
    backgroundColor: '#146D8B33',
    borderWidth: scale(2),
    paddingVertical: scale(5),
    borderRadius: scale(14),
    marginBottom: verticalScale(10),
    borderColor: Color.theme1,
  },
  subscriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  freeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: verticalScale(35),
  },
  subscriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscriptionImage: {
    width: scale(40),
    height: verticalScale(40),
    marginLeft: scale(8),
    marginTop: verticalScale(5),
  },
  subscriptionName: {
    fontSize: scale(16),
    fontFamily: Font.semiBold,
    color: Color.Black,
    textTransform: 'uppercase',
    paddingLeft: scale(10),
    width: scale(180),
  },
  subscriptionPriceContainer: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(10),
    backgroundColor: Color.theme1,
    marginRight: scale(10),
  },
  subscriptionPrice: {
    fontSize: scale(13),
    fontFamily: Font.regular,
    color: Color.White,
  },
  bottomView: {
    marginTop: verticalScale(5),
    gap: verticalScale(5),
  },
  creditView: {
    flexDirection: 'row',
    gap: scale(5),
    alignItems: 'center',
    marginLeft: scale(15),
  },
  credit: {
    fontSize: scale(15),
    fontFamily: Font.medium,
    color: Color.Black,
    marginTop: verticalScale(-5),
  },
  freeSubscription: {
    marginHorizontal: scale(15),
    paddingVertical: scale(5),
    marginTop: verticalScale(10),
  },
  freeName: {marginLeft: scale(-40)},
  selectedPlan: {
    width: scale(25),
    height: scale(25),
    position: 'absolute',
    right: scale(11),
  },
});
