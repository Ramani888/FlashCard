import {useCallback, useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {apiDelete, apiGet, apiPost, apiPut} from '../Api/ApiService';
import Api from '../Api/EndPoint';
import showMessageonTheScreen from '../component/ShowMessageOnTheScreen';

/**
 * Custom hook for managing Set API operations
 * Encapsulates CRUD operations for sets
 * @param {Object} options - Hook options
 * @param {string} options.folderId - Optional folder ID to filter sets
 * @param {string} options.search - Search query
 * @param {Function} options.setExternalLoading - External loading state setter
 * @returns {Object} Set API methods and state
 */
const useSetApi = ({folderId = '', search = '', setExternalLoading = null} = {}) => {
  const isFocused = useIsFocused();
  const [setData, setSetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singleSetData, setSingleSetData] = useState({});

  // Form state
  const [setName, setSetName] = useState('');
  const [setStatus, setSetStatus] = useState(0);
  const [setColor, setSetColor] = useState('');
  const [colorView, setColorView] = useState(false);

  // Sync single set data with form fields
  useEffect(() => {
    if (singleSetData && Object.keys(singleSetData).length > 0) {
      setSetName(singleSetData?.name || '');
      setSetStatus(singleSetData?.isPrivate === true ? 1 : 0);
      setSetColor(singleSetData?.color || '');
      setColorView(singleSetData?.isHighlight || false);
    }
  }, [singleSetData]);

  // Fetch sets on focus
  useEffect(() => {
    if (isFocused) {
      getSetData(false);
    }
  }, [isFocused]);

  // Fetch sets on search change
  useEffect(() => {
    if (search !== undefined) {
      getSetData(true, '');
    }
  }, [search]);

  /**
   * Fetch set data from API
   */
  const getSetData = useCallback(
    async (showMessage = false, messageValue = '') => {
      if (!showMessage) {
        setLoading(true);
      }
      if (search && setExternalLoading) {
        setExternalLoading(true);
      }

      try {
        const url = folderId
          ? `${Api.FolderSet}?userId=${global?.user?._id}&folderId=${folderId}&search=${search || ''}`
          : `${Api.Set}?userId=${global?.user?._id}&search=${search || ''}`;
        
        const response = await apiGet(url);
        setSetData(response || []);
        
        if (messageValue) {
          showMessageonTheScreen(messageValue);
        }
      } catch (error) {
        console.log('Error fetching sets:', error);
        setSetData([]);
      } finally {
        setLoading(false);
        if (setExternalLoading) {
          setExternalLoading(false);
        }
      }
    },
    [folderId, search, setExternalLoading],
  );

  /**
   * Create a new set
   */
  const createSet = useCallback(async () => {
    const rawData = {
      name: setName,
      isPrivate: setStatus,
      color: setColor,
      userId: global?.user?._id,
      ...(folderId ? {folderId} : {}),
      isHighlight: colorView,
    };

    setLoading(true);
    try {
      const response = await apiPost(Api.Set, '', JSON.stringify(rawData));
      resetForm();
      await getSetData(true, response?.message);
    } catch (error) {
      console.log('Error creating set:', error);
    }
  }, [colorView, folderId, getSetData, setColor, setName, setStatus]);

  /**
   * Edit an existing set
   */
  const editSet = useCallback(async () => {
    const rawData = {
      _id: singleSetData?._id,
      name: setName,
      isPrivate: setStatus,
      color: setColor,
      userId: global?.user?._id,
      isHighlight: colorView,
    };

    setLoading(true);
    try {
      const response = await apiPut(Api.Set, '', JSON.stringify(rawData));
      resetForm();
      await getSetData(true, response?.message);
    } catch (error) {
      console.log('Error editing set:', error);
    }
  }, [colorView, getSetData, setColor, setName, setStatus, singleSetData]);

  /**
   * Remove folder association from a set
   */
  const removeFolder = useCallback(async () => {
    if (!singleSetData?._id) return;

    const rawData = {
      ...singleSetData,
      folderId: '',
    };

    setLoading(true);
    try {
      const response = await apiPut(Api.Set, '', JSON.stringify(rawData));
      await getSetData(true, response?.message);
    } catch (error) {
      console.log('Error removing folder:', error);
    } finally {
      setLoading(false);
    }
  }, [singleSetData, getSetData]);

  /**
   * Delete a set
   */
  const deleteSet = useCallback(async () => {
    if (!singleSetData?._id) return;

    setLoading(true);
    try {
      const response = await apiDelete(`${Api.Set}?_id=${singleSetData._id}`);
      await getSetData(true, response?.message);
    } catch (error) {
      console.log('Error deleting set:', error);
    }
  }, [singleSetData, getSetData]);

  /**
   * Reset form fields
   */
  const resetForm = useCallback(() => {
    setSetName('');
    setSetStatus(0);
    setSetColor('');
    setColorView(false);
  }, []);

  /**
   * Prepare form for editing
   */
  const prepareForEdit = useCallback((item) => {
    setSingleSetData(item);
  }, []);

  /**
   * Prepare form for create
   */
  const prepareForCreate = useCallback(() => {
    setSingleSetData({});
    resetForm();
  }, [resetForm]);

  return {
    // Data
    setData,
    singleSetData,
    loading,
    
    // Form state
    setName,
    setSetName,
    setStatus,
    setSetStatus,
    setColor,
    setSetColor,
    colorView,
    setColorView,
    
    // Actions
    getSetData,
    createSet,
    editSet,
    deleteSet,
    removeFolder,
    prepareForEdit,
    prepareForCreate,
    resetForm,
    setSingleSetData,
  };
};

export default useSetApi;
