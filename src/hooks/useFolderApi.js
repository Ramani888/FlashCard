import {useCallback, useEffect, useState} from 'react';
import {apiDelete, apiGet, apiPost, apiPut} from '../Api/ApiService';
import Api from '../Api/EndPoint';
import showMessageonTheScreen from '../component/ShowMessageOnTheScreen';

/**
 * Custom hook for managing Folder API operations
 * Encapsulates CRUD operations for folders
 * @param {Object} options - Hook options
 * @param {string} options.search - Search query
 * @param {Function} options.setExternalLoading - External loading state setter
 * @returns {Object} Folder API methods and state
 */
const useFolderApi = ({search = '', setExternalLoading = null} = {}) => {
  const [folderData, setFolderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singleFolderItem, setSingleFolderItem] = useState({});

  // Form state
  const [folderName, setFolderName] = useState('');
  const [folderStatus, setFolderStatus] = useState(0);
  const [folderColor, setFolderColor] = useState('');
  const [colorView, setColorView] = useState(false);

  // Sync single folder data with form fields
  useEffect(() => {
    if (singleFolderItem && Object.keys(singleFolderItem).length > 0) {
      setFolderName(singleFolderItem?.name || '');
      setFolderStatus(singleFolderItem?.isPrivate === true ? 1 : 0);
      setFolderColor(singleFolderItem?.color || '');
      setColorView(singleFolderItem?.isHighlight || false);
    }
  }, [singleFolderItem]);

  // Initial fetch
  useEffect(() => {
    getFolderData(false);
  }, []);

  // Fetch on search change
  useEffect(() => {
    if (search !== undefined) {
      getFolderData(true, '');
    }
  }, [search]);

  /**
   * Fetch folder data from API
   */
  const getFolderData = useCallback(
    async (showMessage = false, messageValue = '') => {
      if (!showMessage) {
        setLoading(true);
      }
      if (search && setExternalLoading) {
        setExternalLoading(true);
      }

      try {
        const response = await apiGet(
          `${Api.Folder}?userId=${global?.user?._id}&search=${search || ''}`,
        );
        setFolderData(response || []);
        
        if (messageValue) {
          showMessageonTheScreen(messageValue);
        }
      } catch (error) {
        console.log('Error fetching folders:', error);
        setFolderData([]);
      } finally {
        setLoading(false);
        if (setExternalLoading) {
          setExternalLoading(false);
        }
      }
    },
    [search, setExternalLoading],
  );

  /**
   * Create a new folder
   */
  const createFolder = useCallback(async () => {
    const rawData = {
      name: folderName,
      color: folderColor,
      userId: global?.user?._id,
      isHighlight: colorView,
    };

    setLoading(true);
    try {
      const response = await apiPost(Api.Folder, '', JSON.stringify(rawData));
      resetForm();
      await getFolderData(true, response?.message);
    } catch (error) {
      console.log('Error creating folder:', error);
    }
  }, [colorView, folderColor, folderName, getFolderData]);

  /**
   * Edit an existing folder
   */
  const editFolder = useCallback(async () => {
    const rawData = {
      _id: singleFolderItem?._id,
      name: folderName,
      color: folderColor,
      userId: global?.user?._id,
      isHighlight: colorView,
    };

    setLoading(true);
    try {
      const response = await apiPut(Api.Folder, '', JSON.stringify(rawData));
      resetForm();
      await getFolderData(true, response?.message);
    } catch (error) {
      console.log('Error editing folder:', error);
    }
  }, [colorView, folderColor, folderName, getFolderData, singleFolderItem]);

  /**
   * Delete a folder
   */
  const deleteFolder = useCallback(async () => {
    if (!singleFolderItem?._id) return;

    setLoading(true);
    try {
      const response = await apiDelete(
        `${Api.Folder}?_id=${singleFolderItem._id}`,
      );
      await getFolderData(true, response?.message);
    } catch (error) {
      console.log('Error deleting folder:', error);
    }
  }, [singleFolderItem, getFolderData]);

  /**
   * Reset form fields
   */
  const resetForm = useCallback(() => {
    setFolderName('');
    setFolderStatus(0);
    setFolderColor('');
    setColorView(false);
  }, []);

  /**
   * Prepare form for editing
   */
  const prepareForEdit = useCallback((item) => {
    setSingleFolderItem(item);
  }, []);

  /**
   * Prepare form for create
   */
  const prepareForCreate = useCallback(() => {
    setSingleFolderItem({});
    resetForm();
  }, [resetForm]);

  return {
    // Data
    folderData,
    singleFolderItem,
    loading,
    
    // Form state
    folderName,
    setFolderName,
    folderStatus,
    setFolderStatus,
    folderColor,
    setFolderColor,
    colorView,
    setColorView,
    
    // Actions
    getFolderData,
    createFolder,
    editFolder,
    deleteFolder,
    prepareForEdit,
    prepareForCreate,
    resetForm,
    setSingleFolderItem,
  };
};

export default useFolderApi;
