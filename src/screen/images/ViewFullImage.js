import React, {useEffect, useRef, useCallback} from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation, useRoute} from '@react-navigation/native';
import Pinchable from 'react-native-pinchable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Color from '../../component/Color';

const screenWidth = Dimensions.get('window').width;

const ViewFullImage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const flatListRef = useRef(null);
  const {data, imageIndex: index} = route.params;

  const getItemLayout = useCallback(
    (_, index) => ({
      length: screenWidth,
      offset: screenWidth * index,
      index,
    }),
    [],
  );

  const renderImage = useCallback(
    ({item}) => (
      <Pinchable style={styles.pinchableContainer}>
        <Image
          source={{uri: item?.url}}
          style={styles.image}
          resizeMode="contain"
        />
      </Pinchable>
    ),
    [],
  );

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.closeContainer}>
        <AntDesign
          name="closecircleo"
          size={scale(22)}
          color={Color.White}
          style={styles.close}
        />
      </Pressable>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderImage}
        keyExtractor={keyExtractor}
        pagingEnabled
        horizontal
        initialScrollIndex={index}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default React.memo(ViewFullImage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Black,
  },
  pinchableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth,
    height: screenWidth,
    // borderRadius: scale(5),
  },
  closeContainer: {
    position: 'absolute',
    right: scale(15),
    top: verticalScale(40),
    zIndex: 2,
  },
  close: {
    zIndex: 3,
  },
});
