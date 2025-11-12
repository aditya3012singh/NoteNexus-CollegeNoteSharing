import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

// ----------------------
// Types
// ----------------------
interface Feedback {
  id: string;
  userId: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
  [key: string]: any;
}

interface FeedbackState {
  feedbacks: Feedback[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: FeedbackState = {
  feedbacks: [],
  loading: false,
  error: null,
  successMessage: null,
};

// ----------------------
// Async Thunks
// ----------------------

// ✅ Submit Feedback
export const submitFeedback = createAsyncThunk<
  Feedback,
  Partial<Feedback>,
  { rejectValue: string }
>('feedback/submitFeedback', async (feedbackData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/feedback', feedbackData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to submit feedback'
    );
  }
});

// ✅ Get Feedbacks (for a specific note or tip)
export const getFeedbacks = createAsyncThunk<
  Feedback[],
  string,
  { rejectValue: string }
>('feedback/getFeedbacks', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/feedback/${id}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch feedbacks'
    );
  }
});

// ✅ Delete Feedback
export const deleteFeedback = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('feedback/deleteFeedback', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/feedback/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to delete feedback'
    );
  }
});

// ----------------------
// Slice
// ----------------------
const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    clearFeedbackMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Submit Feedback
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action: PayloadAction<Feedback>) => {
        state.loading = false;
        state.feedbacks.push(action.payload);
        state.successMessage = 'Feedback submitted successfully';
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to submit feedback';
      })

      // ✅ Get Feedbacks
      .addCase(getFeedbacks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeedbacks.fulfilled, (state, action: PayloadAction<Feedback[]>) => {
        state.loading = false;
        state.feedbacks = action.payload;
      })
      .addCase(getFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch feedbacks';
      })

      // ✅ Delete Feedback
      .addCase(deleteFeedback.fulfilled, (state, action: PayloadAction<string>) => {
        const id = action.payload;
        state.feedbacks = state.feedbacks.filter((f) => f.id !== id);
        state.successMessage = 'Feedback deleted successfully';
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to delete feedback';
      });
  },
});

export const { clearFeedbackMessages } = feedbackSlice.actions;
export default feedbackSlice.reducer;
