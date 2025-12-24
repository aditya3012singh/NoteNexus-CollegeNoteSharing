import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API = "http://localhost:3000/api/v1";

/* ================= TYPES ================= */

export type Branch = {
  id: string;
  code: string;
  name: string;
};

export type Subject = {
  id: string;
  name: string;
  semester: number;
};

export type Note = {
  id: string;
  title: string;
  semester: number;
  fileUrl: string;
  subject: { name: string };
  uploadedBy: { name: string };
};

interface UserNotesState {
  branches: Branch[];
  subjects: Subject[];
  notes: Note[];

  loadingNotes: boolean;
  loadingBranches: boolean;
  uploading: boolean;

  error: string | null;
}


/* ================= INITIAL STATE ================= */

const initialState: UserNotesState = {
  branches: [],
  subjects: [],
  notes: [],

  loadingNotes: false,
  loadingBranches: false,
  uploading: false,

  error: null,
};

/* ================= THUNKS ================= */

// 🔹 Fetch Branches
export const fetchBranches = createAsyncThunk(
  "userNotes/fetchBranches",
  async () => {
    const res = await fetch(`${API}/users/branch`);
    const data = await res.json();
    return data.branches; // IMPORTANT
  }
);

// 🔹 Fetch Subjects
export const fetchSubjects = createAsyncThunk(
  "userNotes/fetchSubjects",
  async ({ semester, branchCode }: { semester: number; branchCode: string }) => {
    const res = await fetch(
      `${API}/subjects/subject?semester=${semester}&branch=${branchCode}`
    );
    return await res.json();
  }
);

// 🔹 Fetch Approved Notes
export const fetchNotes = createAsyncThunk(
  "userNotes/fetchNotes",
  async () => {
    const res = await fetch(`${API}/notes/note/all`);
    const data = await res.json();
    return data.notes; // IMPORTANT
  }
);

// 🔹 Upload Note
export const uploadNote = createAsyncThunk(
  "userNotes/uploadNote",
  async (formData: FormData, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/notes/note/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      return rejectWithValue("Upload failed");
    }

    return await res.json();
  }
);

/* ================= SLICE ================= */

const userNotesSlice = createSlice({
  name: "userNotes",
  initialState,
  reducers: {
    clearSubjects(state) {
      state.subjects = [];
    },
  },
  extraReducers: (builder) => {
  builder

    /* -------- Branches -------- */
    .addCase(fetchBranches.pending, (state) => {
      state.loadingBranches = true;
    })
    .addCase(fetchBranches.fulfilled, (state, action) => {
      state.loadingBranches = false;
      state.branches = action.payload;
    })
    .addCase(fetchBranches.rejected, (state) => {
      state.loadingBranches = false;
      state.error = "Failed to load branches";
    })

    /* -------- Subjects -------- */
    .addCase(fetchSubjects.fulfilled, (state, action) => {
      state.subjects = action.payload;
    })

    /* -------- Notes -------- */
    .addCase(fetchNotes.pending, (state) => {
      state.loadingNotes = true;     // ✅ ONLY notes control skeleton
    })
    .addCase(fetchNotes.fulfilled, (state, action) => {
      state.loadingNotes = false;    // ✅ hide skeleton ONLY after notes arrive
      state.notes = action.payload;
    })
    .addCase(fetchNotes.rejected, (state) => {
      state.loadingNotes = false;
      state.error = "Failed to load notes";
    })

    /* -------- Upload -------- */
    .addCase(uploadNote.pending, (state) => {
      state.uploading = true;        // ✅ only button spinner
    })
    .addCase(uploadNote.fulfilled, (state) => {
      state.uploading = false;
    })
    .addCase(uploadNote.rejected, (state) => {
      state.uploading = false;
      state.error = "Upload failed";
    });
},
});

export const { clearSubjects } = userNotesSlice.actions;
export default userNotesSlice.reducer;
