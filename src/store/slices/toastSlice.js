import { createSlice, nanoid } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'toast',
  initialState: [],
  reducers: {
    addToast: {
      reducer(state, action) {
        state.push({
          ...action.payload.message,
          isPaused: false,
          timerId: null
        });
      },
      prepare(message, type = 'info', duration = 3000) {
        return {
          payload: {
            id: nanoid(),
            message,
            type,
            duration,
          },
        };
      },
    },
    removeToast(state, action) {
      return state.filter((toast) => toast.id !== action.payload);
    },
    pauseToast(state, action) {
      const toast = state.find((t) => t.id === action.payload);
      if (toast) {
        toast.isPaused = true;
        if (toast.timerId) {
          clearTimeout(toast.timerId);
          toast.timerId = null;
        }
      }
    },
    resumeToast(state, action) {
      const toast = state.find((t) => t.id === action.payload);
      if (toast) {
        toast.isPaused = false;
      }
    },
    setToastTimer(state, action) {
      const { id, timerId } = action.payload;
      const toast = state.find((t) => t.id === id);
      if (toast) {
        toast.timerId = timerId;
      }
    },
    clearAllToasts() {
      return [];
    }
  },
});

export const { 
  addToast, 
  removeToast, 
  pauseToast, 
  resumeToast, 
  setToastTimer,
  clearAllToasts
} = toastSlice.actions;

export default toastSlice.reducer;