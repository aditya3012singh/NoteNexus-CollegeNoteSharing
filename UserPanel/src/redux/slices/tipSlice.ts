import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

/* ---------------------- Types ---------------------- */
interface Tip {
  id: string;
  title: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
  updatedAt?: string;
  postedBy?: { id: string; name: string; email: string };
  approvedBy?: { id: string; name: string };
}

interface TipState {
  allTips: Tip[];
  pendingTips: Tip[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

/* ---------------------- Async Thunks ---------------------- */

// ✅ Create a new tip
export const createTip = createAsyncThunk<Tip, { title: string; content: string }, { rejectValue: string }>(
  'tips/createTip',
  async (tipData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tips/tip', tipData);
      return response.data.tip; // ✅ your backend returns { message, tip }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create tip');
    }
  }
);

// ✅ Fetch all approved tips
export const getAllTips = createAsyncThunk<Tip[], void, { rejectValue: string }>(
  'tips/getAllTips',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/tips/tip/all');
      // backend returns { tips: [...] }
      return response.data.tips || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tips');
    }
  }
);

// ✅ Fetch pending tips for admin moderation
export const getPendingTips = createAsyncThunk<Tip[], { page?: number; limit?: number }, { rejectValue: string }>(
  'tips/getPendingTips',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tips/tip/pending?page=${page}&limit=${limit}`);
      // backend returns { tips: [...], total, page, limit }
      return response.data.tips || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending tips');
    }
  }
);

// ✅ Approve or reject a tip (Admin)
export const approveTip = createAsyncThunk<
  { id: string; status: string; message: string },
  { id: string; status: 'APPROVED' | 'REJECTED' },
  { rejectValue: string }
>(
  'tips/approveTip',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/tips/tip/approve/${id}`, { status });
      return { id, status, message: response.data?.message || 'Tip updated successfully' };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update tip');
    }
  }
);

// ✅ Delete a tip (Admin only)
export const deleteTip = createAsyncThunk<string, string, { rejectValue: string }>(
  'tips/deleteTip',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/tips/tip/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete tip');
    }
  }
);

// ✅ Update user profile (shared use-case)
export const updateProfile = createAsyncThunk<any, Record<string, any>, { rejectValue: string }>(
  'user/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/users/update-profile', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

/* ---------------------- Initial State ---------------------- */

const initialState: TipState = {
  allTips: [],
  pendingTips: [],
  loading: false,
  error: null,
  successMessage: null,
};

/* ---------------------- Slice ---------------------- */

const tipSlice = createSlice({
  name: 'tips',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- CREATE TIP ---------- */
      .addCase(createTip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTip.fulfilled, (state, action: PayloadAction<Tip>) => {
        state.loading = false;
        state.successMessage = 'Tip submitted for approval';
        if (action.payload) state.allTips.unshift(action.payload);
      })
      .addCase(createTip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create tip';
      })

      /* ---------- GET ALL TIPS ---------- */
      .addCase(getAllTips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTips.fulfilled, (state, action: PayloadAction<Tip[]>) => {
        state.loading = false;
        state.allTips = Array.isArray(action.payload) ? action.payload : []; // ✅ Ensure array
      })
      .addCase(getAllTips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tips';
      })

      /* ---------- GET PENDING TIPS ---------- */
      .addCase(getPendingTips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingTips.fulfilled, (state, action: PayloadAction<Tip[]>) => {
        state.loading = false;
        state.pendingTips = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getPendingTips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch pending tips';
      })

      /* ---------- APPROVE TIP ---------- */
      .addCase(approveTip.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        state.pendingTips = state.pendingTips.filter((tip) => tip.id !== id);
        state.successMessage = `Tip ${status.toLowerCase()} successfully`;
      })
      .addCase(approveTip.rejected, (state, action) => {
        state.error = action.payload || 'Failed to approve tip';
      })

      /* ---------- DELETE TIP ---------- */
      .addCase(deleteTip.fulfilled, (state, action: PayloadAction<string>) => {
        const id = action.payload;
        state.allTips = state.allTips.filter((tip) => tip.id !== id);
        state.pendingTips = state.pendingTips.filter((tip) => tip.id !== id);
        state.successMessage = 'Tip deleted successfully';
      })
      .addCase(deleteTip.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete tip';
      })

      /* ---------- UPDATE PROFILE ---------- */
      .addCase(updateProfile.fulfilled, (state) => {
        state.successMessage = 'Profile updated successfully';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update profile';
      });
  },
});

/* ---------------------- Exports ---------------------- */
export const { clearMessages } = tipSlice.actions;
export default tipSlice.reducer;
