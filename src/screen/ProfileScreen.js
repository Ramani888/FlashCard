import React, {useState, useCallback, useRef} from 'react';
import {StyleSheet, Text, View, findNodeHandle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Color from '../component/Color';
import CustomeHeader from '../custome/CustomeHeader';
import {scale, verticalScale} from 'react-native-size-matters';
import Font from '../component/Font';
import CustomeInputField from '../custome/CustomeInputField';
import CustomeModal from '../custome/CustomeModal';
import ProfileModalContent from '../component/ProfileModalContent';

const ProfileScreen = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const editRef = useRef(null);

  const openModal = ref => {
    const handle = findNodeHandle(ref.current);
    if (handle) {
      ref.current.measureInWindow((x, y, width, height) => {
        setModalPosition({x: x - width * 5, y: y + height + 25});
        setModalVisible(true);
      });
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const setEditRef = (ref) => {
    editRef.current = ref;
  };

  // Memoize the header rendering
  const renderHeader = useCallback(() => {
    return (
      <CustomeHeader
        goBack={true}
        profileImage={true}
        edit={true}
        containerStyle={styles.headerStyle}
        openEditModal={openModal}
        setEditRef={setEditRef}  // Pass the setEditRef function here
      />
    );
  }, []);

  // Memoize the body rendering
  const renderBody = useCallback(() => {
    return (
      <View style={styles.bodyContainer}>
        <View>
          <Text style={styles.usernameLabel}>Username</Text>
          <CustomeInputField
            placeholder="Username"
            placeholderTextColor={Color.mediumGray}
            onChangeText={setUserName}
            value={username}
            borderWidth={1}
            borderColor={Color.LightGray}
            height={verticalScale(40)}
            marginTop={verticalScale(5)}
            width="100%"
          />
        </View>

        <View>
          <Text style={styles.usernameLabel}>Email</Text>
          <CustomeInputField
            placeholder="Email"
            placeholderTextColor={Color.mediumGray}
            onChangeText={setEmail}
            value={email}
            borderWidth={1}
            borderColor={Color.LightGray}
            height={verticalScale(40)}
            marginTop={verticalScale(5)}
            width="100%"
          />
        </View>

        <View style={styles.seperator} />

        <View style={{paddingVertical: verticalScale(15)}}>
          <Text
            style={{
              fontSize: scale(20),
              fontFamily: Font.medium,
              color: Color.White,
              textAlign: 'center',
            }}>
            Subscription
          </Text>
        </View>
      </View>
    );
  }, [username, email]);

  return (
    <LinearGradient
      colors={[Color.gradient1, Color.gradient2, Color.gradient3]}
      style={styles.container}>
      {renderHeader()}
      {renderBody()}
      <CustomeModal
        visible={modalVisible}
        onClose={closeModal}
        closeModal={false}
        mainPadding={scale(5)}
        content={<ProfileModalContent closeModal={closeModal} />}
        width={scale(120)}
        justifyContent="flex-end"
        borderRadius={20}
        modalContainerStyle={[
          styles.modal,
          {top: modalPosition.y, left: modalPosition.x},
        ]}
      />
    </LinearGradient>
  );
};

export default React.memo(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    backgroundColor: Color.transparent,
  },
  bodyContainer: {
    marginHorizontal: scale(15),
    marginTop: verticalScale(30),
  },
  usernameLabel: {
    fontSize: scale(14),
    color: Color.White,
    fontFamily: Font.semiBold,
  },
  modal: {
    position: 'absolute',
    borderRadius: scale(10),
    backgroundColor: Color.White,
    elevation: scale(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: scale(0.3),
    shadowRadius: scale(4),
  },
  seperator: {
    borderBottomWidth: scale(1),
    borderBottomColor: Color.WhiteDefault,
    paddingVertical: verticalScale(10),
  },
});
