import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Thunks
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id) => {
    await axiosInstance.put(`/notifications/mark-as-read/${id}`);
    return id;
  }
);

export const removeNotification = createAsyncThunk(
  'notifications/remove',
  async (id) => {
    await axiosInstance.delete(`/notifications/delete-notification/${id}`);
    return id;
  }
);

export const clearNotifications = createAsyncThunk(
  'notifications/clearAll',
  async (userId) => {
    await axiosInstance.delete(`/notifications/delete-all-notifications/${userId}`);
    return userId;
  }
);

export const userAllNotifications = createAsyncThunk(
    'notifications/userAllNotifications',
    async (userId) => {
     const res = await axiosInstance.get(`/notifications/user-all-notifications/${userId}`);
      return res?.data?.notifications;
    }
  );
  

// Initial state
const initialState = {
  notifications: [],
};

// Slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const exists = state.notifications.some(
        (notif) => notif._id === action.payload._id
      );
      if (!exists) {
        state.notifications = [...state.notifications, action.payload];
      }
    },    
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n._id === action.payload);
        if (notification) notification.isRead = true;
      })
      .addCase(removeNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(n => n._id !== action.payload);
      })
      .addCase(clearNotifications.fulfilled, (state) => {
        state.notifications = [];
      })
      .addCase(userAllNotifications.fulfilled,(state,action) => {
        state.notifications = [];
        state.notifications = action.payload;
        
      })
  }
});

// Exports
export const { addNotification, setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
