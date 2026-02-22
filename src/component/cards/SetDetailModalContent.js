import React, {useMemo} from 'react';
import {Image, StyleSheet} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';
import useTheme from '../Theme';
import strings from '../../language/strings';
import {scale} from '../../custome/Responsive';
import ActionMenu from '../common/ActionMenu';
import {MENU_ICON_SIZE} from '../common/MenuOptionItem';

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

  const gridLayoutIcon = useMemo(
    () => require('../../Assets/Img/gridLayout.png'),
    [],
  );
  const singleLayoutIcon = useMemo(
    () => require('../../Assets/Img/singleLayout.png'),
    [],
  );

  const actions = useMemo(() => [
    {
      icon: <MaterialCommunityIcons name="swap-vertical" size={MENU_ICON_SIZE} color={colorTheme.textColor} />,
      label: strings.changeOrder,
      onSelect: () => setChangeOrder(true),
      textColor: colorTheme.textColor,
      show: layout === 'single'
    },
    {
      icon: <MaterialCommunityIcons name="blur" size={MENU_ICON_SIZE} color={colorTheme.textColor} />,
      label: strings.blur,
      onSelect: () => isBlur ? blurAllCard(false) : blurAllCard(true),
      textColor: colorTheme.textColor
    },
    {
      icon: <Entypo name="plus" size={MENU_ICON_SIZE} color={colorTheme.textColor} />,
      label: strings.createCard,
      onSelect: () => {
        navigation.navigate(ScreenName.createCard, {
          folderId: folderId,
          setId: setId,
        });
      },
      textColor: colorTheme.textColor
    },
    {
      icon: layout === 'single' ? (
        <Image
          source={gridLayoutIcon}
          style={styles.layoutIcon}
          tintColor={colorTheme.textColor}
        />
      ) : (
        <Image
          source={singleLayoutIcon}
          style={styles.layoutIcon}
          tintColor={colorTheme.textColor}
        />
      ),
      label: strings.layout,
      onSelect: () => {
        layout === 'single' ? setLayout('grid') : setLayout('single');
      },
      textColor: colorTheme.textColor,
      showDivider: false
    }
  ], [
    colorTheme.textColor,
    layout,
    setChangeOrder,
    isBlur,
    blurAllCard,
    navigation,
    folderId,
    setId,
    setLayout,
    gridLayoutIcon,
    singleLayoutIcon,
  ]);

  return <ActionMenu actions={actions} />;
};

export default React.memo(SetDetailModalContent);

const styles = StyleSheet.create({
  layoutIcon: {
    width: scale(15),
    height: scale(15),
  },
});
