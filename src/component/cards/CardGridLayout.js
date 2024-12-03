import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import Color from '../Color';
import {scale, verticalScale} from '../../custome/Responsive';
import Font from '../Font';
import {BlurView} from '@react-native-community/blur';
import Entypo from 'react-native-vector-icons/Entypo';

const CardGridLayout = ({
  item,
  updateCard,
  threeDotIconRef,
  setItem,
  folderId,
  setId,
  openCardModal,
  openNoteModal,
}) => {
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
  }, [item]);

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
      style={{margin: scale(5)}}>
      <View style={styles.gridCardHeader}>
        <Text style={styles.cardTitle}>{item.top}</Text>

        <View style={[styles.cardActions, styles.gridCardAction]}>
          <Pressable ref={infoIconRef} onPress={toggleNote}>
            <Image
              source={require('../../Assets/Img/infoIcon.png')}
              style={styles.infoIcon}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              const isBlurred = item?.isBlur == 0 ? 1 : 0;
              updateCard(
                item?._id,
                item.top,
                item.bottom,
                item?.note,
                isBlurred,
              );
            }}>
            {item?.isBlur ? (
              <Entypo
                name="eye-with-line"
                size={scale(11)}
                color={Color.Grey}
                style={styles.dotsIcon}
              />
            ) : (
              <Entypo
                name="eye"
                size={scale(11)}
                color={Color.Grey}
                style={styles.dotsIcon}
              />
            )}
          </Pressable>
          <Pressable
            ref={threeDotIconRef}
            onPress={() => {
              setItem(item);
              openCardModal();
            }}
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
              <Pressable onPress={editNote} style={styles.noteEditIcon}>
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
        {!showNote && (
          <Text style={[styles.cardDesc, {width: scale(130)}]}>
            {item.bottom}
          </Text>
        )}
      </View>
    </View>
  );
};

export default CardGridLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    backgroundColor: Color.transparent,
    height: verticalScale(125),
    alignItems: 'flex-end',
  },
  headerTitle: {
    top: verticalScale(50),
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleLine: {
    fontSize: scale(20),
    color: Color.White,
    fontFamily: Font.medium,
  },
  iconStyle: {
    bottom: verticalScale(30),
  },
  bodyContainer: {
    flex: 1,
    marginHorizontal: scale(15),
  },
  flatList: {
    flex: 1,
  },
  cardContainer: {
    marginBottom: verticalScale(10),
  },
  cardTitle: {
    fontSize: scale(14),
    fontFamily: Font.medium,
    color: Color.Black,
    paddingLeft: scale(10),
    width: scale(110),
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
    right: scale(-10),
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
  modal: {
    position: 'absolute',
    backgroundColor: Color.White,
    elevation: scale(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: scale(0.3),
    shadowRadius: scale(4),
    borderRadius: scale(10),
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 1000,
  },
  gridCardHeader: {
    flexDirection: 'row',
    backgroundColor: '#ececec',
    paddingVertical: scale(10),
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    alignItems: 'flex-start',
  },
  gridCardAction: {flexDirection: 'column', paddingVertical: verticalScale(5)},
  noteTitle: {
    fontSize: scale(20),
    color: Color.Black,
    fontFamily: Font.medium,
    textAlign: 'center',
  },
  noteEditIcon: {
    position: 'absolute',
    right: scale(0),
    top: verticalScale(7),
  },
  divider: {
    borderBottomWidth: scale(0.5),
    borderBottomColor: Color.LightGray,
    paddingTop: verticalScale(5),
  },
  cardDescWithMargin: {
    fontSize: scale(12),
    color: Color.Black,
    fontFamily: Font.regular,
    marginBottom: verticalScale(15),
    paddingTop: verticalScale(5),
  },
});
