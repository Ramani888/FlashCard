import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { scale } from '../custome/Responsive';
import Color from './Color';
import Font from './Font';
import useTheme from './Theme';
import strings from '../language/strings';

const NoDataView = ({content, noDataViewStyle, noDataTextStyle}) => {
  const colorTheme = useTheme()
  return (
    <View style={[styles.noDataView, noDataViewStyle]}>
      <Text style={[styles.noDataText, noDataTextStyle,{color:colorTheme.textColor}]}>
        {content ? content : strings.noDataFound}
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
