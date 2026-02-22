import React, {useState, useCallback, useMemo, memo} from 'react';
import {
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
import {useLoader} from '../../context';

const {width, height} = Dimensions.get('window');

// Memoized search icon component
const SearchIcon = memo(() => (
  <View style={styles.searchIcon}>
    <AntDesign
      name="search1"
      size={scale(14)}
      color={Color.White}
    />
  </View>
));

SearchIcon.displayName = 'SearchIcon';

const SetAndFolderScreen = () => {
  const [search, setSearch] = useState(false);
  const [showFolder, setShowFolder] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [tab, setTab] = useState('SET');
  const [folderId, setFolderId] = useState('');
  const [openSetSheet, setOpenSetSheet] = useState(false);
  const colorTheme = useTheme();
  const {showLoader, hideLoader} = useLoader();

  // Memoize whether to show image folder icon
  const isImageFolder = useMemo(() => tab === 'SET', [tab]);

  // Memoize keyboard avoiding view props
  const keyboardAvoidingProps = useMemo(() => ({
    behavior: Platform.OS === 'ios' ? 'padding' : 'height',
    keyboardVerticalOffset: Platform.OS === 'ios' ? 0 : 20,
    enabled: Platform.OS === 'ios',
  }), []);

  // Memoize search input icon
  const searchIconComponent = useMemo(() => <SearchIcon />, []);

  const handleFolderClick = useCallback((folderId) => {
    setFolderId(folderId);
    setTab('SET');
    setShowFolder(false);
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
    setSearch(false);
  }, []);

  const handleFoldersTabClick = useCallback(() => {
    setTab('FOLDERS');
    setOpenSetSheet(false);
    setSearchValue('');
    setSearch(false);
    setShowFolder(false);
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
          {...keyboardAvoidingProps}>
          <View
            style={[styles.mainView, {backgroundColor: colorTheme.background1}]}>
            <LinearGradient
              colors={colorTheme.gradientTheme}
              style={styles.headerContainer}>
            {renderHeader()}
            {search && (
              <View style={styles.searchContainer}>
                <CustomeInputField
                  placeholder={strings.search}
                  placeholderTextColor={Color.Gainsboro}
                  onChangeText={setSearchValue}
                  value={searchValue}
                  backgroundColor={'#3a6675'}
                  height={height * 0.065}
                  iconLeft={true}
                  IconLeftComponent={searchIconComponent}
                  inputContainerStyles={styles.inputContainerStyle}
                  inputStyles={styles.inputStyles}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </View>
            )}
            {renderButtons()}
          </LinearGradient>
          <View style={styles.contentContainer}>
            {tab === 'SET' && (
              <SetComponent
                folderId={folderId}
                openSetSheet={openSetSheet}
                setOpenSetSheet={setOpenSetSheet}
                search={searchValue}
                showFolder={showFolder}
              />
            )}
            {tab === 'FOLDERS' && (
              <FolderComponent
                onFolderClick={handleFolderClick}
                handleCreateSetClick={handleCreateSetClick}
                setSearchValue={setSearchValue}
                search={searchValue}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
      </MenuProvider>
    );
  }, [
    keyboardAvoidingProps,
    renderHeader,
    search,
    searchValue,
    searchIconComponent,
    renderButtons,
    colorTheme.background1,
    colorTheme.gradientTheme,
    folderId,
    openSetSheet,
    showFolder,
    tab,
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
  contentContainer: {
    flex: 1,
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
    paddingLeft: scale(20),
    paddingRight: scale(20),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchContainer: {
    paddingHorizontal: scale(20),
  },
});
