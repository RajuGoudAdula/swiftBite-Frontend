import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import userApi from '../../api/userApi';
import { fetchCartItems } from './cartSlice';
import { addToast } from './toastSlice'; // ✅ Import addToast

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),
  role: JSON.parse(localStorage.getItem('user'))?.role || null,
  loading: false,
  error: null,
  authChecked: false,
};

// ✅ Thunk: Verify token on page refresh or app load
export const verifyUser = createAsyncThunk(
  'auth/verifyUser',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://swiftbite-backend-production.up.railway.app/api/auth/verify-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        dispatch(addToast({
          id: Date.now(),
          type: 'success',
          message: 'Session verified successfully!',
          duration: 3000,
        }));

        return {
          user: res.data.user,
          token: res.data.token,
        };
      } else {
        throw new Error('Verification failed. Please login again.');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;

      dispatch(addToast({
        id: Date.now(),
        type: 'error',
        message,
        duration: 3000,
      }));

      return rejectWithValue(message);
    }
  }
);

// ✅ Thunk: Update user’s selected college/canteen
export const addCollegeCanteen = createAsyncThunk(
  'auth/addCollegeCanteen',
  async ({ userId, collegeId, canteenId }, { dispatch, rejectWithValue }) => {
    try {
      const res = await userApi.updateCollegeCanteen(userId, { collegeId, canteenId });

      dispatch(fetchCartItems(userId));

      dispatch(addToast({
        id: Date.now(),
        type: 'success',
        message: res.data.message || 'Canteen and college updated',
        duration: 3000,
      }));

      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update college & canteen';

      dispatch(addToast({
        id: Date.now(),
        type: 'error',
        message,
        duration: 3000,
      }));

      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.authChecked = true;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.role = action.payload.user.role;
      state.authChecked = true;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', JSON.stringify(action.payload.token));
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== verifyUser =====
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.authChecked = false;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.role = action.payload.user.role;
        state.loading = false;
        state.authChecked = true;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', JSON.stringify(action.payload.token));
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
        state.role = null;
        state.authChecked = true;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      })

      // ===== addCollegeCanteen =====
      .addCase(addCollegeCanteen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCollegeCanteen.fulfilled, (state, action) => {
        if (state.user) {
          state.user.college = action.payload.college;
          state.user.canteen = action.payload.canteen;
          localStorage.setItem('user', JSON.stringify(state.user));
        }
        state.loading = false;
      })
      .addCase(addCollegeCanteen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
