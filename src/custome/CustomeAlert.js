import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {moderateScale, scale, verticalScale} from './Responsive';
import Color from '../component/Color';
import CustomeButton from './CustomeButton';
import CustomeModal from './CustomeModal';
import useTheme from '../component/Theme';
import Font from '../component/Font';

const CustomeAlert = ({isVisible, title, message, onConfirm, onCancel}) => {
  const colorTheme = useTheme();
  return (
    <CustomeModal
      visible={isVisible}
      onClose={onCancel}
      closeModal={false}
      mainPadding={scale(5)}
      backgroundColor={colorTheme.modelBackground}
      content={
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.btnView}>
             <CustomeButton
              title={'Ok'}
              buttonWidth={'30%'}
              buttonHeight={verticalScale(35)}
              buttonColor={Color.theme1}
              fontSize={moderateScale(14)}
              fontFamily={Font.semiBold}
              fontColor={Color.White}
              borderRadius={moderateScale(5)}
              marginTop={verticalScale(10)}
              marginBottom={verticalScale(10)}
              textTransform={'uppercase'}
              alignSelf={'flex-end'}
              onPress={onConfirm}
            />
          </View>
        </View>
      }
    />
  );
};

export default CustomeAlert;

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.White,
  },
  title: {
    fontSize: scale(18),
    color: Color.theme1,
    fontFamily: Font.bold,
    textAlign: 'center',
    marginTop:verticalScale(5)
  },
  message: {
    fontSize: scale(15),
    color: Color.Black,
    fontFamily: Font.medium,
    textAlign: 'center',
    marginTop: verticalScale(10),
    marginHorizontal:scale(5),
    lineHeight:verticalScale(18)
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: verticalScale(10),
  },
});

// import React from 'react';
// import {View, Text, Modal, StyleSheet} from 'react-native';
// import CustomeModal from './CustomeModal';
// import {scale, verticalScale} from 'react-native-size-matters';
// import Color from '../component/Color';
// import Font from '../component/Font';
// import CustomeButton from './CustomeButton';

// const CustomAlert = ({isVisible, title, message, onConfirm, onCancel}) => {
//   return (
//     <View>
//       <CustomeModal
//         visible={isVisible}
//         backgroundColor={'rgba(0, 0, 0, 0.9)'}
//         justifyContent={'center'}
//         alignItems={'center'}
//         onClose={onCancel}
//         content={
//             <View style={styles.container}>
//               <Text style={styles.title}>{title}</Text>
//               <Text style={styles.message}>{message}</Text>
//               <View style={styles.btnView}>
//                 <CustomeButton
//                   buttoncolor={Color.theme1}
//                   buttonwidth={'30%'}
//                   buttonheight={verticalScale(35)}
//                   borderRadius={scale(8)}
//                   title={'Ok'}
//                   fontcolor={Color.White}
//                   fontSize={scale(15)}
//                   fontFamily={Font.medium}
//                   marginLeft={scale(10)}
//                   onPress={onCancel}
//                 />
//               </View>
//             </View>
//         }
//       />
//     </View>
//   );
// };

// export default CustomAlert;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: Color.White,
//     padding: scale(10),
//     borderRadius: scale(10),
//     elevation: scale(5),
//     minWidth: scale(250),
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: scale(15),
//     color: Color.Black,
//     fontFamily: Font.bold,
//     marginBottom: verticalScale(10),
//   },
//   message: {
//     fontSize: scale(14),
//     color: Color.Black,
//     fontFamily: Font.regular,
//     marginBottom: verticalScale(20),
//   },
//   btnView: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     alignSelf: 'flex-end',
//   },
// });
