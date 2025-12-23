import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';

/* ---------------------- Types ---------------------- */
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  [key: string]: any;
}

interface EventState {
  events: Event[];
  selectedEvent: Event | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

/* ---------------------- Initial State ---------------------- */
const initialState: EventState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,
  successMessage: null,
};

/* ---------------------- Async Thunks ---------------------- */

// ✅ Create Event
export const createEvent = createAsyncThunk<Event, Partial<Event>, { rejectValue: string }>(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/events/event', eventData);
      // backend likely returns { message, event }
      return response.data.event || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create event');
    }
  }
);

// ✅ Get All Events
export const getAllEvents = createAsyncThunk<Event[], void, { rejectValue: string }>(
  'events/getAllEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/events/event');
      // backend returns { events: [...] }
      return response.data.events || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

// ✅ Get Single Event
export const getEvent = createAsyncThunk<Event, string, { rejectValue: string }>(
  'events/getEvent',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/events/event/${id}`);
      // backend returns { event: {...} }
      return response.data.event || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
    }
  }
);

// ✅ Update Event
export const updateEvent = createAsyncThunk<Event, { id: string; eventData: Partial<Event> }, { rejectValue: string }>(
  'events/updateEvent',
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/events/event/${id}`, eventData);
      // backend returns { message, event }
      return response.data.event || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update event');
    }
  }
);

// ✅ Delete Event
export const deleteEvent = createAsyncThunk<string, string, { rejectValue: string }>(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/events/event/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
    }
  }
);

/* ---------------------- Slice ---------------------- */
const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearEventMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- CREATE ---------- */
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.loading = false;
        if (action.payload) state.events.unshift(action.payload);
        state.successMessage = 'Event created successfully';
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to create event';
      })

      /* ---------- GET ALL ---------- */
      .addCase(getAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.loading = false;
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch events';
      })

      /* ---------- GET ONE ---------- */
      .addCase(getEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(getEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch event';
      })

      /* ---------- UPDATE ---------- */
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.loading = false;
        const updated = action.payload;
        state.events = state.events.map((e) => (e.id === updated.id ? updated : e));
        state.successMessage = 'Event updated successfully';
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to update event';
      })

      /* ---------- DELETE ---------- */
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<string>) => {
        const id = action.payload;
        state.events = state.events.filter((e) => e.id !== id);
        state.successMessage = 'Event deleted successfully';
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to delete event';
      });
  },
});

/* ---------------------- Exports ---------------------- */
export const { clearEventMessages } = eventSlice.actions;
export default eventSlice.reducer;
