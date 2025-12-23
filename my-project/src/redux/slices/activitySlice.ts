import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

/* ---------------------- Types ---------------------- */
export interface Activity {
  id: string;
  userId: string;
  action: string;
  time: string; // ISO string
  details?: string;
}

export interface ActivityState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

/* ---------------------- Async Thunk ---------------------- */
// ✅ Fetch recent activity for the logged-in user
export const fetchRecentActivity = createAsyncThunk<
  Activity[], // return type
  void,       // no arguments
  { rejectValue: string }
>(
  'activity/fetchRecentActivity',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/activity/recent');
      return response.data as Activity[];
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || 'Failed to load recent activity';
      return rejectWithValue(message);
    }
  }
);

/* ---------------------- Initial State ---------------------- */
const initialState: ActivityState = {
  activities: [],
  loading: false,
  error: null,
};

/* ---------------------- Slice ---------------------- */
const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    clearActivityState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action: PayloadAction<Activity[]>) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch recent activity';
      });
  },
});

/* ---------------------- Exports ---------------------- */
export const { clearActivityState } = activitySlice.actions;
export default activitySlice.reducer;
