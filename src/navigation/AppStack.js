import {createStackNavigator} from '@react-navigation/stack';
import React, {useMemo} from 'react';
import {ScreenName, ScreenPath} from '../component/Screen';
import AdInspector from '../screen/ads/AdInspector';
import BannerAdTester from '../screen/ads/BannerAdTester';

const Stack = createStackNavigator();

const AppStack = () => {
  const {
    splash,
    signIn,
    signUp,
    otpVerify,
    resetPassword,
    home,
    community,
    setAndFolder,
    createCard,
    asignFolder,
    assignSet,
    setDetail,
    profile,
    contact,
    support,
    notes,
    notesDetail,
    pdf,
    assignPdfFolder,
    image,
    assignImageFolder,
    aiScreen,
    cloud,
    privacy,
    aboutUs,
    subscription,
    viewFullImage,
    viewPdfScreen,
    otherUser,
    otherUserCard,
    adInspector,
    bannerAdTester,
  } = ScreenName;
  const {
    SplashScreen,
    SignUpScreen,
    OtpVerifyScreen,
    SignInScreen,
    ResetPassword,
    HomeScreen,
    CommunityScreen,
    SetAndFolderScreen,
    CreateCardScreen,
    AssignFolderScreen,
    AssignSetScreen,
    SetDetailScreen,
    ProfileScreen,
    ContactScreen,
    SupportScreen,
    NotesScreen,
    NoteDetailScreen,
    PdfScreen,
    AssignPdfFolder,
    ImagesScreen,
    AssignImageFolder,
    AiScreen,
    PrivacyScreen,
    AboutUsScreen,
    CloudScreen,
    SubscriptionScreen,
    ViewFullImage,
    ViewPdfScreen,
    OtherUserScreen,
    OtherUserCardScreen,
  } = ScreenPath;

  return (
    <Stack.Navigator initialRouteName={splash}>
      <Stack.Screen
        name={splash}
        component={SplashScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={signUp}
        component={SignUpScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={otpVerify}
        component={OtpVerifyScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={signIn}
        component={SignInScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={resetPassword}
        component={ResetPassword}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={home}
        component={HomeScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={community}
        component={CommunityScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={setAndFolder}
        component={SetAndFolderScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={createCard}
        component={CreateCardScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={asignFolder}
        component={AssignFolderScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={assignSet}
        component={AssignSetScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={setDetail}
        component={SetDetailScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={profile}
        component={ProfileScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={contact}
        component={ContactScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={otherUser}
        component={OtherUserScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={otherUserCard}
        component={OtherUserCardScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={support}
        component={SupportScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={notes}
        component={NotesScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={notesDetail}
        component={NoteDetailScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={pdf}
        component={PdfScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={assignPdfFolder}
        component={AssignPdfFolder}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={viewPdfScreen}
        component={ViewPdfScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={image}
        component={ImagesScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={assignImageFolder}
        component={AssignImageFolder}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={viewFullImage}
        component={ViewFullImage}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={aiScreen}
        component={AiScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={cloud}
        component={CloudScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={privacy}
        component={PrivacyScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={aboutUs}
        component={AboutUsScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={subscription}
        component={SubscriptionScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={adInspector}
        component={AdInspector}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={bannerAdTester}
        component={BannerAdTester}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default React.memo(AppStack);
