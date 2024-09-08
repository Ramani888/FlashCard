import React, {useState, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
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

const VersesScreen = () => {
  const [search, setSearch] = useState(false);
  const [searchHashtags, setSearchHashtags] = useState('');
  const [tab, setTab] = useState('FOLDERS');
  const [folderData, setFolderData] = useState({});

  const handleFolderClick = data => {
    setFolderData(data); // Store the data to be passed to SetScreen
    setTab('SET'); // Switch to SetScreen
  };

  const renderHeader = () => {
    return (
      <CustomeHeader
        headerBackgroundColor={Color.transparent}
        goBack={true}
        title={'VERSES'}
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
      <View style={{flex: 1}}>
        <LinearGradient
          colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
          style={styles.headerContainer}>
          {renderHeader()}
          {search && (
            <View style={styles.searchContainer}>
              <View
                style={styles.searchIcon}
                onPress={() => setSearch(!search)}>
                <AntDesign
                  name="search1"
                  size={scale(10)}
                  color={Color.White}
                />
              </View>
              <CustomeInputField
                placeholder={'Search Hashtags'}
                placeholderTextColor={Color.Gainsboro}
                onChangeText={setSearchHashtags}
                value={searchHashtags}
                backgroundColor={'#3a6675'}
                borderWidth={0}
                height={verticalScale(40)}
                width={scale(280)}
                inputStyles={{paddingLeft:scale(5),backgroundColor:'red'}}
              />
            </View>
          )}
          {buttons()}
        </LinearGradient>
        {tab == 'SET' && <SetComponent folderData={folderData} />}
        {tab == 'FOLDERS' && (
          <FolderComponent onFolderClick={handleFolderClick} />
        )}
      </View>
    );
  }, [renderHeader, search, tab]);

  return <View style={{flex: 1}}>{renderBody()}</View>;
};

export default React.memo(VersesScreen);

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
  searchContainer: {
    marginHorizontal: scale(15),
    backgroundColor: '#3a6675',
    borderWidth: scale(0.5),
    borderColor: '#3a6675',
    height: verticalScale(45),
    borderRadius: scale(10),
    marginTop: verticalScale(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    backgroundColor: '#496e7c',
    borderRadius: scale(5),
    padding: scale(10),
    marginLeft: scale(8),
  },
  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(10),
  },
});
