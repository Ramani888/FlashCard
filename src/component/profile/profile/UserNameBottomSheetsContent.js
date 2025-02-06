import React, {useCallback} from 'react';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomeInputField from '../../../custome/CustomeInputField';
import {scale, verticalScale} from '../../../custome/Responsive';
import Color from '../../Color';
import CustomeButton from '../../../custome/CustomeButton';
import Font from '../../Font';
import AntDesign from 'react-native-vector-icons/AntDesign';
import strings from '../../../language/strings';

const {height} = Dimensions.get('window');

const UserNameBottomSheetsContent = ({closeUserNameBottomSheet}) => {
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^[a-zA-Z0-9]+$/, 'Only letters and numbers are allowed')
      .required('Username is required'),
  });

  const handleSubmit = useCallback(
    (values, {resetForm}) => {
      resetForm();
      closeUserNameBottomSheet();
    },
    [closeUserNameBottomSheet],
  );

  const handlePressClose = useCallback(() => {
    closeUserNameBottomSheet();
  }, [closeUserNameBottomSheet]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeButton} onPress={handlePressClose}>
        <AntDesign name="close" size={scale(15)} color={Color.Black} />
      </Pressable>
      <Text style={styles.title}>{strings.selectUsername}</Text>

      <View style={styles.separator} />
      <Formik
        initialValues={{username: ''}}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.formContainer}>
            <CustomeInputField
              placeholder={strings.enterUsername}
              placeholderTextColor={Color.mediumGray}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
              marginTop={verticalScale(10)}
              width="100%"
              errors={errors.username}
              touched={touched.username}
              inputStyles={styles.inputStyles}
              inputContainerStyles={styles.inputContainerStyle}
            />
            <CustomeButton
              buttonColor={Color.theme1}
              buttonWidth="100%"
              title={strings.confirm}
              borderRadius={scale(10)}
              fontSize={scale(15)}
              fontColor={Color.White}
              fontFamily={Font.semiBold}
              marginTop={verticalScale(height * 0.03)}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

export default React.memo(UserNameBottomSheetsContent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: verticalScale(10),
    paddingTop: verticalScale(2),
    marginHorizontal: scale(10),
  },
  formContainer: {
    marginTop: verticalScale(15),
  },
  inputContainerStyle: {
    borderWidth: scale(1),
    borderColor: Color.LightGray,
    borderRadius: scale(10),
    backgroundColor: Color.White,
    height: verticalScale(45),
  },
  inputStyles: {
    fontSize: scale(13),
    color: Color.Black,
    fontFamily: Font.regular,
    height: verticalScale(45),
  },
  closeButton: {
    height: scale(26),
    width: scale(26),
    borderRadius: scale(13),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.WhiteDefault,
    position: 'absolute',
    top: verticalScale(-35),
    right: 0,
  },
  title: {
    fontSize: scale(20),
    color: Color.Black,
    fontFamily: Font.medium,
    textAlign: 'center',
    paddingBottom: verticalScale(10),
  },
  separator: {
    borderBottomWidth: scale(0.7),
    borderBottomColor: Color.LightGray,
  },
});
