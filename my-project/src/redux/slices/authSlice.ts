import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

/* ---------------------- Types ---------------------- */
export interface User {
  id?: string;
  email: string;
  name: string;
  role?: string;
  token?: string | null;
  branch?: string;
  semester?: number;
  profilePic?: string;
}

export interface AuthState {
  user: User | null;
  otpSent: boolean;
  otpVerified: boolean;
  loading: boolean;
  error: string | null;
  adminExists: boolean | null;
  userExists: boolean | null;
}

/* ---------------------- Initial State ---------------------- */
const initialState: AuthState = {
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })(),
  otpSent: false,
  otpVerified: false,
  loading: false,
  error: null,
  adminExists: null,
  userExists: null,
};

/* ---------------------- Async Thunks ---------------------- */

// ✅ Check if admin exists
export const checkAdminExists = createAsyncThunk<
  { adminExists: boolean; adminCount: number },
  void,
  { rejectValue: { message: string } }
>('auth/checkAdminExists', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/users/check-admin');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { message: error.message });
  }
});

// ✅ Send OTP
export const sendOtp = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: { message: string } }
>('auth/sendOtp', async ({ email }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/users/generate-otp', { email });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { message: error.message });
  }
});

// ✅ Verify OTP
export const verifyOtp = createAsyncThunk<
  { message: string },
  { email: string; code: string },
  { rejectValue: { message: string } }
>('auth/verifyOtp', async ({ email, code }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/users/verify-otp', { email, code });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { message: error.message });
  }
});

// ✅ Sign Up
export const signUp = createAsyncThunk<
  { token: string; user: User },
  { email: string; name: string; password: string; role: string },
  { rejectValue: { message: string } }
>('auth/signUp', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/users/signup', payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { message: error.message });
  }
});

// ✅ Sign In
export const signIn = createAsyncThunk<
  { jwt?: string; token?: string; user: User; message?: string },
  { email: string; password: string },
  { rejectValue: { message: string } }
>('auth/signIn', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/users/signin', { email, password });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { message: error.message });
  }
});

// ✅ Check if user exists
export const checkUserExists = createAsyncThunk<
  { exists: boolean },
  string,
  { rejectValue: { message: string } }
>('auth/checkUserExists', async (email, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(
      `/users/check-user?email=${encodeURIComponent(email)}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { message: error.message });
  }
});

/* ---------------------- Helper ---------------------- */
const persistUser = (user: User | null, token?: string | null) => {
  if (user) {
    const data = { ...user, token: token ?? null };
    localStorage.setItem('user', JSON.stringify(data));
    if (token) localStorage.setItem('token', token);
  }
};

/* ---------------------- Slice ---------------------- */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.otpSent = false;
      state.otpVerified = false;
      state.error = null;
      state.adminExists = null;
      state.userExists = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    updateAuthUser: (state, action: PayloadAction<Partial<User>>) => {
    if (state.user) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  }

  },
  extraReducers: (builder) => {
    builder
      /* ---------- CHECK ADMIN ---------- */
      .addCase(checkAdminExists.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(checkAdminExists.fulfilled, (s, a) => {
        s.loading = false;
        s.adminExists = a.payload.adminExists;
      })
      .addCase(checkAdminExists.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || 'Failed to check admin';
      })

      /* ---------- SEND OTP ---------- */
      .addCase(sendOtp.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(sendOtp.fulfilled, (s) => {
        s.loading = false;
        s.otpSent = true;
      })
      .addCase(sendOtp.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || 'Failed to send OTP';
      })

      /* ---------- VERIFY OTP ---------- */
      .addCase(verifyOtp.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(verifyOtp.fulfilled, (s) => {
        s.loading = false;
        s.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || 'Failed to verify OTP';
      })

      /* ---------- SIGNUP ---------- */
      .addCase(signUp.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(signUp.fulfilled, (s, a) => {
        s.loading = false;
        const token = a.payload.token;
        const user = a.payload.user;
        persistUser(user, token);
        s.user = { ...user, token: token ?? null };
      })
      .addCase(signUp.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || 'Signup failed';
      })

      /* ---------- SIGNIN ---------- */
      .addCase(signIn.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(signIn.fulfilled, (s, a) => {
        s.loading = false;
        const token = a.payload.jwt || a.payload.token;
        const user = a.payload.user;
        persistUser(user, token);
        s.user = { ...user, token: token ?? null };
      })
      .addCase(signIn.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || 'Signin failed';
      })

      /* ---------- CHECK USER EXISTS ---------- */
      .addCase(checkUserExists.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(checkUserExists.fulfilled, (s, a) => {
        s.loading = false;
        s.userExists = a.payload.exists;
      })
      .addCase(checkUserExists.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || 'Failed to check user';
      });
  },
});

export const { logout, clearAuthError, updateAuthUser } = authSlice.actions;
export default authSlice.reducer;
