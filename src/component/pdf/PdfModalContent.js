import React, {useCallback, useMemo} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../Color';
import {scale} from '../../custome/Responsive';
import {useNavigation} from '@react-navigation/native';
import {ScreenName} from '../Screen';
import strings from '../../language/strings';
import ActionMenu from '../common/ActionMenu';
import {MENU_ICON_SIZE} from '../common/MenuOptionItem';

const PdfModalContent = ({
  type,
  openBottomSheet,
  setEditBottomSheet,
  onDeletePress,
  pdfId,
  colorTheme,
  downloadPdf,
  singlePdfData,
}) => {
  const navigation = useNavigation();

  const handleDelete = useCallback(() => {
    if (onDeletePress) {
      onDeletePress(pdfId);
    }
  }, [onDeletePress, pdfId]);

  const handleEdit = useCallback(() => {
    setEditBottomSheet(true);
    openBottomSheet();
  }, [setEditBottomSheet, openBottomSheet]);

  const handleDownload = useCallback(() => {
    if (downloadPdf && singlePdfData?.url) {
      downloadPdf(
        singlePdfData.url,
        singlePdfData.name
          ? `${singlePdfData.name}.pdf`
          : 'downloaded.pdf',
      );
    }
  }, [downloadPdf, singlePdfData]);

  const handleAssignFolder = useCallback(() => {
    navigation.navigate(ScreenName.assignPdfFolder, {pdfId: pdfId});
  }, [navigation, pdfId]);

  const folderActions = useMemo(() => [
    {
      icon: <MaterialIcons name="edit" size={MENU_ICON_SIZE} color={colorTheme.textColor} />,
      label: strings.edit,
      onSelect: handleEdit,
      textColor: colorTheme.textColor
    },
    {
      icon: <MaterialCommunityIcons name="delete" size={MENU_ICON_SIZE} color={Color.Red} />,
      label: strings.deleteFolder,
      onSelect: handleDelete,
      textColor: colorTheme.textColor,
      isDanger: true,
      showDivider: false
    }
  ], [colorTheme.textColor, handleEdit, handleDelete]);

  const pdfActions = useMemo(() => [
    {
      icon: <MaterialIcons name="edit" size={MENU_ICON_SIZE} color={colorTheme.textColor} />,
      label: strings.edit,
      onSelect: handleEdit,
      textColor: colorTheme.textColor
    },
    {
      icon: <MaterialCommunityIcons name="delete" size={MENU_ICON_SIZE} color={Color.Red} />,
      label: strings.delete,
      onSelect: handleDelete,
      textColor: colorTheme.textColor,
      isDanger: true
    },
    {
      icon: <Feather name="download" size={scale(15)} color={colorTheme.textColor} />,
      label: strings.downloadPdf,
      onSelect: handleDownload,
      textColor: colorTheme.textColor
    },
    {
      icon: <Feather name="folder-plus" size={scale(15)} color={colorTheme.textColor} />,
      label: strings.assignFolder,
      onSelect: handleAssignFolder,
      textColor: colorTheme.textColor,
      showDivider: false
    }
  ], [colorTheme.textColor, handleEdit, handleDelete, handleDownload, handleAssignFolder]);

  return <ActionMenu actions={type === 'Folder' ? folderActions : pdfActions} />;
};

export default React.memo(PdfModalContent);
