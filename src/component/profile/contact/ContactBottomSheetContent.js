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
import {scale, verticalScale} from '../../../custome/Responsive';
import Color from '../../Color';
import Font from '../../Font';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {apiGet} from '../../../Api/ApiService';
import Api from '../../../Api/EndPoint';
import debounce from 'lodash.debounce';
import strings from '../../../language/strings';

const ContactBottomSheetContent = ({
  closeContactBottomSheet,
  createContacts,
  colorTheme,
}) => {
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState([]);

  // ==================== Debounced search function =================== //
  const debouncedSearchUser = useMemo(
    () =>
      debounce(async searchValue => {
        try {
          setVisible(true);
          const res = await apiGet(
            `${Api.searchUser}?search=${searchValue}&userId=${global.user?._id}`,
          );
          if (res) {
            setUserData(res);
          } else {
            setUserData([]);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setVisible(false);
        }
      }, 300),
    [],
  );

  const searchUser = useCallback(
    searchValue => {
      if (searchValue.trim()) {
        debouncedSearchUser(searchValue);
      } else {
        setUserData([]);
      }
    },
    [debouncedSearchUser],
  );

  // ==================== Validation Schema ============================ //
  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        username: Yup.string()
          .matches(/^[a-zA-Z0-9]+$/, 'Only letters and numbers are allowed')
          .required('Username is required'),
      }),
    [],
  );

  // ==================== Handlers ========================== //

  const handleSubmit = useCallback(
    (values, {resetForm}) => {
      resetForm();
      closeContactBottomSheet();
    },
    [closeContactBottomSheet],
  );

  const handlePressClose = useCallback(() => {
    closeContactBottomSheet();
  }, [closeContactBottomSheet]);

  const renderUser = useCallback(
    ({item}) => (
      <Pressable
        style={styles.userContainer}
        onPress={() => {
          createContacts(item?._id);
          closeContactBottomSheet();
        }}>
        <View style={styles.userDetails}>
          <Image source={{uri: item?.picture}} style={styles.profileImage} />
          <Text style={[styles.userName, {color: colorTheme.textColor}]}>
            {item?.userName}
          </Text>
        </View>
        <Image
          source={require('../../../Assets/Img/searchUser.png')}
          style={styles.userImage}
        />
      </Pressable>
    ),
    [colorTheme.textColor, closeContactBottomSheet, createContacts],
  );

  const keyExtractor = useCallback(item => item._id, []);

  const emptyState = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, {color: colorTheme.textColor}]}>
          {strings.userNotFound}
        </Text>
      </View>
    ),
    [colorTheme],
  );

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.closeButton,
          {
            backgroundColor:
              colorTheme.theme === 'Light' ? Color.Black : '#9F9F9F66',
          },
        ]}
        onPress={handlePressClose}>
        <AntDesign name="close" size={scale(15)} color={colorTheme.textColor} />
      </Pressable>
      <Text style={[styles.title, {color: colorTheme.textColor}]}>
        {strings.addContact}
      </Text>

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
              placeholder={strings.enterUsername}
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
              inputStyles={[styles.inputStyles, {color: colorTheme.textColor}]}
              backgroundColor={colorTheme.listAndBoxColor}
              inputContainerStyles={styles.inputContainerStyle}
            />

            {visible && (
              <ActivityIndicator size="small" style={styles.loader} />
            )}

            {userData?.length > 0 ? (
              <FlatList
                data={userData}
                renderItem={renderUser}
                keyExtractor={keyExtractor}
                style={styles.flatList}
              />
            ) : (
              emptyState
            )}
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
    fontFamily: Font.regular,
    height: verticalScale(45),
  },
  closeButton: {
    height: scale(26),
    width: scale(26),
    borderRadius: scale(13),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: verticalScale(-25),
    right: 0,
  },
  title: {
    fontSize: scale(20),
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
  profileImage: {
    height: scale(40),
    width: scale(40),
    borderRadius: scale(20),
  },
  userName: {
    fontSize: scale(12),
    fontFamily: Font.semiBold,
    paddingLeft: scale(10),
  },
  userImage: {
    width: scale(36),
    height: scale(36),
  },
  emptyContainer: {
    height: verticalScale(130),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: scale(13),
    fontFamily: Font.medium,
    color: Color.Black,
  },
});
