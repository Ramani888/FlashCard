import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useMemo, useRef, useState, useCallback} from 'react';
import Color from '../Color';
import Font from '../Font';
import {scale, verticalScale} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomeModal from '../../custome/CustomeModal';
import ModalContent from './ModalContent';
import CustomeButton from '../../custome/CustomeButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheetContent from '../BottomSheetContent';
import { useNavigation } from '@react-navigation/native';

const FolderComponent = ({onFolderClick}) => {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const threeDotIconRef = useRef(null);
  const refRBSheet = useRef();

  const setData = useMemo(
    () => [
      {FolderName: 'SIN', iconColor: '#8da0ff'},
      {FolderName: 'BAPTISM', iconColor: '#ea80fc'},
      {FolderName: 'BIBLE', iconColor: '#ffd27f'},
    ],
    [],
  );

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

  const renderFolder = useCallback(
    ({item, index}) => {
      const isLastItem = index === setData.length - 1;
      return (
        <Pressable style={styles.folderItem} onPress={() => onFolderClick(item)}>
          <View style={styles.folderInfo}>
            <View
              style={[styles.iconColor, {backgroundColor: item.iconColor}]}
            />
            <Text style={styles.folderName}>{item.FolderName}</Text>
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
        </Pressable>
      );
    },
    [openModal],
  );

  const closeBottomSheet = () => {
    refRBSheet.current.close();
  };

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
          <BottomSheetContent closeBottomSheet={closeBottomSheet} title={'CREATE FOLDER'}/>
        </View>
      </RBSheet>
    );
  }, []);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderBody = () => {
    return (
      <View style={{flex: 1}}>
        <View style={styles.folderContainer}>
          <Text style={styles.folderText}>TRINITY</Text>
          <Entypo
            name="dots-three-vertical"
            size={scale(13)}
            color={Color.Black}
            style={styles.dotsIcon}
          />
        </View>

        <FlatList
          data={setData}
          renderItem={renderFolder}
          keyExtractor={keyExtractor}
          style={{marginTop: verticalScale(10)}}
        />
        {BottomSheets()}

        <CustomeButton
          buttonColor={Color.theme1}
          buttonWidth="100%"
          buttonHeight={scale(45)}
          title="CREATE FOLDER"
          borderRadius={scale(10)}
          fontSize={scale(15)}
          fontColor={Color.White}
          fontFamily={Font.semiBold}
          marginTop={verticalScale(15)}
          position={'absolute'}
          bottom={verticalScale(10)}
          onPress={() => refRBSheet.current.open()}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderBody()}
      <CustomeModal
        visible={modalVisible}
        onClose={closeModal}
        closeModal={false}
        mainPadding={scale(5)}
        content={<ModalContent closeModal={closeModal} type={'Folder'} />}
        width={scale(145)}
        height={scale(165)}
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

export default FolderComponent;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(15),
    marginTop: verticalScale(15),
    flex: 1,
  },
  folderContainer: {
    backgroundColor: Color.SandyBrown,
    borderRadius: scale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(7),
  },
  folderText: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(15),
  },

  folderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(7),
    backgroundColor: Color.White,
    borderRadius: scale(10),
    marginBottom: verticalScale(10),
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconColor: {
    width: scale(13),
    height: scale(30),
    borderRadius: scale(8),
  },
  folderName: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(10),
  },
  dotsIcon: {
    backgroundColor: Color.WhiteDefault,
    borderRadius: scale(5),
    padding: scale(10),
  },
  modal: {
    position: 'absolute',
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
