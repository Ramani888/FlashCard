import React, {useState, useCallback} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Color from '../../component/Color';
import CustomeHeader from '../../custome/CustomeHeader';
import CustomeInputField from '../../custome/CustomeInputField';
import CustomeButton from '../../custome/CustomeButton';
import Font from '../../component/Font';
import SetComponent from '../../component/verses/SetComponent';
import FolderComponent from '../../component/verses/FolderComponent';
import {useRoute} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const CardTypeWiseFolderAndSetScreen = () => {
  const route = useRoute();
  const [search, setSearch] = useState(false);
  const [searchHashtags, setSearchHashtags] = useState('');
  const [tab, setTab] = useState('FOLDERS');
  const [folderId, setFolderId] = useState('');
  const {cardTypeId, cartTypeName} = route.params;

  const handleFolderClick = folderId => {
    setFolderId(folderId); // Store the data to be passed to SetScreen
    setTab('SET'); // Switch to SetScreen
  };

  const renderHeader = () => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={cartTypeName}
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
        title={'SET'}
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={tab == 'SET' ? Color.Black : Color.White}
        fontFamily={Font.medium}
        marginTop={verticalScale(15)}
        onPress={() => setTab('SET')}
      />

      <CustomeButton
        buttonColor={tab == 'FOLDERS' ? Color.White : Color.theme1}
        buttonWidth={scale(150)}
        buttonHeight={scale(45)}
        title={'FOLDERS'}
        borderRadius={scale(10)}
        fontSize={scale(15)}
        fontColor={tab == 'FOLDERS' ? Color.Black : Color.White}
        fontFamily={Font.medium}
        marginTop={verticalScale(15)}
        onPress={() => setTab('FOLDERS')}
      />
    </View>
  );

  const renderBody = useCallback(() => {
    return (
      <KeyboardAvoidingView
        style={{flex: 1}}
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}

        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
        enabled={Platform.OS === "ios" ? true : false}
      >
          <View style={{flex: 1}}>
            <LinearGradient
              colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
              style={styles.headerContainer}>
              {renderHeader()}
              {search && (
                <View>
                  <CustomeInputField
                    placeholder={'Search'}
                    placeholderTextColor={Color.Gainsboro}
                    onChangeText={setSearchHashtags}
                    value={searchHashtags}
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
            {tab == 'SET' && (
              <SetComponent folderId={folderId} cardTypeId={cardTypeId} />
            )}
            {tab == 'FOLDERS' && (
              <FolderComponent
                onFolderClick={handleFolderClick}
                cardTypeId={cardTypeId}
              />
            )}
          </View>
      </KeyboardAvoidingView>
    );
  }, [renderHeader, search, tab]);

  return (
    renderBody()
  );
};

export default React.memo(CardTypeWiseFolderAndSetScreen);

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
    color: Color.Black,
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
});
