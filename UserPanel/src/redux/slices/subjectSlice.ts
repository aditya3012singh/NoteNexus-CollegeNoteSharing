import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

/* ---------------------- TYPES ---------------------- */
export interface Subject {
  id: string;
  name: string;
  code?: string;
  branch?: string;
  semester?: string;
  [key: string]: any;
}

interface SubjectState {
  subjects: Subject[];
  selectedSubject: Subject | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

/* ---------------------- ASYNC THUNKS ---------------------- */

// ✅ Create Subject
export const createSubject = createAsyncThunk<
  Subject,
  Partial<Subject>,
  { rejectValue: string }
>('subjects/createSubject', async (subjectData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/subjects/subject', subjectData);
    return response.data?.data || response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Failed to create subject';
    return rejectWithValue(message);
  }
});

// ✅ Get All Subjects
export const getAllSubjects = createAsyncThunk<
  Subject[],
  void,
  { rejectValue: string }
>('subjects/getAllSubjects', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/subjects/subjects');
    return response.data?.data || response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Failed to fetch subjects';
    return rejectWithValue(message);
  }
});

// ✅ Get Subject by ID
export const getSubject = createAsyncThunk<
  Subject,
  string,
  { rejectValue: string }
>('subjects/getSubject', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/subjects/subject/${id}`);
    return response.data?.data || response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Failed to fetch subject';
    return rejectWithValue(message);
  }
});

// ✅ Update Subject
export const updateSubject = createAsyncThunk<
  Subject,
  { id: string; subjectData: Partial<Subject> },
  { rejectValue: string }
>('subjects/updateSubject', async ({ id, subjectData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/subjects/subject/${id}`, subjectData);
    return response.data?.data || response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Failed to update subject';
    return rejectWithValue(message);
  }
});

// ✅ Delete Subject
export const deleteSubject = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('subjects/deleteSubject', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/subjects/subject/${id}`);
    return id;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Failed to delete subject';
    return rejectWithValue(message);
  }
});

/* ---------------------- INITIAL STATE ---------------------- */
const initialState: SubjectState = {
  subjects: [],
  selectedSubject: null,
  loading: false,
  error: null,
  successMessage: null,
};

/* ---------------------- SLICE ---------------------- */
const subjectSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- CREATE SUBJECT ---------- */
      .addCase(createSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action: PayloadAction<Subject>) => {
        state.loading = false;
        state.subjects.push(action.payload);
        state.successMessage = 'Subject created successfully';
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      /* ---------- GET ALL SUBJECTS ---------- */
      .addCase(getAllSubjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSubjects.fulfilled, (state, action: PayloadAction<Subject[]>) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(getAllSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      /* ---------- GET SUBJECT BY ID ---------- */
      .addCase(getSubject.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubject.fulfilled, (state, action: PayloadAction<Subject>) => {
        state.loading = false;
        state.selectedSubject = action.payload;
      })
      .addCase(getSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      /* ---------- UPDATE SUBJECT ---------- */
      .addCase(updateSubject.fulfilled, (state, action: PayloadAction<Subject>) => {
        state.loading = false;
        const updated = action.payload;
        state.subjects = state.subjects.map((s) =>
          s.id === updated.id ? updated : s
        );
        state.successMessage = 'Subject updated successfully';
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.error = action.payload || null;
      })

      /* ---------- DELETE SUBJECT ---------- */
      .addCase(deleteSubject.fulfilled, (state, action: PayloadAction<string>) => {
        state.subjects = state.subjects.filter((s) => s.id !== action.payload);
        state.successMessage = 'Subject deleted successfully';
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.error = action.payload || null;
      });
  },
});

/* ---------------------- EXPORTS ---------------------- */
export const { clearMessages } = subjectSlice.actions;
export default subjectSlice.reducer;
