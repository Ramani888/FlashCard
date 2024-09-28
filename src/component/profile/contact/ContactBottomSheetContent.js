import React, {useCallback, useState, useMemo} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomeInputField from '../../../custome/CustomeInputField';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../Color';
import CustomeButton from '../../../custome/CustomeButton';
import Font from '../../Font';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {apiGet} from '../../../Api/ApiService';
import Api from '../../../Api/EndPoint';
import {Avatar} from '@rneui/themed';
import debounce from 'lodash.debounce';

const ContactBottomSheetContent = ({
  closeContactBottomSheet,
  createContacts,
}) => {
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState([]);

  // ==================== Debounced search function =================== //
  const searchUser = useCallback(
    debounce(async searchValue => {
      try {
        setVisible(true);
        const res = await apiGet(
          `${Api.searchUser}?search=${searchValue}&userId=${global.user?._id}`,
        );
        if (res) {
          setUserData(res);
        }
      } catch (error) {
        console.log('error', error);
      } finally {
        setVisible(false);
      }
    }, 300),
    [],
  );

  // ==================== Validation Schema ============================ //

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^[a-zA-Z0-9]+$/, 'Only letters and numbers are allowed')
      .required('Username is required'),
  });

  // ==================== Form Submit Handler ========================== //

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

  // ==================== Render User Function ========================= //

  const renderUser = useCallback(({item}) => {
    return (
      <Pressable
        style={styles.userContainer}
        onPress={() => {
          createContacts(item?._id);
          closeContactBottomSheet()
        }}>
        <View style={styles.userDetails}>
          <Avatar
            size={42}
            rounded
            source={{uri: 'https://randomuser.me/api/portraits/men/36.jpg'}}
          />
          <Text style={styles.userName}>{item?.userName}</Text>
        </View>
        <Image
          source={require('../../../Assets/Img/searchUser.png')}
          style={styles.userImage}
        />
      </Pressable>
    );
  }, []);

  const keyExtractor = useCallback(item => item._id, []);

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
          setFieldValue,
        }) => (
          <View style={styles.formContainer}>
            <CustomeInputField
              placeholder="Enter Username"
              placeholderTextColor={Color.mediumGray}
              onChangeText={text => {
                setFieldValue('username', text);
                searchUser(text);
              }}
              onBlur={handleBlur('username')}
              value={values.username}
              marginTop={verticalScale(10)}
              width="100%"
              errors={errors.username}
              touched={touched.username}
              inputStyles={styles.inputStyles}
              inputContainerStyles={styles.inputContainerStyle}
            />

            {visible && (
              <ActivityIndicator
                size={'small'}
                animating={true}
                style={styles.loader}
              />
            )}

            <FlatList
              data={userData}
              renderItem={renderUser}
              keyExtractor={keyExtractor}
              style={styles.flatList}
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
  loader: {
    alignSelf: 'center',
    marginTop: verticalScale(10),
  },
  flatList: {
    marginTop: verticalScale(10),
    height: verticalScale(120),
  },
  userContainer: {
    padding: scale(5),
    marginVertical: verticalScale(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: scale(12),
    fontFamily: Font.semiBold,
    color: Color.Black,
    paddingLeft: scale(10),
  },
  userImage: {
    width: scale(36),
    height: scale(36),
  },
});
