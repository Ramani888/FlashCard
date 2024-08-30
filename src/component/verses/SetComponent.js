import React, {useCallback, useMemo, useRef, useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Color from '../Color';
import Font from '../Font';
import {scale, verticalScale} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeButton from '../../custome/CustomeButton';
import CustomeModal from '../../custome/CustomeModal';
import ModalContent from './ModalContent';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheetContent from './BottomSheetContent';

const SetComponent = ({folderData}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const threeDotIconRef = useRef(null);
  const refRBSheet = useRef();

  const openModal = (item, isLastItem) => {
    threeDotIconRef.current.measureInWindow((x, y, width, height) => {
      const offsetY = isLastItem ? -height - 15 : height + 15;
      setModalPosition({x: x - width * 3.3, y: y + offsetY});
      setModalVisible(true);
    });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const setData = useMemo(
    () => [
      {setTitle: 'GENESIS', subSet: 5},
      {setTitle: 'EXODUS', subSet: 3},
      {setTitle: 'LEVITICUS', subSet: 1},
      {setTitle: 'NUMBERS', subSet: 4},
      {setTitle: 'DUETIRENOMY', subSet: 2},
      {setTitle: 'JOSHUA', subSet: 5},
    ],
    [],
  );

  const closeBottomSheet = () => {
    refRBSheet.current.close();
  };

  const renderSet = useCallback(
    ({item, index}) => {
      const isLastItem = index === setData.length - 1;

      return (
        <View style={styles.itemContainer}>
          <View style={styles.setContainer}>
            <View style={styles.rowContainer}>
              <Image
                source={require('../../Assets/Img/bibleSign.png')}
                style={styles.bibleIcon}
                tintColor={folderData?.iconColor}
              />
              <Text style={styles.setTitle}>{item?.setTitle}</Text>
            </View>
            <View style={styles.rowWithGap}>
              <View style={styles.subSetContainer}>
                <Text style={styles.subSetText}>{item?.subSet}</Text>
                <Image
                  source={require('../../Assets/Img/cardIcon.png')}
                  style={styles.cardIcon}
                />
              </View>
              <Pressable
                ref={threeDotIconRef}
                onPress={() => openModal(item, isLastItem)}>
                <Entypo
                  name="dots-three-vertical"
                  size={scale(13)}
                  color={Color.Black}
                  style={styles.dotsIcon}
                />
              </Pressable>
            </View>
          </View>
          <View style={[styles.folderContainer, {alignSelf: 'flex-start'}]}>
            <Image
              source={require('../../Assets/Img/folder.png')}
              style={styles.folderIcon}
            />
            <Text style={styles.folderText}>{folderData?.FolderName}</Text>
          </View>
        </View>
      );
    },
    [setData],
  );

  const BottomSheets = useCallback(() => {
    return (
      <RBSheet
        ref={refRBSheet}
        height={verticalScale(510)}
        openDuration={250}
        draggable={true}
        customStyles={{
          container: styles.bottomSheetContainer,
        }}>
        <View style={styles.sheetContainer}>
          <BottomSheetContent
            closeBottomSheet={closeBottomSheet}
            title={'CREATE SET'}
          />
        </View>
      </RBSheet>
    );
  }, []);

  const renderBody = useCallback(
    () => (
      <View style={styles.bodyContainer}>
        <FlatList
          data={setData}
          renderItem={renderSet}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
        />
        <CustomeButton
          buttonColor={Color.theme1}
          buttonWidth="100%"
          buttonHeight={scale(45)}
          title="CREATE SET"
          borderRadius={scale(10)}
          fontSize={scale(15)}
          fontColor={Color.White}
          fontFamily={Font.semiBold}
          marginTop={verticalScale(15)}
          position={'absolute'}
          bottom={verticalScale(10)}
          onPress={() => refRBSheet.current.open()}
        />
        {BottomSheets()}
      </View>
    ),
    [setData, renderSet],
  );

  return (
    <View style={{flex: 1}}>
      {renderBody()}
      <CustomeModal
        visible={modalVisible}
        onClose={closeModal}
        closeModal={false}
        mainPadding={scale(5)}
        content={<ModalContent closeModal={closeModal} type={'Set'} />}
        width={scale(145)}
        height={scale(195)}
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

export default React.memo(SetComponent);

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    marginHorizontal: scale(15),
    marginTop: verticalScale(20),
    paddingBottom: verticalScale(55),
  },
  itemContainer: {
    marginBottom: verticalScale(15),
  },
  setContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Color.White,
    padding: scale(5),
    borderRadius: scale(10),
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bibleIcon: {
    width: scale(13),
    height: scale(40),
  },
  setTitle: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(10),
  },
  rowWithGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(15),
  },
  subSetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  subSetText: {
    fontSize: scale(15),
    color: Color.Black,
  },
  cardIcon: {
    width: scale(16),
    height: scale(13),
  },
  dotsIcon: {
    backgroundColor: Color.WhiteDefault,
    borderRadius: scale(5),
    padding: scale(10),
  },
  folderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    backgroundColor: Color.White,
    height: scale(35),
    borderRadius: scale(10),
    marginTop: verticalScale(5),
    paddingHorizontal: scale(5), // Add some padding if needed
    alignSelf: 'flex-start', // Ensure the width wraps content
  },
  folderIcon: {
    width: scale(26),
    height: scale(26),
  },
  folderText: {
    fontSize: scale(12),
    color: Color.Black,
    fontFamily: Font.regular,
    textTransform:'capitalize'
  },
  modal: {
    position: 'absolute',
    borderRadius: scale(10),
    backgroundColor: Color.White,
    elevation: scale(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: scale(0.3),
    shadowRadius: scale(4),
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
