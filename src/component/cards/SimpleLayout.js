import {Alert, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState, useCallback, memo, useRef} from 'react';
import Color from '../Color';
import {scale, verticalScale} from 'react-native-size-matters';
import Font from '../Font';
import {BlurView} from '@react-native-community/blur';
import Entypo from 'react-native-vector-icons/Entypo';
import {ScreenName} from '../Screen';
import {useNavigation} from '@react-navigation/native';

const SimpleLayout = ({
  item,
  updateCard,
  threeDotIconRef,
  setItem,
  folderId,
  setId,
  openCardModal,
  openNoteModal,
}) => {
  const navigation = useNavigation();
  const infoIconRef = useRef();
  const cardContainerRef = useRef();
  const [showNote, setShowNote] = useState(false);
  const [cardHeight, setCardHeight] = useState(0);

  const onCardLayout = useCallback(event => {
    const {height} = event.nativeEvent.layout;
    setCardHeight(height);
  }, []);

  const toggleNote = useCallback(() => {
    if (item?.note) {
      setShowNote(prev => !prev);
    } else {
      openNoteModal(infoIconRef, cardHeight);
      setItem(item);
    }
  }, [item, cardHeight]);

  const toggleBlur = useCallback(() => {
    const isBlurred = item?.isBlur == 0 ? 1 : 0;
    updateCard(item?._id, item.top, item.bottom, item?.note, isBlurred);
  }, [item, updateCard]);

  const openModal = useCallback(() => {
    setItem(item);
    openCardModal();
  }, [item, setItem, openCardModal]);

  const editNote = () => {
    navigation.navigate(ScreenName.createCard, {
      editNote: true,
      initialData: item,
      folderId: folderId,
      setId: setId,
    });
  };

  return (
    <View
      ref={cardContainerRef}
      onLayout={onCardLayout}
      style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.top}</Text>
        <View style={styles.cardActions}>
          <Pressable ref={infoIconRef} onPress={toggleNote}>
            <Image
              source={require('../../Assets/Img/infoIcon.png')}
              style={styles.infoIcon}
            />
          </Pressable>
          <Pressable onPress={toggleBlur}>
            <Entypo
              name={item?.isBlur ? 'eye-with-line' : 'eye'}
              size={scale(11)}
              color={Color.Grey}
              style={styles.dotsIcon}
            />
          </Pressable>
          <Pressable
            ref={threeDotIconRef}
            onPress={openModal}
            style={styles.dotIconView}>
            <Entypo
              name="dots-three-vertical"
              size={scale(11)}
              color={Color.Grey}
              style={styles.dotsIcon}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.cardBody}>
        {item?.isBlur && (
          <BlurView
            style={styles.absoluteBlur}
            blurType="light"
            blurAmount={10}
            overlayColor={'rgba(255, 255, 255, 0)'}
          />
        )}
        {showNote && (
          <View>
            <View>
              <Text style={styles.noteTitle}>NOTE</Text>
              <Pressable onPress={() => editNote()} style={styles.noteEditIcon}>
                <Entypo
                  name="edit"
                  size={scale(11)}
                  color={Color.Grey}
                  style={styles.dotsIcon}
                />
              </Pressable>
            </View>
            <View style={styles.divider} />
            <Text style={styles.cardDescWithMargin}>{item?.note}</Text>
          </View>
        )}
        {!showNote && <Text style={styles.cardDesc}>{item?.bottom}</Text>}
      </View>
    </View>
  );
};

export default memo(SimpleLayout);

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: verticalScale(10),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ececec',
    paddingVertical: verticalScale(10),
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
  },
  cardTitle: {
    fontSize: scale(14),
    fontFamily: Font.medium,
    color: Color.Black,
    paddingLeft: scale(10),
    width: scale(230),
  },
  cardNumber: {
    fontSize: scale(14),
    fontFamily: Font.medium,
    color: Color.Black,
    paddingLeft: scale(20),
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
    position: 'absolute',
    right: scale(10),
    marginTop: verticalScale(10),
  },
  dotIconView: {},
  cardBody: {
    backgroundColor: Color.White,
    padding: scale(10),
    borderBottomLeftRadius: scale(10),
    borderBottomRightRadius: scale(10),
    position: 'relative',
    overflow: 'hidden',
  },
  cardDesc: {
    fontSize: scale(12),
    color: Color.Black,
    fontFamily: Font.regular,
  },
  cardDescWithMargin: {
    fontSize: scale(12),
    color: Color.Black,
    fontFamily: Font.regular,
    marginBottom: verticalScale(15),
    paddingTop: verticalScale(5),
  },
  infoIcon: {
    width: scale(24),
    height: scale(24),
  },
  dotsIcon: {
    backgroundColor: '#e0e0e0',
    borderRadius: scale(5),
    padding: scale(4),
  },
  absoluteBlur: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  noteTitle: {
    fontSize: scale(20),
    color: Color.Black,
    fontFamily: Font.medium,
    textAlign: 'center',
  },
  noteEditIcon: {
    position: 'absolute',
    right: scale(10),
    top: verticalScale(7),
  },
  divider: {
    borderBottomWidth: scale(0.5),
    borderBottomColor: Color.LightGray,
    paddingTop: verticalScale(5),
  },
});
