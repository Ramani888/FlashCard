import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../Color';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeButton from '../../../custome/CustomeButton';
import Font from '../../Font';
import CustomeModal from '../../../custome/CustomeModal';
import ImageModalContent from './ImageModalContent';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImageBottomSheetContent from './ImageBottomSheetContent';

const {height, width} = Dimensions.get('window');

const imageData = [
  {
    image:
      'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
  },
  {
    image:
      'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
  },
  {
    image:
      'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
  },
  {
    image:
      'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
  },
  {
    image:
      'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
  },
  {
    image:
      'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
  },
  {
    image:
      'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
  },
  {
    image:
      'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
  },
  {
    image:
      'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
  },
  {
    image:
      'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
  },
  {
    image:
      'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
  },
  {
    image:
      'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
  },
  {
    image:
      'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
  },
  {
    image:
      'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
  },
  {
    image:
      'https://webneel.com/daily/sites/default/files/images/daily/08-2018/1-nature-photography-spring-season-mumtazshamsee.jpg',
  },
];

const ImageComponent = () => {
  const threeDotIconRef = useRef(null);
  const refRBSheet = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [imageUrl, setImageUrl] = useState('');

  const openModal = useCallback((item, isLastItem) => {
    threeDotIconRef.current.measureInWindow((x, y, width, height) => {
      const offsetY = isLastItem ? -height - 15 : height + 15;
      setModalPosition({x: x - width * 3.3, y: y + offsetY});
      setModalVisible(true);
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const openBottomSheet = () => {
    refRBSheet.current.open();
  };

  const closeBottomSheet = () => {
    refRBSheet.current.close();
  };

  const BottomSheets = useCallback(() => {
    return (
      <RBSheet
        ref={refRBSheet}
        height={height * 0.35}
        openDuration={250}
        draggable={true}
        customStyles={{
          container: styles.bottomSheetContainer,
        }}>
        <View style={styles.sheetContainer}>
          <ImageBottomSheetContent
            closeBottomSheet={closeBottomSheet}
            title={'UPLOADE IMAGES'}
            setImageUrl={setImageUrl}
          />
        </View>
      </RBSheet>
    );
  }, [imageUrl]);

  const renderImage = useCallback(
    ({item}) => {
      return (
        <View style={styles.imageContainer}>
          <Image source={{uri: item?.image}} style={styles.image} />
          <Pressable
            ref={threeDotIconRef}
            onPress={() => openModal(item)}
            style={styles.pressableIcon}>
            <Entypo
              name="dots-three-vertical"
              size={scale(13)}
              color={Color.Black}
              style={styles.dotsIcon}
            />
          </Pressable>
        </View>
      );
    },
    [openModal], 
  );

  const renderBody = () => {
    return (
      <View style={styles.bodyContainer}>
        <FlatList
          data={imageData}
          renderItem={renderImage}
          numColumns={3}
          keyExtractor={(_, index) => index.toString()} 
        />
        {BottomSheets()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderBody()}
      <CustomeButton
        buttonColor={Color.theme1}
        buttonWidth="90%"
        buttonHeight={scale(45)}
        title="UPLOAD IMAGES"
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={Color.White}
        fontFamily={Font.semiBold}
        marginTop={verticalScale(15)}
        position="absolute"
        alignSelf="center"
        bottom={verticalScale(10)}
        onPress={() => {
          openBottomSheet();
        }}
      />
      <CustomeModal
        visible={modalVisible}
        onClose={closeModal}
        closeModal={false}
        mainPadding={scale(5)}
        content={<ImageModalContent closeModal={closeModal} />}
        width={scale(145)}
        justifyContent="flex-end"
        borderRadius={20}
        modalContainerStyle={[
          styles.modal,
          {top: modalPosition.y, left: modalPosition.x},
        ]}
      />
    </View>
  );
};

export default React.memo(ImageComponent);

const styles = StyleSheet.create({
  container: {
    height: height * 0.79,
  },
  bodyContainer: {
    marginBottom: verticalScale(60),
  },
  imageContainer: {
    margin: scale(5.5),
    position: 'relative', 
  },
  image: {
    width: scale(105),
    height: scale(105),
    borderRadius: scale(10),
  },
  pressableIcon: {
    position: 'absolute',
    right: scale(5),
    top: verticalScale(5),
  },
  dotsIcon: {
    backgroundColor: Color.WhiteDefault,
    borderRadius: scale(5),
    padding: scale(7),
  },
  bottomSheetContainer: {
    alignItems: 'center',
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
  },
  sheetContainer: {
    flexDirection: 'row',
    gap: scale(50),
    marginVertical: verticalScale(15),
  },
});
