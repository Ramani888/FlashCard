/**
 * Custom hook for managing Folder API operations
 * Encapsulates CRUD operations for folders
 */
import {useCallback, useEffect, useState} from 'react';
import {apiDelete, apiGet, apiPost, apiPut} from '../Api/ApiService';
import Api from '../Api/EndPoint';
import showMessageonTheScreen from '../component/ShowMessageOnTheScreen';
import {useAppSelector} from '../redux/hooks';

export interface Folder {
  _id: string;
  name: string;
  color: string;
  isHighlight: boolean;
  isPrivate?: boolean;
  userId?: string;
}

interface UseFolderApiOptions {
  search?: string;
  setExternalLoading?: ((loading: boolean) => void) | null;
}

interface UseFolderApiReturn {
  // Data
  folderData: Folder[];
  singleFolderItem: Partial<Folder>;
  loading: boolean;

  // Form state
  folderName: string;
  setFolderName: (name: string) => void;
  folderStatus: number;
  setFolderStatus: (status: number) => void;
  folderColor: string;
  setFolderColor: (color: string) => void;
  colorView: boolean;
  setColorView: (view: boolean) => void;

  // Actions
  getFolderData: (showMessage?: boolean, messageValue?: string) => Promise<void>;
  createFolder: () => Promise<void>;
  editFolder: () => Promise<void>;
  deleteFolder: () => Promise<void>;
  prepareForEdit: (item: Folder) => void;
  prepareForCreate: () => void;
  resetForm: () => void;
  setSingleFolderItem: (item: Partial<Folder>) => void;
}

const useFolderApi = ({
  search = '',
  setExternalLoading = null,
}: UseFolderApiOptions = {}): UseFolderApiReturn => {
  const [folderData, setFolderData] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [singleFolderItem, setSingleFolderItem] = useState<Partial<Folder>>({});

  // Form state
  const [folderName, setFolderName] = useState('');
  const [folderStatus, setFolderStatus] = useState(0);
  const [folderColor, setFolderColor] = useState('');
  const [colorView, setColorView] = useState(false);

  // Get user from Redux state instead of global
  const user = useAppSelector(state => state.auth.user);
  const userId = user?._id;

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
    if (userId) {
      getFolderData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Fetch on search change
  useEffect(() => {
    if (search !== undefined && userId) {
      getFolderData(true, '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  /**
   * Fetch folder data from API
   */
  const getFolderData = useCallback(
    async (showMessage = false, messageValue = '') => {
      if (!userId) return;

      if (!showMessage) {
        setLoading(true);
      }
      if (search && setExternalLoading) {
        setExternalLoading(true);
      }

      try {
        const response = await apiGet<Folder[]>(
          `${Api.Folder}?userId=${userId}&search=${search || ''}`,
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
    [search, setExternalLoading, userId],
  );

  /**
   * Create a new folder
   */
  const createFolder = useCallback(async () => {
    if (!userId) return;

    const rawData = {
      name: folderName,
      color: folderColor,
      userId: userId,
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
  }, [colorView, folderColor, folderName, getFolderData, userId]);

  /**
   * Edit an existing folder
   */
  const editFolder = useCallback(async () => {
    if (!userId) return;

    const rawData = {
      _id: singleFolderItem?._id,
      name: folderName,
      color: folderColor,
      userId: userId,
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
  }, [colorView, folderColor, folderName, getFolderData, singleFolderItem, userId]);

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
  const prepareForEdit = useCallback((item: Folder) => {
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

export {useFolderApi};
export default useFolderApi;
