import { configureStore } from '@reduxjs/toolkit';

import subjectReducer from './slices/subjectSlice';
import announcementReducer from './slices/announcementSlice';
import eventReducer from './slices/eventSlice';
import feedbackReducer from './slices/feedbackSlice';
import fileReducer from './slices/fileSlice';
import authReducer from './slices/authSlice';
import tipsReducer from './slices/tipSlice';
import notesReducer from './slices/noteSlice';
import profileReducer from './slices/profileSlice'; // ✅ make sure you have this file
import activityReducer from './slices/activitySlice'
import currPageReducer from './slices/currPageSlice';
// ----------------------
// Configure Store
// ----------------------
export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
    tips: tipsReducer,
    event: eventReducer,
    announcement: announcementReducer,
    subject: subjectReducer,
    profile: profileReducer,
    file: fileReducer,
    feedback: feedbackReducer,
    activity: activityReducer,
    currPage: currPageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ disable serializability check for non-plain values (like FormData)
    }),
  devTools: process.env.NODE_ENV !== 'production', // ✅ enable devTools only in dev mode
});

// ----------------------
// Typed Hooks Support
// ----------------------
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
