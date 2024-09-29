import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState, memo, useEffect} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../Color';
import Font from '../../Font';
import CustomeModal from '../../../custome/CustomeModal';
import PdfModalContent from './PdfModalContent';
import CustomeButton from '../../../custome/CustomeButton';
import PdfBottomSheetContent from './PdfBottomSheetContent';
import RBSheet from 'react-native-raw-bottom-sheet';
import {apiGet, apiPost} from '../../../Api/ApiService';
import Api from '../../../Api/EndPoint';
import Loader from '../../Loader';

const {width, height} = Dimensions.get('window');

const pdfData = [{name: 'pdf1'}, {name: 'pdf2'}, {name: 'pdf3'}];

const PdfComponent = memo(() => {
  const [visible, setVisible] = useState(false);
  const [pdfData, setPdfData] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [pdfName, setPdfName] = useState('');
  const [pdfColor, setPdfColor] = useState('');
  const threeDotIconRef = useRef(null);
  const refRBSheet = useRef(null);

  useEffect(() => {
    getPdf(false);
  }, []);

  // ================================= Api =============================== //

  const getPdf = async message => {
    try {
      message == false && setVisible(true);
      const response = await apiGet(`${Api.pdf}?userId=${global.user?._id}`);
      console.log('response', response);
      setPdfData(response);
    } catch (error) {
      console.log('error in getpdf api', error);
    } finally {
      setVisible(false);
    }
  };

  const createPdf = async pdf => {
    var formdata = new FormData();
    formdata.append('userId', global.user?._id);
    formdata.append('color', pdfColor);
    formdata.append('pdf', pdf);
    console.log('formdata',formdata)
    try {
      setVisible(true);
      const response = await apiPost(Api.pdf,'',formdata);
      console.log('response',response)
      if (response) {
        getPdf(true);
      }
    } catch (error) {
      console.log('error in upload pdf api', error);
    }
  };

  // ================================= End =============================== //

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
        height={height * 0.71}
        openDuration={250}
        draggable={true}
        customStyles={{
          container: styles.bottomSheetContainer,
        }}>
        <View style={styles.sheetContainer}>
          <PdfBottomSheetContent
            closeBottomSheet={closeBottomSheet}
            title={'UPLOAD PDF'}
            setName={setPdfName}
            name={pdfName}
            setColor={setPdfColor}
            color={pdfColor}
            create={createPdf}
          />
        </View>
      </RBSheet>
    );
  }, [pdfName, pdfColor]);

  const renderPdf = useCallback(
    ({item, index}) => {
      const isLastItem = index === pdfData.length - 1;
      return (
        <View style={styles.itemContainer}>
          <Pressable style={styles.folderItem} onPress={() => ''}>
            <Text style={styles.folderName}>{item.name}</Text>
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
        </View>
      );
    },
    [openModal],
  );

  const renderBody = () => {
    return (
      <View style={styles.listContainer}>
        <FlatList
          data={pdfData}
          renderItem={renderPdf}
          keyExtractor={item => item.name}
        />
        {BottomSheets()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Loader visible={visible} />
      {renderBody()}
      <CustomeButton
        buttonColor={Color.theme1}
        buttonWidth="90%"
        buttonHeight={scale(45)}
        title="UPLOAD PDF"
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
        content={<PdfModalContent closeModal={closeModal} />}
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
});

export default PdfComponent;

const styles = StyleSheet.create({
  container: {
    height: height * 0.79,
  },
  listContainer: {
    marginTop: verticalScale(15),
  },
  itemContainer: {
    marginHorizontal: scale(10),
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
