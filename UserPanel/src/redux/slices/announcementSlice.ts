import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";

/* ---------------------- Types ---------------------- */
export interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AnnouncementState {
  announcements: Announcement[];
  selectedAnnouncement: Announcement | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

/* ---------------------- Initial State ---------------------- */
const initialState: AnnouncementState = {
  announcements: [],
  selectedAnnouncement: null,
  loading: false,
  error: null,
  successMessage: null,
};

/* ---------------------- Async Thunks ---------------------- */

// ✅ Create Announcement
export const createAnnouncement = createAsyncThunk<
  Announcement,
  { title: string; message: string },
  { rejectValue: string }
>("announcements/createAnnouncement", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/announcements/announcement", data);
    // backend returns { message, announcement }
    return response.data.announcement;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create announcement");
  }
});

// ✅ Get All Announcements
export const getAllAnnouncements = createAsyncThunk<Announcement[], void, { rejectValue: string }>(
  "announcements/getAllAnnouncements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/announcements/announcement");
      // backend returns { announcements: [...] }
      return response.data.announcements || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch announcements");
    }
  }
);

// ✅ Get Single Announcement
export const getAnnouncement = createAsyncThunk<Announcement, string, { rejectValue: string }>(
  "announcements/getAnnouncement",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/announcements/announcement/${id}`);
      return response.data.announcement;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch announcement");
    }
  }
);

// ✅ Update Announcement
export const updateAnnouncement = createAsyncThunk<
  Announcement,
  { id: string; announcementData: { title: string; message: string } },
  { rejectValue: string }
>("announcements/updateAnnouncement", async ({ id, announcementData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/announcements/announcement/${id}`, announcementData);
    // backend returns { message, announcement }
    return response.data.announcement;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update announcement");
  }
});

// ✅ Delete Announcement
export const deleteAnnouncement = createAsyncThunk<string, string, { rejectValue: string }>(
  "announcements/deleteAnnouncement",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/announcements/announcement/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete announcement");
    }
  }
);

/* ---------------------- Slice ---------------------- */
const announcementSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createAnnouncement.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAnnouncement.fulfilled, (state, action: PayloadAction<Announcement>) => {
        state.loading = false;
        if (action.payload) state.announcements.unshift(action.payload);
        state.successMessage = "Announcement created successfully";
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create announcement";
      })

      // GET ALL
      .addCase(getAllAnnouncements.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAnnouncements.fulfilled, (state, action: PayloadAction<Announcement[]>) => {
        state.loading = false;
        state.announcements = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch announcements";
      })

      // GET SINGLE
      .addCase(getAnnouncement.fulfilled, (state, action: PayloadAction<Announcement>) => {
        state.loading = false;
        state.selectedAnnouncement = action.payload;
      })
      .addCase(getAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch announcement";
      })

      // UPDATE
      .addCase(updateAnnouncement.fulfilled, (state, action: PayloadAction<Announcement>) => {
        const updated = action.payload;
        state.announcements = state.announcements.map((a) =>
          a.id === updated.id ? updated : a
        );
        state.successMessage = "Announcement updated successfully";
      })
      .addCase(updateAnnouncement.rejected, (state, action) => {
        state.error = action.payload || "Failed to update announcement";
      })

      // DELETE
      .addCase(deleteAnnouncement.fulfilled, (state, action: PayloadAction<string>) => {
        const id = action.payload;
        state.announcements = state.announcements.filter((a) => a.id !== id);
        state.successMessage = "Announcement deleted successfully";
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete announcement";
      });
  },
});

export const { clearMessages } = announcementSlice.actions;
export default announcementSlice.reducer;
