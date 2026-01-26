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
import {Image, StyleSheet, Text, View} from 'react-native';
import {MenuOption} from 'react-native-popup-menu';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../Color';
import Font from '../Font';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';
import useTheme from '../Theme';
import strings from '../../language/strings';
import { scale, verticalScale } from '../../custome/Responsive';
import { Divider } from '@rneui/themed/dist/Divider';

// Each option uses MenuOption so the popup closes automatically on selection.

const SetDetailModalContent = ({
  folderId,
  setId,
  setLayout,
  layout,
  blurAllCard,
  isBlur,
  setChangeOrder,
}) => {
  const navigation = useNavigation();
  const colorTheme = useTheme();

  return (
    <View style={styles.wrapper}>
      {layout === 'single' && (
        <>
          <MenuOption
            onSelect={() => {
              setChangeOrder(true);
            }}
          >
            <View style={styles.container}>
              <MaterialCommunityIcons
                name="swap-vertical"
                size={scale(16)}
                color={colorTheme.textColor}
              />
              <Text style={[styles.text, {color: colorTheme.textColor}]}> 
                {strings.changeOrder}
              </Text>
            </View>
          </MenuOption>
          <Divider />
        </>
      )}
      <MenuOption
        onSelect={() => {
          isBlur ? blurAllCard(false) : blurAllCard(true);
        }}
      >
        <View style={styles.container}>
          <MaterialCommunityIcons
            name="blur"
            size={scale(16)}
            color={colorTheme.textColor}
          />
          <Text style={[styles.text, {color: colorTheme.textColor}]}> 
            {strings.blur}
          </Text>
        </View>
      </MenuOption>
      <Divider />
      <MenuOption
        onSelect={() => {
          navigation.navigate(ScreenName.createCard, {
            folderId: folderId,
            setId: setId,
          });
        }}
      >
        <View style={styles.container}>
          <Entypo name="plus" size={scale(20)} color={colorTheme.textColor} />
          <Text style={[styles.text, {color: colorTheme.textColor}]}> 
            {strings.createCard}
          </Text>
        </View>
      </MenuOption>
      <Divider />
      <MenuOption
        onSelect={() => {
          layout === 'single' ? setLayout('grid') : setLayout('single');
        }}
      >
        <View style={[styles.container, styles.lastItem]}>
          {layout === 'single' ? (
            <Image
              source={require('../../Assets/Img/gridLayout.png')}
              style={styles.layoutIcon}
              tintColor={colorTheme.textColor}
            />
          ) : (
            <Image
              source={require('../../Assets/Img/singleLayout.png')}
              style={styles.layoutIcon}
              tintColor={colorTheme.textColor}
            />
          )}
          <Text style={[styles.text, {color: colorTheme.textColor, marginLeft: scale(3)}]}> 
            {strings.layout}
          </Text>
        </View>
      </MenuOption>
    </View>
  );
};

export default React.memo(SetDetailModalContent);

const styles = StyleSheet.create({
  wrapper: {
    padding: scale(12),
    display: 'flex',
    flexDirection: 'column',
    gap: verticalScale(4),
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  text: {
    fontSize: scale(16),
    color: Color.Black,
    fontFamily: Font.regular,
    textTransform: 'capitalize',
  },
  layoutIcon: {
    width: scale(15),
    height: scale(15),
  },
});
