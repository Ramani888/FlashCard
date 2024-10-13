import {createStackNavigator} from '@react-navigation/stack';
import React, {useMemo} from 'react';
import {ScreenName, ScreenPath} from '../component/Screen';
import CloudScreen from '../screen/profile/CloudScreen';

const Stack = createStackNavigator();

const AppStack = ({user}) => {
  const {
    signIn,
    signUp,
    otpVerify,
    resetPassword,
    home,
    globalLiveFeed,
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
  } = ScreenName;

  const {
    SignUpScreen,
    OtpVerifyScreen,
    SignInScreen,
    ResetPassword,
    HomeScreen,
    GlobalLiveFeedScreen,
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
  } = ScreenPath;

  const initialRouteName = useMemo(() => (user ? home : signIn), [user]);

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
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
        name={globalLiveFeed}
        component={GlobalLiveFeedScreen}
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
    </Stack.Navigator>
  );
};

export default React.memo(AppStack);
