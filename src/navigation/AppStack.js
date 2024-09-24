import {createStackNavigator} from '@react-navigation/stack';
import React, {useMemo} from 'react';
import {ScreenName, ScreenPath} from '../component/Screen';

const Stack = createStackNavigator();

const AppStack = ({user}) => {
  const {
    signIn,
    signUp,
    otpVerify,
    home,
    globalLiveFeed,
    cardTypeWiseFolderAndSet,
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
    image,
  } = ScreenName;

  const {
    SignUpScreen,
    OtpVerifyScreen,
    SignInScreen,
    HomeScreen,
    GlobalLiveFeedScreen,
    CardTypeWiseFolderAndSetScreen,
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
    ImagesScreen,
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
        name={cardTypeWiseFolderAndSet}
        component={CardTypeWiseFolderAndSetScreen}
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
        name={image}
        component={ImagesScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default React.memo(AppStack);
