import React, {useState, useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';
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
import useTheme from '../../component/Theme';
import strings from '../../language/strings';

const {width, height} = Dimensions.get('window');

const SetAndFolderScreen = () => {
  const [search, setSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFolder, setShowFolder] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [tab, setTab] = useState('SET');
  const [folderId, setFolderId] = useState('');
  const [openSetSheet, setOpenSetSheet] = useState(false);
  const colorTheme = useTheme();

  // Memoize whether to show image folder icon
  const isImageFolder = useMemo(() => tab === 'SET', [tab]);

  const handleFolderClick = useCallback((folderId) => {
    setFolderId(folderId);
    setTab('SET');
  }, []);

  const handleCreateSetClick = useCallback((folderId) => {
    setFolderId(folderId);
    setTab('SET');
    setOpenSetSheet(true);
  }, []);

  // Handler for tab changes - clear search on tab change
  const handleSetTabClick = useCallback(() => {
    setTab('SET');
    setFolderId('');
    setSearchValue('');
  }, []);

  const handleFoldersTabClick = useCallback(() => {
    setTab('FOLDERS');
    setOpenSetSheet(false);
    setSearchValue('');
  }, []);

  const renderHeader = useCallback(() => (
    <CustomeHeader
      headerBackgroundColor={Color.transparent}
      imageFolder={isImageFolder}
      setShowFolder={setShowFolder}
      showFolder={showFolder}
      containerStyle={styles.headerStyle}
      setSearch={setSearch}
      search={search}
      isSetAndFolder={true}
    />
  ), [search, isImageFolder, showFolder]);

  const renderButtons = useCallback(
    () => (
      <View style={styles.buttonContainer}>
        <CustomeButton
          buttonColor={tab === 'SET' ? Color.White : Color.theme1}
          buttonWidth={'48%'}
          buttonHeight={scale(45)}
          title={strings.set}
          borderRadius={scale(10)}
          fontSize={scale(15)}
          fontColor={tab === 'SET' ? Color.Black : Color.White}
          fontFamily={Font.medium}
          marginTop={verticalScale(15)}
          onPress={handleSetTabClick}
        />

        <CustomeButton
          buttonColor={tab === 'FOLDERS' ? Color.White : Color.theme1}
          buttonWidth={'48%'}
          buttonHeight={scale(45)}
          title={strings.folder}
          borderRadius={scale(10)}
          fontSize={scale(15)}
          fontColor={tab === 'FOLDERS' ? Color.Black : Color.White}
          fontFamily={Font.medium}
          marginTop={verticalScale(15)}
          onPress={handleFoldersTabClick}
        />
      </View>
    ),
    [tab, handleSetTabClick, handleFoldersTabClick],
  );

  const renderBody = useCallback(() => {
    return (
      <MenuProvider>
        <KeyboardAvoidingView
          style={styles.bodyContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          enabled={Platform.OS === 'ios' ? true : false}>
          <View
            style={[styles.mainView, {backgroundColor: colorTheme.background1}]}>
            <LinearGradient
              colors={colorTheme.gradientTheme}
              style={styles.headerContainer}>
            {renderHeader()}
            {search && (
              <View style={{paddingLeft: scale(20), paddingRight: scale(20)}}>
                <CustomeInputField
                  placeholder={strings.search}
                  placeholderTextColor={Color.Gainsboro}
                  onChangeText={setSearchValue}
                  value={searchValue}
                  backgroundColor={'#3a6675'}
                  // width={width}
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
            {renderButtons()}
          </LinearGradient>
          {loading && (
            <ActivityIndicator
              animating={true}
              size={'small'}
              color={Color.theme1}
              style={styles.loadingIndicator}
            />
          )}
          {tab === 'SET' && (
            <SetComponent
              folderId={folderId}
              openSetSheet={openSetSheet}
              setOpenSetSheet={setOpenSetSheet}
              setLoading={setLoading}
              search={searchValue}
              showFolder={showFolder}
            />
          )}
          {tab === 'FOLDERS' && (
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
      </MenuProvider>
    );
  }, [
    renderHeader,
    search,
    tab,
    searchValue,
    renderButtons,
    colorTheme.background1,
    colorTheme.gradientTheme,
    folderId,
    loading,
    openSetSheet,
    showFolder,
    handleFolderClick,
    handleCreateSetClick,
  ]);

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
  bodyContainer: {flex: 1},
  mainView: {flex: 1},
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
    paddingLeft: scale(20),
    paddingRight: scale(20),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  loadingIndicator: {
    alignSelf: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(-10),
  },
});
