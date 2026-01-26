import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState, useCallback, memo, useRef} from 'react';
import Color from '../Color';
import {scale, verticalScale} from '../../custome/Responsive';
import Font from '../Font';
import {BlurView} from '@react-native-community/blur';
import Entypo from 'react-native-vector-icons/Entypo';
import {ScreenName} from '../Screen';
import {useNavigation} from '@react-navigation/native';
import useTheme from '../Theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import strings from '../../language/strings';
import {Menu, MenuTrigger, MenuOptions} from 'react-native-popup-menu';
import CardModalContent from './CardModalContent';
import AddNoteModalContent from './AddNoteModalContent';

const SimpleLayout = ({
  item,
  updateCard,
  folderId,
  setId,
  onDragStart,
  onDragEnd,
  deleteCard,
}) => {
  const navigation = useNavigation();
  const cardContainerRef = useRef();
  const [showNote, setShowNote] = useState(false);
  const themeColor = useTheme();

  const onCardLayout = useCallback(event => {
    const {height} = event.nativeEvent.layout;
  }, []);

  const toggleNote = useCallback(() => {
    setShowNote(prev => !prev);
  }, [item]);

  const toggleBlur = useCallback(() => {
    const isBlurred = item?.isBlur === 0 || item?.isBlur === false ? 1 : 0;
    updateCard(item?._id, item.top, item.bottom, item?.note, isBlurred);
  }, [item, updateCard]);

  const editNote = () => {
    navigation.navigate(ScreenName.createCard, {
      editNote: true,
      initialData: item,
      folderId: folderId,
      setId: setId,
    });
  };

  return (
    <Pressable
      onPressIn={onDragStart}
      onPressOut={onDragEnd}
      ref={cardContainerRef}
      onLayout={onCardLayout}
      style={styles.cardContainer}>
      <View
        style={[styles.cardHeader, {backgroundColor: themeColor.cardHeader}]}>
        <Text style={[styles.cardTitle, {color: themeColor.textColor}]}>
          {item.top}
        </Text>
        <View style={styles.cardActions}>
          {item?.note ? (
            <Pressable onPress={toggleNote}>
              <AntDesign
                name={'infocirlce'}
                size={scale(11)}
                color={Color.Grey}
                style={styles.dotsIcon}
              />
            </Pressable>
          ) : (
            <Menu>
              <MenuTrigger>
                <AntDesign
                  name={'infocirlce'}
                  size={scale(11)}
                  color={Color.Grey}
                  style={styles.dotsIcon}
                />
              </MenuTrigger>
              <MenuOptions customStyles={{optionsContainer: {borderRadius: scale(8), backgroundColor: themeColor.modelNewBackground}}}>
                <AddNoteModalContent
                  item={item}
                  folderId={folderId}
                  setId={setId}
                />
              </MenuOptions>
            </Menu>
          )}
          <Pressable onPress={toggleBlur}>
            <Entypo
              name={item?.isBlur ? 'eye-with-line' : 'eye'}
              size={scale(11)}
              color={Color.Grey}
              style={styles.dotsIcon}
            />
          </Pressable>
          <Menu>
            <MenuTrigger>
              <Entypo
                name="dots-three-vertical"
                size={scale(11)}
                color={Color.Grey}
                style={styles.dotsIcon}
              />
            </MenuTrigger>
            <MenuOptions customStyles={{optionsContainer: {borderRadius: scale(8), backgroundColor: themeColor.modelNewBackground}}}>
              <CardModalContent
                deleteCard={deleteCard}
                item={item}
                folderId={folderId}
                setId={setId}
              />
            </MenuOptions>
          </Menu>
        </View>
      </View>
      <View
        style={[
          styles.cardBody,
          {backgroundColor: themeColor.listAndBoxColor},
        ]}>
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
              <Text style={[styles.noteTitle, {color: themeColor.textColor}]}>
                {strings.note}
              </Text>
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
            <Text
              style={[
                styles.cardDescWithMargin,
                {color: themeColor.textColor},
              ]}>
              {item?.note}
            </Text>
          </View>
        )}
        {!showNote && (
          <Text style={[styles.cardDesc, {color: themeColor.textColor}]}>
            {item?.bottom}
          </Text>
        )}
      </View>
    </Pressable>
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
    textTransform: 'uppercase',
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
