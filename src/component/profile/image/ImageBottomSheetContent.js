import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
  } from 'react-native';
  import React, {useCallback} from 'react';
  import {scale, verticalScale} from 'react-native-size-matters';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  import Color from '../../Color';
  import Font from '../../Font';
  import CustomeButton from '../../../custome/CustomeButton';
  
  const {height, width} = Dimensions.get('window');
  
  const ImageBottomSheetContent = ({closeBottomSheet, title}) => {

    const handleSubmit = useCallback(() => {
      closeBottomSheet();
    }, [closeBottomSheet]);
  
    return (
      <View style={styles.container}>
        <Pressable style={styles.closeButton} onPress={closeBottomSheet}>
          <AntDesign name="close" size={scale(15)} color={Color.Black} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.separator} />
        <Image
          source={require('../../../Assets/Img/imageFram.png')}
          style={styles.image}
        />
        <CustomeButton
          buttonColor={Color.theme1}
          buttonWidth="90%"
          title="DONE"
          borderRadius={scale(10)}
          fontSize={scale(15)}
          fontColor={Color.White}
          fontFamily={Font.semiBold}
          marginTop={verticalScale(5)}
          alignSelf={'center'}
          onPress={handleSubmit}
        />
      </View>
    );
  };
  
  export default React.memo(ImageBottomSheetContent);
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      fontSize: scale(20),
      color: Color.Black,
      fontFamily: Font.medium,
      textAlign: 'center',
      paddingBottom: height * 0.01,
    },
    separator: {
      borderBottomWidth: scale(1),
      borderBottomColor: Color.LightGray,
    },
    image: {
      height: scale(80),
      width: scale(80),
      alignSelf: 'center',
      marginVertical: verticalScale(15),
    },
    closeButton: {
      height: scale(26),
      width: scale(26),
      borderRadius: scale(13),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Color.WhiteDefault,
      position: 'absolute',
      top: verticalScale(-30),
      right: scale(9),
    },
  });
  