import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../../UserPanel/src/lib/axios';

/* ---------------------- TYPES ---------------------- */

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  branch?: string;
  semester?: string;
  profilePic?: string;
  [key: string]: any; // for any extra dynamic fields
}

export interface ProfileState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

/* ---------------------- ASYNC THUNKS ---------------------- */

// ✅ Update user profile
export const updateProfile = createAsyncThunk<
  Partial<UserProfile>,                // return type
  Partial<UserProfile>,                // argument type
  { rejectValue: string }              // reject type
>(
  'profile/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/users/update-profile', data);
      return response.data?.data || {};
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || 'Failed to update profile';
      return rejectWithValue(message);
    }
  }
);

/* ---------------------- INITIAL STATE ---------------------- */

const initialState: ProfileState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,
  error: null,
  success: false,
};

/* ---------------------- SLICE ---------------------- */

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🟡 Pending
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      // ✅ Fulfilled
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<Partial<UserProfile>>) => {
        state.loading = false;
        state.success = true;

        // Merge updated fields into local user
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      })

      // ❌ Rejected
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update profile';
        state.success = false;
      });
  },
});

/* ---------------------- EXPORTS ---------------------- */

export const { clearProfileState } = profileSlice.actions;
export default profileSlice.reducer;
