import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import { scale,verticalScale } from '../../custome/Responsive';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Color from '../Color';
import Font from '../Font';
import CustomeButton from '../../custome/CustomeButton';
import {launchImageLibrary} from 'react-native-image-picker';
import showMessageonTheScreen from '../ShowMessageOnTheScreen';

const {height, width} = Dimensions.get('window');

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
    <View style={styles.container}>
      <Pressable style={styles.closeButton} onPress={closeBottomSheet}>
        <AntDesign name="close" size={scale(15)} color={Color.Black} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.separator} />
      <Pressable onPress={handleSelectFromGallery}>
        <Image
          source={require('../../Assets/Img/imageFram.png')}
          style={[
            styles.image,
            {
              marginBottom: imageFile?.name
                ? verticalScale(5)
                : verticalScale(15),
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
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={Color.White}
        fontFamily={Font.semiBold}
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
    height: verticalScale(80),
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
    top: verticalScale(-20),
    right: scale(9),
  },
  imageName: {
    fontSize: scale(14),
    color: Color.Black,
    fontFamily: Font.medium,
    textAlign: 'center',
    marginBottom: verticalScale(6),
  },
});
