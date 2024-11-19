// import React from 'react';
// import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
// import Entypo from 'react-native-vector-icons/Entypo';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {scale, verticalScale} from '../../custome/Responsive';
// import Color from '../Color';
// import Font from '../Font';
// import {useNavigation} from '@react-navigation/native';
// import {ScreenName} from '../Screen';

// const PressableItem = ({icon, text, onPress, customTextStyle, isLast}) => (
//   <Pressable
//     style={[styles.container, isLast && styles.lastItem]}
//     onPress={onPress}>
//     {icon}
//     <Text style={[styles.text, customTextStyle]}>{text}</Text>
//   </Pressable>
// );

// const SetDetailModalContent = ({
//   closeModal,
//   folderId,
//   setId,
//   setLayout,
//   layout,
//   blurAllCard,
//   isBlur,
//   setChangeOrder,
// }) => {
//   // console.log('isBlur',isBlur)
//   const navigation = useNavigation();

//   return (
//     <View>
//       <PressableItem
//         icon={
//           <MaterialCommunityIcons
//             name="swap-vertical"
//             size={scale(15)}
//             color={Color.Black}
//           />
//         }
//         text="Change Order"
//         onPress={() => {
//           setChangeOrder(true);
//           closeModal();
//         }}
//       />
//       <PressableItem
//         icon={
//           <MaterialCommunityIcons
//             name="blur"
//             size={scale(15)}
//             color={Color.Black}
//           />
//         }
//         text={isBlur ? 'Blur' : 'Blur'}
//         onPress={() => {
//           isBlur ? blurAllCard(false) : blurAllCard(true);
//           closeModal();
//         }}
//       />
//       <PressableItem
//         icon={<Entypo name="plus" size={scale(19)} color={Color.Black} />}
//         text="Create Card"
//         onPress={() => {
//           navigation.navigate(ScreenName.createCard, {
//             folderId: folderId,
//             setId: setId,
//           });
//           closeModal();
//         }}
//         customTextStyle={{marginLeft: scale(-3)}}
//       />
//       <PressableItem
//         icon={
//           layout == 'single' ? (
//             <Image
//               source={require('../../Assets/Img/gridLayout.png')}
//               style={styles.layoutIcon}
//             />
//           ) : (
//             <Image
//               source={require('../../Assets/Img/singleLayout.png')}
//               style={styles.layoutIcon}
//             />
//           )
//         }
//         text="Layout"
//         onPress={() => {
//           layout == 'single' ? setLayout('grid') : setLayout('single');
//           closeModal();
//         }}
//         customTextStyle={{marginLeft: scale(-3)}}
//         isLast
//       />
//     </View>
//   );
// };

// export default React.memo(SetDetailModalContent);

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingLeft: scale(5),
//     borderBottomWidth: scale(0.7),
//     borderBottomColor: Color.mediumGray,
//     height: verticalScale(33),
//   },
//   lastItem: {
//     borderBottomWidth: 0,
//     marginBottom: verticalScale(-5),
//   },
//   text: {
//     fontSize: scale(15),
//     color: Color.Black,
//     fontFamily: Font.regular,
//     paddingLeft: scale(10),
//   },
//   layoutIcon: {width: scale(19), height: scale(19)},
// });


import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Color from '../Color';
import Font from '../Font';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';

const PressableItem = ({icon, text, onPress, customTextStyle, isLast}) => (
  <Pressable
    style={[styles.container, isLast && styles.lastItem]}
    onPress={onPress}>
    {icon}
    <Text style={[styles.text, customTextStyle]}>{text}</Text>
  </Pressable>
);

const SetDetailModalContent = ({
  closeModal,
  folderId,
  setId,
  setLayout,
  layout,
  blurAllCard,
  isBlur,
  setChangeOrder,
}) => {
  const navigation = useNavigation();

  return (
    <View>
      <PressableItem
        icon={
          <MaterialCommunityIcons
            name="swap-vertical"
            size={wp(4)} // Responsive size
            color={Color.Black}
          />
        }
        text="Change Order"
        onPress={() => {
          setChangeOrder(true);
          closeModal();
        }}
      />
      <PressableItem
        icon={
          <MaterialCommunityIcons
            name="blur"
            size={wp(4)} // Responsive size
            color={Color.Black}
          />
        }
        text={isBlur ? 'Blur' : 'Blur'}
        onPress={() => {
          isBlur ? blurAllCard(false) : blurAllCard(true);
          closeModal();
        }}
      />
      <PressableItem
        icon={<Entypo name="plus" size={wp(5)} color={Color.Black} />}
        text="Create Card"
        onPress={() => {
          navigation.navigate(ScreenName.createCard, {
            folderId: folderId,
            setId: setId,
          });
          closeModal();
        }}
        customTextStyle={{marginLeft: wp(-1)}}
      />
      <PressableItem
        icon={
          layout === 'single' ? (
            <Image
              source={require('../../Assets/Img/gridLayout.png')}
              style={styles.layoutIcon}
            />
          ) : (
            <Image
              source={require('../../Assets/Img/singleLayout.png')}
              style={styles.layoutIcon}
            />
          )
        }
        text="Layout"
        onPress={() => {
          layout === 'single' ? setLayout('grid') : setLayout('single');
          closeModal();
        }}
        customTextStyle={{marginLeft: wp(-1)}}
        isLast
      />
    </View>
  );
};

export default React.memo(SetDetailModalContent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp(2), // Responsive padding
    borderBottomWidth: wp(0.2), // Responsive border width
    borderBottomColor: Color.mediumGray,
    height: hp(4.5), // Responsive height
  },
  lastItem: {
    borderBottomWidth: 0,
    marginBottom: hp(-0.5), // Responsive margin
  },
  text: {
    fontSize: wp(4), // Responsive font size
    color: Color.Black,
    fontFamily: Font.regular,
    paddingLeft: wp(2.5), // Responsive padding
  },
  layoutIcon: {
    width: wp(5), // Responsive width
    height: wp(5), // Responsive height
  },
});
