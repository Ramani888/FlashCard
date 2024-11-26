import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Switch} from '@rneui/themed';
import Color from '../Color';
import Font from '../Font';
import {scale, verticalScale, moderateScale} from '../../custome/Responsive';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';
import {apiPut} from '../../Api/ApiService';
import Api from '../../Api/EndPoint';

const ModalContent = ({
  closeModal,
  type,
  openBottomSheet,
  setEditBottomSheet,
  deleteData,
  handleCreateSetClick,
  singleItem,
  folderId,
  setId,
  getSetData,
}) => {
  const navigation = useNavigation();
  const [value, setValue] = useState(singleItem?.isPrivate);
  const isFirstRender = useRef(true); // To track the initial render

  const handleUpdateSetSecret = async () => {
    try {
      const response = await apiPut(
        Api.Set,
        '',
        JSON.stringify({...singleItem, isPrivate: value}),
      );
      getSetData(true, response?.message);
    } catch (error) {
      console.log('error in edit Set api', error);
    }
  };

  useEffect(() => {
    // Skip the first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      handleUpdateSetSecret();
    }
  }, [value]);

  const iconSize = useMemo(() => scale(20), []);
  const userIcon = useMemo(() => require('../../Assets/Img/userIcon.png'), []);
  const lockIcon = useMemo(() => require('../../Assets/Img/lock.png'), []);

  const renderBody = useMemo(
    () => (
      <View>
        {type == 'Set' ? (
          <Pressable
            style={styles.container}
            onPress={() => {
              closeModal();
              navigation.navigate(ScreenName.createCard, {
                folderId: folderId,
                setId: setId,
              });
            }}>
            <Entypo name="plus" size={iconSize} color={Color.Black} />
            <Text style={styles.text}>Create Card</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.container}
            onPress={() => {
              closeModal();
              handleCreateSetClick(singleFolderData?._id);
            }}>
            <Entypo name="plus" size={iconSize} color={Color.Black} />
            <Text style={styles.text}>Create Set</Text>
          </Pressable>
        )}
        {type == 'Set' && (
          <Pressable
            style={styles.container}
            onPress={() => {
              navigation.navigate(ScreenName.asignFolder, {
                setId: singleItem?._id,
              });
              closeModal();
            }}>
            <Feather name="folder-plus" size={iconSize} color={Color.Black} />
            <Text style={styles.text}>Assign Folder</Text>
          </Pressable>
        )}
        {type == 'Set' && (
          <Pressable
            style={styles.container}
            onPress={() => {
              setEditBottomSheet(true);
              openBottomSheet();
            }}>
            <MaterialIcons name="edit" size={iconSize} color={Color.Black} />
            <Text style={styles.text}>Edit Set</Text>
          </Pressable>
        )}
        {type == 'Folder' && (
          <Pressable
            style={styles.container}
            onPress={() => {
              setEditBottomSheet(true);
              openBottomSheet();
            }}>
            <MaterialIcons name="edit" size={iconSize} color={Color.Black} />
            <Text style={styles.text}>Edit Folder</Text>
          </Pressable>
        )}
        {type == 'Set' ? (
          <Pressable
            style={styles.container}
            onPress={() => {
              deleteData();
              closeModal();
            }}>
            <MaterialCommunityIcons
              name="delete"
              size={iconSize}
              color={Color.Red}
            />
            <Text style={styles.text}>Delete Set</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.container, type == 'Folder' && styles.folderModal]}
            onPress={() => {
              deleteData();
              closeModal();
            }}>
            <MaterialCommunityIcons
              name="delete"
              size={iconSize}
              color={Color.Red}
            />
            <Text style={styles.text}>Delete Folder</Text>
          </Pressable>
        )}
        {type == 'Set' && (
          <View style={styles.switchContainer}>
            <Image source={userIcon} style={styles.icon} />
            <View style={styles.switchContent}>
              <Switch
                value={value}
                onValueChange={() => setValue(!value)}
                thumbColor={value ? Color.theme1 : '#8E9494'}
                trackColor={{false: '#E7EAEB', true: Color.theme2}}
              />
              <Text style={styles.switchLabel}>
                {value ? 'Private' : 'Public'}
              </Text>
            </View>
            <Image source={lockIcon} style={styles.icon} />
          </View>
        )}
      </View>
    ),
    [value, iconSize, userIcon, lockIcon],
  );

  return <View>{renderBody}</View>;
};

export default React.memo(ModalContent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp('2%'),
    borderBottomWidth: wp('0.3%'),
    borderBottomColor: Color.mediumGray,
    height: hp('5%'),
  },
  text: {
    fontSize: wp('3.5%'),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: wp('2.5%'),
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp('1%'),
  },
  switchContent: {
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: wp('3.3%'),
    color: Color.Black,
    fontFamily: Font.regular,
  },
  icon: {
    width: wp('5%'),
    height: wp('5%'),
  },
  folderModal: {
    borderBottomWidth: 0,
    marginBottom: hp('-1%'),
  },
});

