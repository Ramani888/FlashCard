import {StyleSheet, Text, View, ViewStyle, TextStyle} from 'react-native';
import React, {memo, useMemo} from 'react';
import {scale} from '../custome/Responsive';
import Color from './Color';
import Font from './Font';
import useTheme from './Theme';
import strings from '../language/strings';

interface NoDataViewProps {
  content?: string;
  noDataViewStyle?: ViewStyle;
  noDataTextStyle?: TextStyle;
  isCommunityScreen?: boolean;
}

const NoDataView = memo<NoDataViewProps>(
  ({content, noDataViewStyle, noDataTextStyle, isCommunityScreen}) => {
    const colorTheme = useTheme();

    // Memoize text color calculation
    const textColor = useMemo(() => {
      if (noDataTextStyle) {
        return isCommunityScreen ? colorTheme.textColor : Color.White;
      }
      return colorTheme.textColor;
    }, [noDataTextStyle, isCommunityScreen, colorTheme.textColor]);

    return (
      <View style={[styles.noDataView, noDataViewStyle]}>
        <Text style={[styles.noDataText, noDataTextStyle, {color: textColor}]}>
          {content || strings.noDataFound}
        </Text>
      </View>
    );
  },
);

NoDataView.displayName = 'NoDataView';

export default NoDataView;

const styles = StyleSheet.create({
  noDataView: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  noDataText: {
    fontSize: scale(18),
    color: Color.Black,
    fontFamily: Font.medium,
  },
});
