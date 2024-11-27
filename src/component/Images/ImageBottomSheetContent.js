import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Color from '../Color';
import Font from '../Font';
import CustomeButton from '../../custome/CustomeButton';
import {launchImageLibrary} from 'react-native-image-picker';
import showMessageonTheScreen from '../ShowMessageOnTheScreen';

const ImageBottomSheetContent = ({closeBottomSheet, title, uploadeImage}) => {
  const [imageFile, setImageFile] = useState({});

  const handleSubmit = useCallback(() => {
    if (imageFile?.name) {
      uploadeImage(imageFile);
      closeBottomSheet();
    } else {
      showMessageonTheScreen('Please select the image');
    }
  }, [closeBottomSheet, imageFile]);

  const options = {
    mediaType: 'photo',
    quality: 1,
    selectionLimit: 1,
  };

  const handleSelectFromGallery = async () => {
    const result = await launchImageLibrary(options);
    const data = result.assets;
    const file = {
      uri: data[0].uri,
      type: data[0].type,
      name: data[0].fileName,
    };
    setImageFile(file);
  };

  return (
    <ScrollView style={styles.container}>
      {/* <Pressable style={styles.closeButton} onPress={closeBottomSheet}>
        <AntDesign name="close" size={wp('4%')} color={Color.Black} />
      </Pressable> */}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.separator} />
      <Pressable onPress={handleSelectFromGallery}>
        <Image
          source={require('../../Assets/Img/imageFram.png')}
          style={[
            styles.image,
            {
              marginBottom: imageFile?.name ? hp('1%') : hp('2%'),
            },
          ]}
          resizeMode="contain"
        />
        {imageFile?.name && (
          <Text style={styles.imageName}>{imageFile?.name}</Text>
        )}
      </Pressable>
      <CustomeButton
        buttonColor={Color.theme1}
        buttonWidth="90%"
        title="DONE"
        borderRadius={wp('2.5%')}
        fontSize={wp('4%')}
        fontColor={Color.White}
        fontFamily={Font.semiBold}
        alignSelf="center"
        marginBottom={hp('0.5%')}
        onPress={handleSubmit}
      />
    </ScrollView>
  );
};

export default React.memo(ImageBottomSheetContent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: hp('27.7%'),
  },
  title: {
    fontSize: wp('5%'),
    color: Color.Black,
    fontFamily: Font.medium,
    textAlign: 'center',
    paddingBottom: hp('1%'),
  },
  separator: {
    borderBottomWidth: wp('0.25%'),
    borderBottomColor: Color.LightGray,
  },
  image: {
    height: hp('10%'),
    width: wp('20%'),
    alignSelf: 'center',
    marginVertical: hp('2%'),
  },
  closeButton: {
    height: wp('6%'),
    width: wp('6%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.WhiteDefault,
    position: 'absolute',
    
    right: wp('2%'),
  },
  imageName: {
    fontSize: wp('3.5%'),
    color: Color.Black,
    fontFamily: Font.medium,
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
});
