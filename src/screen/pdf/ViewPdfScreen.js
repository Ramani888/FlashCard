import React, {useEffect, useState} from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import Pdf from 'react-native-pdf';
import {useIsFocused, useRoute} from '@react-navigation/native';

const ViewPdfScreen = () => {
  const route = useRoute();
  const isFocused = useIsFocused();
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl('');
    setUrl(route.params.url);
  }, [isFocused, route.params.url]);

  return (
    <View style={styles.container}>
      <Pdf
        source={{uri: url, cache: true}}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`current page: ${page}`);
        }}
        onError={error => {
          console.log(error);
        }}
        style={styles.pdf}
      />
    </View>
  );
};

export default React.memo(ViewPdfScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
