import {
    Pressable,
    StyleSheet,
    Text,
    View,
    Linking,
    ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Color from '../../component/Color';
import Font from '../../component/Font';
import { scale, verticalScale, moderateScale } from '../../custome/Responsive';
import CustomeInputField from '../../custome/CustomeInputField';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomeButton from '../../custome/CustomeButton';
import { CheckBox } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { ScreenName } from '../../component/Screen';
import { apiPost, apiPut } from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import Loader from '../../component/Loader';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';

const ResetPassword = () => {
    const navigation = useNavigation();
    const themeColor = useTheme();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
        useState(false);
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState('');

    // ======================================= Api ====================================== //

    const forgetPassword = async values => {
        const rawData = {
            email: values?.email,
            password: values?.password,
        };

        try {
            setVisible(true);
            const response = await apiPut(
                Api.forgotPassword,
                '',
                JSON.stringify(rawData),
            );
            if (response?.success == true) {
                showMessageonTheScreen(response?.message);
                navigation?.navigate(ScreenName.otpVerify, {
                    email: values.email,
                    password: values?.password,
                });
            }
        } catch (error) {
            console.log('error', error);
        } finally {
            setVisible(false);
        }
    };

    const togglePasswordVisibility = () =>
        setIsPasswordVisible(!isPasswordVisible);

    const toggleConfirmPasswordVisibility = () =>
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

    const openLink = url => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email(strings.invalidEmail).required(strings.emailRequired),
        password: Yup.string()
            .min(8, strings.passwordError)
            .required(strings.passwordRequired),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], strings.passwordMatch)
            .required(strings.confirmPasswordRequired),
    });

    //   const renderInputFields = (
    //     handleChange,
    //     handleBlur,
    //     values,
    //     errors,
    //     touched,
    //   ) => {
    //     return inputFields.map(field => (
    //       <CustomeInputField
    //         key={field.name}
    //         placeholder={field.placeholder}
    //         placeholderTextColor={Color.mediumGray}
    //         onChangeText={handleChange(field.name)}
    //         onBlur={handleBlur(field.name)}
    //         value={values[field.name]}
    //         errors={errors[field.name]}
    //         touched={touched[field.name]}
    //         iconLeft={true}
    //         keyboardType={field.keyboardType || 'default'}
    //         inputStyles={styles.inputStyles}
    //         errorTextStyles={styles.errorText}
    //         IconLeftComponent={
    //           <View style={styles.iconWrapper}>
    //             <MaterialCommunityIcons
    //               name={field.iconName}
    //               size={scale(17)}
    //               color={Color.Gray}
    //             />
    //           </View>
    //         }
    //         inputContainerStyles={styles.inputContainer}
    //       />
    //     ));
    //   };

    return (
        <ScrollView
            contentContainerStyle={[
                styles.container,
                { backgroundColor: themeColor.background1 },
            ]}
            showsVerticalScrollIndicator={false}>
            <Loader visible={visible} />
            <Text style={[styles.title, { color: themeColor.textColor }]}>
                {strings.resetPassword}
            </Text>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    confirmPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={values => {
                    forgetPassword(values);
                }}>
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
                            key={strings.email}
                            placeholder={strings.enterEmail}
                            placeholderTextColor={Color.mediumGray}
                            onChangeText={handleChange(strings.email)}
                            onBlur={handleBlur(strings.email)}
                            value={values.email}
                            errors={errors.email}
                            touched={touched.email}
                            iconLeft={true}
                            keyboardType={'email-address'}
                            inputStyles={styles.inputStyles}
                            errorTextStyles={styles.errorText}
                            IconLeftComponent={
                                <View style={styles.iconWrapper}>
                                    <MaterialCommunityIcons
                                        name={'email-outline'}
                                        size={scale(17)}
                                        color={Color.Gray}
                                    />
                                </View>
                            }
                            inputContainerStyles={styles.inputContainer}
                        />

                        <CustomeInputField
                            key={'password'}
                            placeholder={strings.newPassword}
                            placeholderTextColor={Color.mediumGray}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            errors={errors.password}
                            touched={touched.password}
                            iconLeft={true}
                            secureTextEntry={!isPasswordVisible}
                            inputStyles={styles.inputStyles}
                            errorTextStyles={styles.errorText}
                            IconLeftComponent={
                                <View style={styles.iconWrapper}>
                                    <MaterialCommunityIcons
                                        name={'key-outline'}
                                        size={scale(17)}
                                        color={Color.Gray}
                                    />
                                </View>
                            }
                            iconRight={true}
                            IconRightComponent={
                                <Pressable
                                    style={styles.iconWrapper}
                                    onPress={togglePasswordVisibility}>
                                    <MaterialCommunityIcons
                                        name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                                        size={scale(17)}
                                        color={Color.Gray}
                                    />
                                </Pressable>
                            }
                            inputContainerStyles={styles.inputContainer}
                        />

                        <CustomeInputField
                            key={'confrim password'}
                            placeholder={strings.confirmNewPassword}
                            placeholderTextColor={Color.mediumGray}
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            value={values.confirmPassword}
                            errors={errors.confirmPassword}
                            touched={touched.confirmPassword}
                            iconLeft={true}
                            secureTextEntry={!isConfirmPasswordVisible}
                            inputStyles={styles.inputStyles}
                            errorTextStyles={styles.errorText}
                            IconLeftComponent={
                                <View style={styles.iconWrapper}>
                                    <MaterialCommunityIcons
                                        name={'key-outline'}
                                        size={scale(17)}
                                        color={Color.Gray}
                                    />
                                </View>
                            }
                            iconRight={true}
                            IconRightComponent={
                                <Pressable
                                    style={styles.iconWrapper}
                                    onPress={toggleConfirmPasswordVisibility}>
                                    <MaterialCommunityIcons
                                        name={
                                            isConfirmPasswordVisible
                                                ? 'eye-outline'
                                                : 'eye-off-outline'
                                        }
                                        size={scale(17)}
                                        color={Color.Gray}
                                    />
                                </Pressable>
                            }
                            inputContainerStyles={styles.inputContainer}
                        />

                        <CustomeButton
                            title={strings.confirm}
                            buttonWidth={'100%'}
                            buttonHeight={verticalScale(45)}
                            buttonColor={Color.theme1}
                            fontSize={scale(15)}
                            fontFamily={Font.semiBold}
                            fontColor={Color.White}
                            borderRadius={scale(10)}
                            marginTop={verticalScale(30)}
                            onPress={handleSubmit}
                        />
                    </View>
                )}
            </Formik>
        </ScrollView>
    );
};

export default React.memo(ResetPassword);

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: moderateScale(20),
    },
    title: {
        fontSize: scale(20),
        color: Color.Black,
        fontFamily: Font.semiBold,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: scale(13),
        color: Color.mediumGray,
        fontFamily: Font.regular,
        textAlign: 'center',
        marginTop: verticalScale(10),
    },
    formContainer: {
        width: '100%',
        marginTop: verticalScale(15),
    },
    inputContainer: {
        width: '100%',
        borderWidth: scale(1),
        borderColor: Color.LightGray,
        paddingHorizontal: moderateScale(8),
        backgroundColor: Color.White,
        borderRadius: scale(10),
        marginTop: verticalScale(10),
        height: verticalScale(45),
    },
    inputStyles: {
        fontSize: scale(13),
        color: Color.Black,
        fontFamily: Font.regular,
        height: verticalScale(45),
    },
    iconWrapper: {
        backgroundColor: Color.WhiteDefault,
        padding: moderateScale(5),
        borderRadius: scale(5),
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(20),
    },
    agreementText: {
        fontSize: scale(12),
        color: Color.mediumGray,
        fontFamily: Font.regular,
        flexShrink: 1,
        lineHeight: verticalScale(20),
    },
    linkText: {
        fontSize: scale(12),
        color: Color.Black,
        fontFamily: Font.regular,
        textDecorationLine: 'underline',
    },
    checkBox: {
        backgroundColor: Color.transparent,
        padding: 0,
    },
    signUpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(20),
        alignSelf: 'center',
    },
    infoText: {
        fontSize: scale(13),
        color: Color.mediumGray,
        fontFamily: Font.regular,
        textAlign: 'center',
    },
    signUpText: {
        fontSize: scale(13),
        color: Color.theme1,
        fontFamily: Font.semiBold,
    },
    errorText: {
        fontSize: scale(12),
        color: Color.Red,
        fontFamily: Font.regular,
        marginTop: verticalScale(5),
    },
});
