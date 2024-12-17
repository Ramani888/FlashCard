import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {scale, verticalScale} from '../../custome/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Color from '../../component/Color';
import CustomeHeader from '../../custome/CustomeHeader';
import CustomeInputField from '../../custome/CustomeInputField';
import CustomeButton from '../../custome/CustomeButton';
import Font from '../../component/Font';
import SetComponent from '../../component/cards/SetComponent';
import FolderComponent from '../../component/cards/FolderComponent';
import {useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import useTheme from '../../component/Theme';
import strings from '../../language/strings';

const {width, height} = Dimensions.get('window');

const SetAndFolderScreen = () => {
  const route = useRoute();
  const [search, setSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [tab, setTab] = useState('SET`');
  const [folderId, setFolderId] = useState('');
  const [openSetSheet, setOpenSetSheet] = useState(false);
  const colorTheme = useTheme()

  useEffect(() => {
    setTab('SET');
  }, []);

  const handleFolderClick = folderId => {
    setFolderId(folderId);
    setTab('SET');
  };

  const handleCreateSetClick = folderId => {
    setFolderId(folderId);
    setTab('SET');
    setOpenSetSheet(true);
  };

  const renderHeader = () => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={strings.myCards}
        containerStyle={styles.headerStyle}
        searchIcon={true}
        setSearch={setSearch}
        search={search}
      />
    );
  };

  const buttons = () => (
    <View style={styles.buttonContainer}>
      <CustomeButton
        buttonColor={tab == 'SET' ? Color.White : Color.theme1}
        buttonWidth={scale(150)}
        buttonHeight={scale(45)}
        title={strings.set}
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={tab == 'SET' ? Color.Black : Color.White}
        fontFamily={Font.medium}
        marginTop={verticalScale(15)}
        onPress={() => {
          setTab('SET');
          setFolderId('');
          setSearchValue('');
        }}
      />

      <CustomeButton
        buttonColor={tab == 'FOLDERS' ? Color.White : Color.theme1}
        buttonWidth={scale(150)}
        buttonHeight={scale(45)}
        title={strings.folder}
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={tab == 'FOLDERS' ? Color.Black : Color.White}
        fontFamily={Font.medium}
        marginTop={verticalScale(15)}
        onPress={() => {
          setTab('FOLDERS');
          setOpenSetSheet(false);
          setSearchValue('');
        }}
      />
    </View>
  );

  const renderBody = useCallback(() => {
    return (
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : 20}
        enabled={Platform.OS === 'ios' ? true : false}>
        <View style={{flex: 1,backgroundColor: colorTheme.background1}}>
          <LinearGradient
            colors={colorTheme.gradientTheme}
            style={styles.headerContainer}>
            {renderHeader()}
            {search && (
              <View>
                <CustomeInputField
                  placeholder={strings.search}
                  placeholderTextColor={Color.Gainsboro}
                  onChangeText={setSearchValue}
                  value={searchValue}
                  backgroundColor={'#3a6675'}
                  width={width * 0.88}
                  height={height * 0.065}
                  iconLeft={true}
                  IconLeftComponent={
                    <View
                      style={styles.searchIcon}
                      onPress={() => setSearch(!search)}>
                      <AntDesign
                        name="search1"
                        size={scale(14)}
                        color={Color.White}
                      />
                    </View>
                  }
                  inputContainerStyles={styles.inputContainerStyle}
                  inputStyles={styles.inputStyles}
                />
              </View>
            )}
            {buttons()}
          </LinearGradient>
          {loading && (
            <ActivityIndicator
              animating={true}
              size={'small'}
              color={Color.theme1}
              style={styles.loadingIndicator}
            />
          )}
          {tab == 'SET' && (
            <SetComponent
              folderId={folderId}
              openSetSheet={openSetSheet}
              setOpenSetSheet={setOpenSetSheet}
              setLoading={setLoading}
              search={searchValue}
            />
          )}
          {tab == 'FOLDERS' && (
            <FolderComponent
              onFolderClick={handleFolderClick}
              handleCreateSetClick={handleCreateSetClick}
              setLoading={setLoading}
              setSearchValue={setSearchValue}
              search={searchValue}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }, [renderHeader, search, tab, searchValue]);

  return renderBody();
};

export default React.memo(SetAndFolderScreen);

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Color.theme1,
    paddingBottom: verticalScale(20),
  },
  headerStyle: {
    backgroundColor: Color.transparent,
    height: verticalScale(90),
    alignItems: 'flex-end',
  },
  inputContainerStyle: {
    marginTop: verticalScale(15),
    borderRadius: scale(10),
    backgroundColor: Color.White,
    height: verticalScale(45),
  },
  inputStyles: {
    fontSize: scale(13),
    color: Color.White,
    fontFamily: Font.regular,
    height: verticalScale(45),
  },
  searchIcon: {
    width: width * 0.09,
    height: height * 0.05,
    backgroundColor: '#496e7c',
    borderRadius: scale(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: scale(6),
  },
  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(10),
  },
  loadingIndicator: {
    alignSelf: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(-10),
  },
});
