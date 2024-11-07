import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { scale } from '../custome/Responsive';
import Color from './Color';
import Font from './Font';

const NoDataView = ({content, noDataViewStyle, noDataTextStyle}) => {
  return (
    <View style={[styles.noDataView, noDataViewStyle]}>
      <Text style={[styles.noDataText, noDataTextStyle]}>
        {content ? content : 'No Data Found'}
      </Text>
    </View>
  );
};

export default NoDataView;

const styles = StyleSheet.create({
  noDataView: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  noDataText: {
    fontSize: scale(18),
    color: Color.Black,
    fontFamily: Font.medium,
  },
});
