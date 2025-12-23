import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../../UserPanel/src/lib/axios';

/* ---------------------- Types ---------------------- */
interface FileItem {
  id: string;
  filename?: string;
  name?: string;
  url: string;
  type?: string;
  size?: number;
  uploadedBy?: any;
  approvedBy?: any;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface ActivityItem {
  id: string;
  description: string;
  createdAt: string;
  [key: string]: any;
}

interface FileState {
  files: FileItem[];
  recentActivity: ActivityItem[];
  selectedFile: FileItem | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: FileState = {
  files: [],
  recentActivity: [],
  selectedFile: null,
  loading: false,
  error: null,
  successMessage: null,
};

/* ---------------------- Async Thunks ---------------------- */

// ✅ Upload File
export const uploadFile = createAsyncThunk<FileItem, FormData, { rejectValue: string }>(
  'files/uploadFile',
  async (fileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/files/file', fileData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // backend returns { message, file }
      return response.data.file;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload file');
    }
  }
);

// ✅ Get All Files
export const getAllFiles = createAsyncThunk<FileItem[], void, { rejectValue: string }>(
  'files/getAllFiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/files/files');
      // backend returns { files: [...] }
      return response.data.files || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch files');
    }
  }
);

// ✅ Get File by ID
export const getFile = createAsyncThunk<FileItem, string, { rejectValue: string }>(
  'files/getFile',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/files/file/${id}`);
      // backend returns { file }
      return response.data.file;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch file');
    }
  }
);

// ✅ Delete File
export const deleteFile = createAsyncThunk<string, string, { rejectValue: string }>(
  'files/deleteFile',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/files/file/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete file');
    }
  }
);

// ✅ Get Recent Activity
export const getRecentActivity = createAsyncThunk<ActivityItem[], void, { rejectValue: string }>(
  'files/getRecentActivity',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/files/recent-activity');
      return response.data.activity || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent activity');
    }
  }
);

/* ---------------------- Slice ---------------------- */
const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    clearFileMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Upload File
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadFile.fulfilled, (state, action: PayloadAction<FileItem>) => {
        state.loading = false;
        state.files.unshift(action.payload);
        state.successMessage = 'File uploaded successfully';
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to upload file';
      })

      // ✅ Get All Files
      .addCase(getAllFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllFiles.fulfilled, (state, action: PayloadAction<FileItem[]>) => {
        state.loading = false;
        state.files = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch files';
      })

      // ✅ Get Single File
      .addCase(getFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFile.fulfilled, (state, action: PayloadAction<FileItem>) => {
        state.loading = false;
        state.selectedFile = action.payload;
      })
      .addCase(getFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch file';
      })

      // ✅ Delete File
      .addCase(deleteFile.fulfilled, (state, action: PayloadAction<string>) => {
        state.files = state.files.filter((f) => f.id !== action.payload);
        state.successMessage = 'File deleted successfully';
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to delete file';
      })

      // ✅ Recent Activity
      .addCase(getRecentActivity.fulfilled, (state, action: PayloadAction<ActivityItem[]>) => {
        state.recentActivity = action.payload;
      })
      .addCase(getRecentActivity.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to fetch recent activity';
      });
  },
});

export const { clearFileMessages } = fileSlice.actions;
export default fileSlice.reducer;
