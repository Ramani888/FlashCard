import React, {useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Switch} from '@rneui/themed';
import Color from '../Color';
import Font from '../Font';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';

const ModalContent = ({closeModal, type}) => {
  const navigation = useNavigation();
  const [value, setValue] = useState(false);

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
              navigation.navigate(ScreenName.createCard);
            }}>
            <Entypo name="plus" size={iconSize} color={Color.Black} />
            <Text style={styles.text}>Create Card</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.container}
            onPress={() => {
              closeModal();
            }}>
            <Entypo name="plus" size={iconSize} color={Color.Black} />
            <Text style={styles.text}>Create Set</Text>
          </Pressable>
        )}
        {type == 'Set' && (
          <Pressable style={styles.container} onPress={closeModal}>
            <Feather name="folder-plus" size={iconSize} color={Color.Black} />
            <Text style={styles.text}>Asign Folder</Text>
          </Pressable>
        )}
        <Pressable style={styles.container} onPress={closeModal}>
          <MaterialIcons name="edit" size={iconSize} color={Color.Black} />
          <Text style={styles.text}>Edit</Text>
        </Pressable>
        {type == 'Set' ? (
          <Pressable style={styles.container} onPress={closeModal}>
            <MaterialCommunityIcons
              name="delete"
              size={iconSize}
              color={Color.Red}
            />
            <Text style={styles.text}>Delete Set</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.container} onPress={closeModal}>
            <MaterialCommunityIcons
              name="delete"
              size={iconSize}
              color={Color.Red}
            />
            <Text style={styles.text}>Delete Folder</Text>
          </Pressable>
        )}
        <View style={styles.switchContainer}>
          <Image source={userIcon} style={styles.icon} />
          <View style={styles.switchContent}>
            <Switch
              value={value}
              onValueChange={setValue}
              thumbColor={value ? Color.theme1 : '#8E9494'}
              trackColor={{false: '#E7EAEB', true: Color.theme2}}
            />
            <Text style={styles.switchLabel}>Public</Text>
          </View>
          <Image source={lockIcon} style={styles.icon} />
        </View>
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
    paddingLeft: scale(5),
    borderBottomWidth: scale(0.7),
    borderBottomColor: Color.mediumGray,
    height: verticalScale(33),
  },
  text: {
    fontSize: scale(14),
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: scale(10),
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: verticalScale(5),
  },
  switchContent: {
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: scale(13),
    color: Color.Black,
    fontFamily: Font.regular,
  },
  icon: {
    width: scale(20),
    height: scale(20),
  },
});
