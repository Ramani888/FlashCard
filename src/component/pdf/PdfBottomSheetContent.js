import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Color from '../Color';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import CustomeButton from '../../custome/CustomeButton';
import Font from '../Font';
import CustomeInputField from '../../custome/CustomeInputField';
import ColorCodePicker from '../cards/ColorCodePicker';
import showMessageonTheScreen from '../ShowMessageOnTheScreen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DocumentPicker from 'react-native-document-picker';

const {width, height} = Dimensions.get('window');

const PdfBottomSheetContent = ({
  closeBottomSheet,
  title,
  setName,
  name,
  setColor,
  color,
  initialData,
  create,
}) => {
  const [fileResponse, setFileResponse] = useState([]);

  const file = useMemo(
    () => ({
      name: fileResponse[0]?.name,
      type: fileResponse[0]?.type,
      uri: fileResponse[0]?.uri,
    }),
    [fileResponse],
  );

  useEffect(() => {
    if (initialData) {
      setName(initialData?.name);
      setColor(initialData?.color);
    }
  }, [initialData, setName, setColor]);

  const handleDocumentPick = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      if (response[0]?.type !== 'application/pdf') {
        showMessageonTheScreen('Please select a PDF file only');
        setFileResponse([]);
      } else {
        setFileResponse(response);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Unknown error:', err);
        throw err;
      }
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (name && color && fileResponse?.length > 0) {
      initialData ? create(initialData?._id, file) : create('', file);
      closeBottomSheet();
      setName('');
      setColor('');
    } else {
      showMessageonTheScreen('All fields are required');
    }
  }, [
    name,
    color,
    fileResponse,
    initialData,
    create,
    closeBottomSheet,
    setName,
    setColor,
    file,
  ]);

  const renderBody = useMemo(
    () => (
      <View style={styles.bodyContainer}>
        <Pressable style={styles.closeButton} onPress={closeBottomSheet}>
          <AntDesign name="close" size={scale(15)} color={Color.Black} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.separator} />

        <Pressable
          onPress={handleDocumentPick}
          style={styles.documentPickerContainer}>
          {fileResponse?.length > 0 ? (
            <Text style={styles.fileName}>{fileResponse[0]?.name}</Text>
          ) : (
            <Image
              source={require('../../Assets/Img/folderFram.png')}
              style={styles.folderImage}
            />
          )}
        </Pressable>

        <CustomeInputField
          placeholder="Create Name"
          placeholderTextColor={Color.mediumGray}
          onChangeText={setName}
          value={name}
          borderWidth={1}
          borderColor={Color.LightGray}
          inputContainerStyles={styles.inputContainer}
          inputStyles={styles.inputStyles}
        />

        <View style={styles.colorSection}>
          <Text style={styles.colorTitle}>Color</Text>
          <View style={styles.separator} />
          <View style={styles.colorOptionsContainer}>
            <View style={styles.colorOption}>
              <Text style={[styles.colorIndicator, {backgroundColor: color}]} />
            </View>
            <Text style={styles.orText}>Or</Text>
            <View style={[styles.colorOptionLarge, {backgroundColor: color}]} />
          </View>

          <ColorCodePicker setSelectedColor={setColor} selectedColor={color} />
        </View>
      </View>
    ),
    [
      closeBottomSheet,
      title,
      fileResponse,
      name,
      color,
      setName,
      setColor,
      handleDocumentPick,
    ],
  );

  return (
    <View style={styles.container}>
      {renderBody}
      <CustomeButton
        buttonColor={Color.theme1}
        buttonWidth="100%"
        title="DONE"
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={Color.White}
        fontFamily={Font.semiBold}
        marginTop={verticalScale(15)}
        onPress={handleSubmit}
      />
    </View>
  );
};

export default React.memo(PdfBottomSheetContent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: scale(15),
  },
  bodyContainer: {
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    borderRadius: scale(10),
    padding: scale(10),
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
  documentPickerContainer: {
    height: height * 0.12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    fontSize: scale(15),
    fontFamily: Font.medium,
    color: Color.Black,
  },
  folderImage: {
    width: width * 0.23,
    height: height * 0.12,
    alignSelf: 'center',
    marginTop: verticalScale(10),
  },
  inputContainer: {
    width: '100%',
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    paddingHorizontal: scale(8),
    backgroundColor: Color.White,
    borderRadius: scale(10),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
    height: verticalScale(45),
  },
  inputStyles: {
    height: verticalScale(45),
    fontSize: scale(13),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(5),
  },
  colorSection: {
    marginTop: verticalScale(10),
  },
  colorTitle: {
    fontSize: scale(20),
    color: Color.Black,
    fontFamily: Font.medium,
    textAlign: 'center',
    paddingBottom: verticalScale(5),
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
    right: scale(-7),
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(13),
  },
  colorOption: {
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    borderRadius: scale(10),
    width: width * 0.36,
    height: verticalScale(40),
    justifyContent: 'center',
  },
  colorIndicator: {
    width: scale(13),
    height: height * 0.05,
    borderRadius: scale(8),
    marginLeft: scale(5),
  },
  colorOptionLarge: {
    height: height * 0.06,
    width: width * 0.36,
    borderWidth: scale(1),
    borderRadius: scale(10),
    borderColor: Color.LightGray,
  },
  orText: {
    fontSize: scale(16),
    color: Color.Black,
    fontFamily: Font.medium,
  },
});