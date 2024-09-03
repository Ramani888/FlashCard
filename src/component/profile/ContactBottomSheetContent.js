import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomeInputField from '../../custome/CustomeInputField';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../component/Color';
import CustomeButton from '../../custome/CustomeButton';
import Font from '../Font';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ContactBottomSheetContent = ({closeContactBottomSheet}) => {
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^[a-zA-Z0-9]+$/, 'Only letters and numbers are allowed')
      .required('Username is required'),
  });

  const handleSubmit = useCallback(
    (values, {resetForm}) => {
      console.log(values);
      resetForm();
      closeContactBottomSheet();
    },
    [closeContactBottomSheet],
  );

  const handlePressClose = useCallback(() => {
    closeContactBottomSheet();
  }, [closeContactBottomSheet]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeButton} onPress={handlePressClose}>
        <AntDesign name="close" size={scale(15)} color={Color.Black} />
      </Pressable>
      <Text style={styles.title}>ADD CONTACT</Text>

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
              placeholder="Enter Username"
              placeholderTextColor={Color.mediumGray}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
              borderWidth={0.7}
              borderColor={Color.LightGray}
              height={verticalScale(45)}
              marginTop={verticalScale(10)}
              width="100%"
              errors={errors.username}
              touched={touched.username}
            />
            <CustomeButton
              buttonColor={Color.theme1}
              buttonWidth="100%"
              buttonHeight={scale(45)}
              title="CONFIRM"
              borderRadius={scale(10)}
              fontSize={scale(15)}
              fontColor={Color.White}
              fontFamily={Font.semiBold}
              marginTop={verticalScale(15)}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

export default React.memo(ContactBottomSheetContent);

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
  closeButton: {
    height: scale(26),
    width: scale(26),
    borderRadius: scale(13),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.WhiteDefault,
    position: 'absolute',
    top: verticalScale(-25),
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
