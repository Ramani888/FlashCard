import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {FolderState, Folder, RootState} from '../../types';
import apiService from '../../services/apiService';
import Api from '../../Api/EndPoint';

const initialState: FolderState = {
  folders: [],
  selectedFolder: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchFolders = createAsyncThunk(
  'folders/fetchFolders',
  async (search: string = '', {getState, rejectWithValue}) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?._id;
      if (!userId) {
        return rejectWithValue('User not authenticated');
      }

      const response = await apiService.get<Folder[]>(
        `${Api.Folder}?userId=${userId}&search=${search}`,
      );
      return (response.data || []) as Folder[];
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch folders';
      return rejectWithValue(message);
    }
  },
);

export const createFolder = createAsyncThunk(
  'folders/createFolder',
  async (
    folderData: {
      name: string;
      color: string;
      isHighlight: boolean;
    },
    {getState, rejectWithValue},
  ) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?._id;

      const response = await apiService.post(Api.Folder, {
        ...folderData,
        userId,
      });

      if (response.success) {
        return response.data as Folder;
      }
      return rejectWithValue(response.message || 'Failed to create folder');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to create folder';
      return rejectWithValue(message);
    }
  },
);

export const updateFolder = createAsyncThunk(
  'folders/updateFolder',
  async (
    folderData: {
      _id: string;
      name: string;
      color: string;
      isHighlight: boolean;
    },
    {getState, rejectWithValue},
  ) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?._id;

      const response = await apiService.put(Api.Folder, {
        ...folderData,
        userId,
      });

      if (response.success) {
        return response.data as Folder;
      }
      return rejectWithValue(response.message || 'Failed to update folder');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to update folder';
      return rejectWithValue(message);
    }
  },
);

export const deleteFolder = createAsyncThunk(
  'folders/deleteFolder',
  async (folderId: string, {rejectWithValue}) => {
    try {
      const response = await apiService.delete(`${Api.Folder}?_id=${folderId}`);
      if (response.success) {
        return folderId;
      }
      return rejectWithValue(response.message || 'Failed to delete folder');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete folder';
      return rejectWithValue(message);
    }
  },
);

const folderSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    setSelectedFolder: (state, action: PayloadAction<Folder | null>) => {
      state.selectedFolder = action.payload;
    },
    clearFolderError: state => {
      state.error = null;
    },
    clearFolders: state => {
      state.folders = [];
      state.selectedFolder = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch folders
      .addCase(fetchFolders.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.folders = action.payload;
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create folder
      .addCase(createFolder.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.folders.push(action.payload);
        }
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update folder
      .addCase(updateFolder.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFolder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const index = state.folders.findIndex(
            f => f._id === action.payload._id,
          );
          if (index !== -1) {
            state.folders[index] = action.payload;
          }
        }
      })
      .addCase(updateFolder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete folder
      .addCase(deleteFolder.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.folders = state.folders.filter(f => f._id !== action.payload);
        if (state.selectedFolder?._id === action.payload) {
          state.selectedFolder = null;
        }
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {setSelectedFolder, clearFolderError, clearFolders} =
  folderSlice.actions;
export default folderSlice.reducer;
