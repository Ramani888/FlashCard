import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    FlatList,
    Image,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Color from '../../component/Color';
import CustomeHeader from '../../custome/CustomeHeader';
import { scale, verticalScale, moderateScale } from '../../custome/Responsive';
import Font from '../../component/Font';
import CustomeInputField from '../../custome/CustomeInputField';
import CustomeModal from '../../custome/CustomeModal';
import ProfileModalContent from '../../component/profile/profile/ProfileModalContent';
import RBSheet from 'react-native-raw-bottom-sheet';
import UserNameBottomSheetsContent from '../../component/profile/profile/UserNameBottomSheetsContent';
import EmailBottomSheetsContent from '../../component/profile/profile/EmailBottomSheetsContent';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { ScreenName } from '../../component/Screen';
import showMessageonTheScreen from '../../component/ShowMessageOnTheScreen';
import Loader from '../../component/Loader';
import CustomeButton from '../../custome/CustomeButton';
import AsyncStorage, {
    useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import { apiGet, apiPost, apiPut } from '../../Api/ApiService';
import Api from '../../Api/EndPoint';
import * as Progress from 'react-native-progress';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';
import VideoAds from '../ads/VideoAds';
import LanguageModalContent from '../../component/auth/LanguageModalContent';

const { width, height } = Dimensions.get('window');

const languages = [
    {
        id: 0,
        name: 'English',
        flag: require('../../Assets/FlagImage/UsaFlag.png'),
    },
    { id: 1, name: 'Espanol', flag: require('../../Assets/FlagImage/spain.png') },
    {
        id: 2,
        name: 'Postogues',
        flag: require('../../Assets/FlagImage/portugal.png'),
    },
    {
        id: 3,
        name: 'Francais',
        flag: require('../../Assets/FlagImage/france.png'),
    },
    {
        id: 4,
        name: 'Italiano',
        flag: require('../../Assets/FlagImage/italy.png'),
    },
    {
        id: 5,
        name: 'German',
        flag: require('../../Assets/FlagImage/germany.png'),
    },
    { id: 6, name: 'Polish', flag: require('../../Assets/FlagImage/poland.png') },
    {
        id: 7,
        name: 'Mandarin',
        flag: require('../../Assets/FlagImage/china.png'),
    },
    { id: 8, name: 'Swahili', flag: require('../../Assets/FlagImage/kenya.png') },
    {
        id: 9,
        name: 'Tagalog',
        flag: require('../../Assets/FlagImage/philippines.png'),
    },
    { id: 10, name: 'Hindi', flag: require('../../Assets/FlagImage/india.png') },
];

const ProfileScreen = () => {
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [profileUpdate, setProfileUpdate] = useState(false);
    const [userCreditData, setUserCreditData] = useState({});
    const [userStorageData, setUserStorageData] = useState({});
    const [userSubscriptionData, setUserSubscriptionData] = useState({});
    const [subscribedPlan, setSubscribedPlan] = useState({});
    const [languageModal, setLanguageModal] = useState(false);
    const [languageModalPosition, setLanguageModalPosition] = useState({ x: 0, y: 0 });
    const [selectedLanguage, setSelectedLanguage] = useState({
        id: 0,
        name: 'English',
        flag: require('../../Assets/FlagImage/UsaFlag.png'),
    });

    const refUserNameRBSheet = useRef();
    const refEmailRBSheet = useRef();
    const adRef = useRef();
    const colorTheme = useTheme();

    useEffect(() => {
        (async () => {
            const lang = await AsyncStorage.getItem('Language')
            if (lang) {
                languages?.map((item) => {
                    if (JSON.parse(lang)?.id == item?.id) {
                        setSelectedLanguage(item)
                    }

                })

            }
        })()
    }, [isFocused])

    const handleLanguageSaved = async (Language) => {
        await AsyncStorage.setItem('Language', JSON.stringify(Language))
        Language?.name === 'English' && strings.setLanguage('en');
        Language?.name === 'Espanol' && strings.setLanguage('es');
        Language?.name === 'Postogues' && strings.setLanguage('pt');
        Language?.name === 'Francais' && strings.setLanguage('fr');
        Language?.name === 'Italiano' && strings.setLanguage('it');
        Language?.name === 'German' && strings.setLanguage('de');
        Language?.name === 'Polish' && strings.setLanguage('pl');
        Language?.name === 'Mandarin' && strings.setLanguage('zh');
        Language?.name === 'Swahili' && strings.setLanguage('sw');
        Language?.name === 'Tagalog' && strings.setLanguage('tl');
        Language?.name === 'Hindi' && strings.setLanguage('hi');
    };

    useEffect(() => {
        setEmail(global.user?.email);
        setUserName(global.user?.userName);
        getProfileData();
    }, [isFocused]);

    const tabData = [
        {
            tabname: strings.profileTab1,
            image: require('../../Assets/Img/userIcon.png'),
        },
        // {tabname: 'Cloud', image: require('../../Assets/Img/cloud.png')},
        {
            tabname: strings.profileTab2,
            image: require('../../Assets/Img/support.png'),
        },
        // {
        //   tabname: strings.profileTab3,
        //   image: require('../../Assets/Img/notes.png'),
        // },
        {
            tabname: strings.profileTab4,
            image: require('../../Assets/Img/privacy.png'),
        },
    ];

    // =================================== Api =================================== //

    const updateProfilePic = async file => {
        var formdata = new FormData();
        formdata.append('picture', file);
        formdata.append('_id', global.user?._id);
        try {
            setVisible(true);
            const response = await apiPut(Api.profilePic, '', formdata);
            if (response?.success == true) {
                showMessageonTheScreen(response?.message);
                global.user = response.user;
                setProfileUpdate(true);
            }
        } catch (error) {
            console.log('error in updateProfilePicture api', error);
        } finally {
            setVisible(false);
        }
    };

    const getProfileData = async () => {
        try {
            setVisible(true);
            const response = await apiGet(
                `${Api.profile}?userId=${global.user?._id}`,
            );
            setUserCreditData(response?.userCreditData);
            setUserStorageData(response?.userStorageData);
            setUserSubscriptionData(response?.userSubscriptionData);
            setSubscribedPlan(response?.userTierData);
            AsyncStorage.setItem(
                'selectedSubscription',
                JSON.stringify(response?.userTierData),
            );
        } catch (error) {
            console.log('error in get profile api', error);
        } finally {
            setVisible(false);
        }
    };

    const updateCredit = async (credit, type) => {
        console.log('credit', credit);
        console.log('type', type);
        const rawData = { userId: global.user?._id, credit: credit, type: type };
        try {
            setVisible(true);
            const response = await apiPut(Api.credit, '', JSON.stringify(rawData));
            if (response.success) getProfileData(false);
        } catch (error) {
            console.error('Error updating credit:', error);
        } finally {
            setVisible(false);
        }
    };

    // =================================== End =================================== //

    const openModal = useCallback(ref => {
        if (ref.current) {
            ref.current.measureInWindow((x, y, width, height) => {
                setModalPosition({ x: x - width * 5, y: y + height + 10 });
                setModalVisible(true);
            });
        }
    }, []);

    const closeModal = useCallback(() => setModalVisible(false), []);

    const openLanguageModal = useCallback(ref => {
        if (ref.current) {
            ref.current.measureInWindow((x, y, width, height) => {
                setModalPosition({ x: x - scale(260), y: y + verticalScale(35) });
                setLanguageModal(true);
            });
        }
    }, []);

    const closeLanguageModal = () => {
        setLanguageModal(false);
    };

    const openUserNameBottomSheets = () => {
        refUserNameRBSheet.current.open();
    };

    const closeUserNameBottomSheet = () => {
        refUserNameRBSheet.current.close();
    };

    const openEmailBottomSheets = () => {
        refEmailRBSheet.current.open();
    };

    const closeEmailBottomSheet = () => {
        refEmailRBSheet.current.close();
    };

    const handleShowAd = () => {
        if (adRef.current) {
            adRef.current.showAd();
        }
    };

    const handleTabPress = tabname => {
        tabname == strings.profileTab1 && navigation.navigate(ScreenName.contact);
        tabname == strings.profileTab2 && navigation.navigate(ScreenName.support);
        // tabname == 'Cloud' && navigation.navigate(ScreenName.cloud);
        tabname == strings.profileTab3 && navigation.navigate(ScreenName.aboutUs);
        tabname == strings.profileTab4 && navigation.navigate(ScreenName.privacy);
    };

    const handleLogout = async () => {
        try {
            setVisible(true);
            const user = await AsyncStorage.removeItem('user');
            showMessageonTheScreen(strings.userLogoutSuccess);
            global.user = user;
            navigation.navigate(ScreenName.signIn);
        } catch (error) {
            console.log('error in logout', error);
        } finally {
            setVisible(false);
        }
    };

    const renderHeader = useCallback(() => {
        return (
            <CustomeHeader
                headerBackgroundColor={Color.transparent}
                goBack={true}
                profileImage={true}
                profileUrl={global.user?.picture}
                edit={true}
                language={true}
                containerStyle={styles.headerStyle}
                openEditModal={openModal}
                openLanguageModal={openLanguageModal}
                selectedLanguage={selectedLanguage}
            />
        );
    }, [profileUpdate, selectedLanguage]);

    const renderTab = useCallback(({ item }) => {
        const privacyTab = item.tabname === strings.profileTab4;
        const aboutUsTab = item.tabname === strings.profileTab3;
        return (
            <Pressable
                style={[
                    styles.tabContainer,
                    privacyTab && styles.privacyTab,
                    aboutUsTab && styles.aboutUsTab,
                ]}
                onPress={() => handleTabPress(item?.tabname)}>
                <Image
                    source={item?.image}
                    style={styles.tabIcon}
                    tintColor={Color.White}
                    resizeMode="contain"
                />
                <Text style={styles.tabText}>{item?.tabname}</Text>
            </Pressable>
        );
    }, []);

    const userNameBottomSheets = useCallback(() => {
        return (
            <RBSheet
                ref={refUserNameRBSheet}
                height={height * 0.34}
                openDuration={250}
                draggable={true}
                customStyles={{
                    container: styles.bottomSheetContainer,
                    draggableIcon: styles.dragableIcon,
                }}>
                <View style={styles.sheetContainer}>
                    <UserNameBottomSheetsContent
                        closeUserNameBottomSheet={closeUserNameBottomSheet}
                    />
                </View>
            </RBSheet>
        );
    }, []);

    const emailBottomSheets = useCallback(() => {
        return (
            <RBSheet
                ref={refEmailRBSheet}
                height={height * 0.6}
                openDuration={250}
                draggable={true}
                customStyles={{
                    container: styles.bottomSheetContainer,
                    draggableIcon: styles.dragableIcon,
                }}>
                <View style={styles.sheetContainer}>
                    <EmailBottomSheetsContent
                        closeEmailBottomSheet={closeEmailBottomSheet}
                    />
                </View>
            </RBSheet>
        );
    }, []);

    const currentStorage = userStorageData?.coveredStorage;
    const totalStorage = userStorageData?.storage;

    const progress = totalStorage ? currentStorage / totalStorage : 0;

    return (
        <LinearGradient colors={colorTheme.gradientTheme} style={styles.container}>
            <StatusBar translucent backgroundColor={Color.transparent} />
            <Loader visible={visible} color={Color.White} />
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {renderHeader()}
                <VideoAds ref={adRef} updateCredit={updateCredit} />

                <View style={styles.bodyContainer}>
                    <View>
                        <Text style={styles.label}>{strings.userName}</Text>
                        <CustomeInputField
                            placeholder={strings.userName}
                            placeholderTextColor={Color.mediumGray}
                            onChangeText={setUserName}
                            value={username}
                            editable={false}
                            borderWidth={1}
                            borderColor={Color.LightGray}
                            height={scale(40)}
                            marginTop={verticalScale(5)}
                            width="100%"
                            backgroundColor={colorTheme.listAndBoxColor}
                            inputContainerStyles={styles.inputContainer}
                            inputStyles={[styles.inputStyles, { color: colorTheme.textColor }]}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>{strings.email}</Text>
                        <CustomeInputField
                            placeholder={strings.email}
                            placeholderTextColor={Color.mediumGray}
                            onChangeText={setEmail}
                            value={email}
                            editable={false}
                            borderWidth={1}
                            borderColor={Color.LightGray}
                            height={scale(40)}
                            marginTop={verticalScale(5)}
                            width="100%"
                            backgroundColor={colorTheme.listAndBoxColor}
                            inputContainerStyles={styles.inputContainer}
                            inputStyles={[styles.inputStyles, { color: colorTheme.textColor }]}
                        />
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.subscriptionContainer}>
                        <Pressable
                            style={styles.subscriptionBoxContainer}
                            onPress={() => handleShowAd()}>
                            <Text style={styles.subscriptionText}>{strings.watchAd}</Text>
                            <Image
                                source={require('../../Assets/Img/adsIcon.jpg')}
                                style={styles.adImageIcon}
                            />
                            <Text style={styles.subscriptionText}>{strings.earnCredits}</Text>
                            {/* <Text style={styles.subscriptionText}>
                {strings.subscription}
              </Text>
              <Pressable
                style={styles.subscriptionBox}
                onPress={() =>
                  navigation.navigate(ScreenName.subscription, {
                    selectedSubscription: userSubscriptionData,
                  })
                }>
                <Image
                  source={{uri: subscribedPlan?.icon}}
                  style={styles.subscriptionImage}
                  resizeMode="contain"
                />
                <Text style={styles.subscriptionTier}>
                  {subscribedPlan?.name}
                </Text>
              </Pressable> */}
                        </Pressable>
                        <View style={styles.subscriptionRightView}>
                            <View style={styles.aiCreditsContainer}>
                                <Text style={styles.aiCreditsText}>{strings.aiCredit}</Text>
                                <Text style={styles.aiCreditsText}>
                                    {userCreditData?.credit}
                                </Text>
                            </View>
                            <View style={styles.aiCreditsContainer}>
                                <Text style={styles.aiCreditsText}>
                                    {strings.Storage} ({currentStorage}/{totalStorage}{' '}
                                    {userStorageData?.unit})
                                </Text>
                                <Progress.Bar
                                    progress={progress}
                                    width={scale(150)}
                                    style={{ marginTop: verticalScale(10) }}
                                    color={Color.theme1}
                                    height={verticalScale(12)}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.separator} />
                </View>

                <FlatList
                    data={tabData}
                    renderItem={renderTab}
                    numColumns={3}
                    key={'_'}
                    contentContainerStyle={{
                        paddingHorizontal: scale(15),
                        marginTop: verticalScale(20),
                    }}
                />

                {userNameBottomSheets()}
                {emailBottomSheets()}

                <CustomeModal
                    visible={modalVisible}
                    onClose={closeModal}
                    closeModal={false}
                    mainPadding={scale(5)}
                    backgroundColor={colorTheme.modelBackground}
                    content={
                        <ProfileModalContent
                            closeModal={closeModal}
                            openUserNameBottomSheets={openUserNameBottomSheets}
                            openEmailBottomSheets={openEmailBottomSheets}
                            updateProfilePic={updateProfilePic}
                            handleLogout={handleLogout}
                            colorTheme={colorTheme}
                        />
                    }
                    width={scale(120)}
                    justifyContent="flex-end"
                    borderRadius={scale(10)}
                    modalContainerStyle={[
                        styles.modal,
                        {
                            top: modalPosition.y,
                            left: modalPosition.x,
                            backgroundColor: colorTheme.modelBackgroundView,
                        },
                    ]}
                />
            </ScrollView>

            <CustomeModal
                visible={languageModal}
                onClose={closeLanguageModal}
                closeModal={false}
                mainPadding={scale(5)}
                backgroundColor={colorTheme.modelBackground}
                content={
                    <LanguageModalContent
                        setSelectedLanguage={setSelectedLanguage}
                        selectedLanguage={selectedLanguage}
                        closeModal={closeLanguageModal}
                        handleLanguageSaved={handleLanguageSaved}
                    />
                }
                width={'80%'}
                height={'68.6%'}
                justifyContent="flex-end"
                borderRadius={20}
                modalContainerStyle={[
                    styles.languageModal,
                    { backgroundColor: colorTheme.modelBackgroundView },
                    { top: modalPosition.y, left: modalPosition.x },
                ]}
            />
        </LinearGradient>
    );
};

export default React.memo(ProfileScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerStyle: {
        backgroundColor: Color.transparent,
        height: verticalScale(90),
        alignItems: 'flex-end',
    },
    inputContainer: {
        width: '100%',
        borderWidth: scale(1),
        borderColor: Color.LightGray,
        paddingHorizontal: scale(8),
        backgroundColor: Color.White,
        borderRadius: scale(10),
        marginTop: verticalScale(5),
        marginBottom: verticalScale(10),
        height: verticalScale(45),
    },
    inputStyles: {
        height: scale(45),
        fontSize: moderateScale(13),
        color: Color.Black,
        fontFamily: Font.regular,
        paddingLeft: scale(5),
    },
    bodyContainer: {
        marginHorizontal: scale(15),
        marginTop: verticalScale(30),
    },
    label: {
        fontSize: moderateScale(14),
        color: Color.White,
        fontFamily: Font.semiBold,
    },
    separator: {
        borderBottomWidth: scale(0.5),
        borderBottomColor: Color.WhiteDefault,
        paddingVertical: verticalScale(10),
    },
    subscriptionContainer: {
        paddingTop: verticalScale(25),
        paddingBottom: verticalScale(8),
        flexDirection: 'row',
    },
    subscriptionBoxContainer: {
        width: wp('40%'),
        borderWidth: scale(2),
        borderColor: '#146D8B',
        padding: scale(10),
        borderRadius: scale(10),
    },
    subscriptionText: {
        fontSize: wp('3.5%'),
        fontFamily: Font.medium,
        color: Color.White,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    subscriptionBox: {
        gap: verticalScale(5),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: scale(10),
        borderRadius: scale(10),
        height: verticalScale(60),
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
    },
    subscriptionImage: {
        width: scale(36),
        height: scale(36),
        marginTop: verticalScale(10),
    },
    subscriptionTier: {
        fontSize: wp('3.5%'),
        color: Color.White,
        fontFamily: Font.medium,
    },
    subscriptionRightView: { gap: verticalScale(10), width: '54%' },
    aiCreditsContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: scale(2),
        borderColor: '#146D8B',
        paddingVertical: verticalScale(9),
        paddingHorizontal: scale(5),
        marginLeft: scale(10),
        borderRadius: scale(10),
    },
    aiCreditsText: {
        fontSize: moderateScale(14),
        fontFamily: Font.medium,
        color: Color.White,
        textTransform: 'uppercase',
    },
    tabContainer: {
        flex: 1,
        alignItems: 'center',
        marginVertical: verticalScale(15),
    },
    tabIcon: {
        width: moderateScale(24),
        height: moderateScale(24),
    },
    tabText: {
        fontSize: moderateScale(14),
        fontFamily: Font.regular,
        color: Color.WhiteDefault,
        paddingTop: verticalScale(5),
    },
    modal: {
        position: 'absolute',
        backgroundColor: Color.White,
        elevation: scale(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: scale(0.3),
        shadowRadius: scale(4),
        borderRadius: scale(10),
    },
    bottomSheetContainer: {
        alignItems: 'center',
        borderTopLeftRadius: scale(30),
        borderTopRightRadius: scale(30),
    },
    sheetContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: verticalScale(15),
    },
    dragableIcon: { marginTop: verticalScale(20) },
    privacyTab: {
        marginLeft: scale(-15),
    },
    aboutUsTab: {
        marginRight: scale(20),
    },
    adImageIcon: {
        width: scale(60),
        height: scale(60),
        borderRadius: scale(4),
        alignSelf: 'center',
        marginVertical: verticalScale(10),
    },
    languageModal: {
        position: 'absolute',
        borderRadius: scale(10),
        elevation: scale(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: scale(0.3),
        shadowRadius: scale(4),
    },
});

// import React, { useRef } from 'react';
// import { View, Button, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import ActionSheet, { SheetManager, SheetProvider } from 'react-native-actions-sheet';
// import Color from '../../component/Color';

// const ProfileScreen = () => {
//   const actionSheetRef = useRef(null);

//   const openActionSheet = () => {
//     SheetManager.show('example-sheet');
//   };

//   return (
//     <SheetProvider>
//       <View style={styles.container}>
//         <Button title="Open Snap Action Sheet" onPress={openActionSheet} />
//         <ActionSheet
//           id="example-sheet"
//           ref={actionSheetRef}
//           gestureEnabled={true} // Enables swiping to close
//           bounceOnOpen={true} // Adds bounce effect when opening
//           initialSnapIndex={0} // Sets initial snap index (collapsed state)
//           snapPoints={[200, 300, 400]} // Define snapping points (collapsed, mid, expanded)
//           containerStyle={styles.actionSheetContainer}
//         >
//           <View style={styles.sheetContent}>
//             <TouchableOpacity onPress={() => SheetManager.hide('example-sheet')}>
//               <Text style={styles.sheetText}>Collapse</Text>
//             </TouchableOpacity>
//             <Text style={styles.sheetText}>Expanded Content</Text>
//             <Text style={styles.sheetText}>More Options or Info Here</Text>
//           </View>
//         </ActionSheet>
//       </View>
//     </SheetProvider>
//   );
// };

// export default ProfileScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   actionSheetContainer: {
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   sheetContent: {
//     padding: 16,
//     alignItems: 'center',
//   },
//   sheetText: {
//     fontSize: 16,
//     marginVertical: 8,
//     color:Color.Black
//   },
// });
