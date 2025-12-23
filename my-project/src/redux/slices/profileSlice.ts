import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';
import { updateAuthUser } from '../slices/authSlice';
/* ---------------------- TYPES ---------------------- */

export interface Branch {
  id: string;
  code: string;
  name: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  branch: Branch;
  semester: number;
  profilePic?: string;
  createdAt: string;
  [key: string]: any; // for any extra dynamic fields
}

export interface ProfileState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

/* ---------------------- ASYNC THUNKS ---------------------- */

// ✅ Update user profile
export const updateProfile = createAsyncThunk<
  void,               // return type
  Partial<UserProfile>,                // argument type
  { rejectValue: string }              // reject type
>(
  'profile/updateProfile',
  async (data, { dispatch, rejectWithValue }) => {
    try {
    const response = await axiosInstance.put('/users/update-profile', data);
    const updatedUser = response.data?.data;

    // 🔥 SINGLE SOURCE UPDATE
    dispatch(updateAuthUser(updatedUser));
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to update profile'
    );
  }
  }
);

export const getProfile = createAsyncThunk<
  { user: UserProfile },
  void,
  { rejectValue: { error: string } }
>("users/me", async (_, { rejectWithValue, dispatch }) => {
  try {
    const response = await axiosInstance.get("/users/me");
    // Update auth user with the fetched profile data
    dispatch(updateAuthUser(response.data.user));
    return response.data;
  } catch (error: any) {
    return rejectWithValue({
      error: error.response?.data?.message || "Failed to fetch profile",
    });
  }
});

/* ---------------------- INITIAL STATE ---------------------- */

const initialState: ProfileState = {
  
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
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })


      // ❌ Rejected
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
      })
      
      // Get Profile cases
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'object' && action.payload !== null 
          ? action.payload.error || 'Failed to fetch profile'
          : 'Failed to fetch profile';
        state.success = false;
      });
  },
});

/* ---------------------- EXPORTS ---------------------- */

export const { clearProfileState } = profileSlice.actions;
export default profileSlice.reducer;
