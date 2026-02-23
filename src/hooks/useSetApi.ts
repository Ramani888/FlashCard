/**
 * Custom hook for managing Set API operations
 * Encapsulates CRUD operations for sets
 */
import {useCallback, useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {apiDelete, apiGet, apiPost, apiPut} from '../Api/ApiService';
import Api from '../Api/EndPoint';
import showMessageonTheScreen from '../component/ShowMessageOnTheScreen';
import {useAppSelector} from '../redux/hooks';

export interface CardSet {
  _id: string;
  name: string;
  color: string;
  isHighlight: boolean;
  userId?: string;
  folderId?: string;
}

interface UseSetApiOptions {
  folderId?: string;
  search?: string;
  setExternalLoading?: ((loading: boolean) => void) | null;
}

interface UseSetApiReturn {
  // Data
  setData: CardSet[];
  singleSetData: Partial<CardSet>;
  loading: boolean;

  // Form state
  setName: string;
  setSetName: (name: string) => void;
  setColor: string;
  setSetColor: (color: string) => void;
  colorView: boolean;
  setColorView: (view: boolean) => void;

  // Actions
  getSetData: (showMessage?: boolean, messageValue?: string) => Promise<void>;
  createSet: () => Promise<void>;
  editSet: () => Promise<void>;
  deleteSet: () => Promise<void>;
  removeFolder: () => Promise<void>;
  prepareForEdit: (item: CardSet) => void;
  prepareForCreate: () => void;
  resetForm: () => void;
  setSingleSetData: (item: Partial<CardSet>) => void;
}

const useSetApi = ({
  folderId = '',
  search = '',
  setExternalLoading = null,
}: UseSetApiOptions = {}): UseSetApiReturn => {
  const isFocused = useIsFocused();
  const [setData, setSetData] = useState<CardSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [singleSetData, setSingleSetData] = useState<Partial<CardSet>>({});

  // Form state
  const [setName, setSetName] = useState('');
  const [setColor, setSetColor] = useState('');
  const [colorView, setColorView] = useState(false);

  // Get user from Redux state instead of global
  const user = useAppSelector(state => state.auth.user);
  const userId = user?._id;

  // Sync single set data with form fields
  useEffect(() => {
    if (singleSetData && Object.keys(singleSetData).length > 0) {
      setSetName(singleSetData?.name || '');
      setSetColor(singleSetData?.color || '');
      setColorView(singleSetData?.isHighlight || false);
    }
  }, [singleSetData]);

  // Fetch sets on focus
  useEffect(() => {
    if (isFocused && userId) {
      getSetData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, userId]);

  // Fetch sets on search change
  useEffect(() => {
    if (search !== undefined && userId) {
      getSetData(true, '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  /**
   * Fetch set data from API
   */
  const getSetData = useCallback(
    async (showMessage = false, messageValue = '') => {
      if (!userId) return;

      if (!showMessage) {
        setLoading(true);
      }
      if (search && setExternalLoading) {
        setExternalLoading(true);
      }

      try {
        const url = folderId
          ? `${Api.FolderSet}?userId=${userId}&folderId=${folderId}&search=${search || ''}`
          : `${Api.Set}?userId=${userId}&search=${search || ''}`;

        const response = await apiGet<CardSet[]>(url);
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
    [folderId, search, setExternalLoading, userId],
  );

  /**
   * Create a new set
   */
  const createSet = useCallback(async () => {
    if (!userId) return;

    const rawData = {
      name: setName,
      color: setColor,
      userId: userId,
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
  }, [colorView, folderId, getSetData, setColor, setName, userId]);

  /**
   * Edit an existing set
   */
  const editSet = useCallback(async () => {
    if (!userId) return;

    const rawData = {
      _id: singleSetData?._id,
      name: setName,
      color: setColor,
      userId: userId,
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
  }, [colorView, getSetData, setColor, setName, singleSetData, userId]);

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
    setSetColor('');
    setColorView(false);
  }, []);

  /**
   * Prepare form for editing
   */
  const prepareForEdit = useCallback((item: CardSet) => {
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

export {useSetApi};
export default useSetApi;
