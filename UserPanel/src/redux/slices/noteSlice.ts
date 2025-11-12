import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";

/* ---------------------- Types ---------------------- */

export interface Note {
  id: string;
  title: string;
  subject: string;
  branch: string;
  semester: string;
  fileUrl?: string;
  uploaderName?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: string;
  updatedAt?: string;
}

export interface NoteFilters {
  branch?: string;
  semester?: string;
  subject?: string;
}

export interface NoteState {
  notes: Note[];
  filteredNotes: Note[];
  selectedNote: Note | null;
  uploadSuccess: boolean;
  loading: boolean;
  error: string | null;
}

/* ---------------------- Async Thunks ---------------------- */

// ✅ Upload a note (FormData)
export const uploadNote = createAsyncThunk<
  any,
  FormData,
  { rejectValue: { error: string } }
>("notes/uploadNote", async (noteData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/notes/note/upload", noteData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { error: error.message });
  }
});

// ✅ Fetch all notes
export const getAllNotes = createAsyncThunk<
  any,
  void,
  { rejectValue: { error: string } }
>("notes/getAllNotes", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/notes/note/all");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { error: error.message });
  }
});

// ✅ Fetch single note by ID
export const getNote = createAsyncThunk<
  any,
  string,
  { rejectValue: { error: string } }
>("notes/getNote", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/notes/note/${id}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { error: error.message });
  }
});

// ✅ Filter notes
export const filterNotes = createAsyncThunk<
  any,
  NoteFilters,
  { rejectValue: { error: string } }
>("notes/filterNotes", async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams(filters as any).toString();
    const response = await axiosInstance.get(`/notes/note/filter?${params}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { error: error.message });
  }
});

// ✅ Approve a note (Admin only)
export const approveNote = createAsyncThunk<
  any,
  string,
  { rejectValue: { error: string } }
>("notes/approveNote", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/notes/note/approve/${id}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { error: error.message });
  }
});

/* ---------------------- Initial State ---------------------- */

const initialState: NoteState = {
  notes: [],
  filteredNotes: [],
  selectedNote: null,
  uploadSuccess: false,
  loading: false,
  error: null,
};

/* ---------------------- Slice ---------------------- */

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    clearNoteState: (state) => {
      state.error = null;
      state.uploadSuccess = false;
    },
  },
  extraReducers: (builder) => {
    /* ---------- UPLOAD NOTE ---------- */
    builder
      .addCase(uploadNote.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadNote.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.uploadSuccess = true;

        // Backend returns { message, notes: [...] }
        const uploaded = Array.isArray(action.payload.notes)
          ? action.payload.notes
          : [action.payload];

        state.notes = [...state.notes, ...uploaded];
      })
      .addCase(uploadNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to upload note";
      });

    /* ---------- GET ALL NOTES ---------- */
    builder
      .addCase(getAllNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNotes.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;

        const payload = action.payload;
        // ✅ Normalize backend responses
        if (Array.isArray(payload)) {
          state.notes = payload;
        } else if (Array.isArray(payload.notes)) {
          state.notes = payload.notes;
        } else {
          state.notes = [];
        }
      })
      .addCase(getAllNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch notes";
      });

    /* ---------- GET NOTE BY ID ---------- */
    builder
      .addCase(getNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNote.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const payload = action.payload;
        state.selectedNote = payload.note || payload;
      })
      .addCase(getNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch note";
      });

    /* ---------- FILTER NOTES ---------- */
    builder
      .addCase(filterNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterNotes.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;

        const payload = action.payload;
        state.filteredNotes = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.notes)
          ? payload.notes
          : [];
      })
      .addCase(filterNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to filter notes";
      });

    /* ---------- APPROVE NOTE ---------- */
    builder
      .addCase(approveNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveNote.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;

        const approvedNote = action.payload.note || action.payload;

        state.notes = state.notes.map((note) =>
          note.id === approvedNote.id ? approvedNote : note
        );
      })
      .addCase(approveNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to approve note";
      });
  },
});

/* ---------------------- Exports ---------------------- */

export const { clearNoteState } = noteSlice.actions;
export default noteSlice.reducer;
