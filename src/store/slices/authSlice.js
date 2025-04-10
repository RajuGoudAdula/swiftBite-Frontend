import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import userApi from '../../api/userApi';
import { fetchCartItems } from './cartSlice';

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),
  role: JSON.parse(localStorage.getItem('user'))?.role || null,
  loading: false,
  error: null,
  authChecked: false, // 🆕 to prevent rendering protected routes too early
};

// Thunk: Verify token on page refresh or app load
export const verifyUser = createAsyncThunk(
  'auth/verifyUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:5000/api/auth/verify-user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        return {
          user: res.data.user,
          token: res.data.token,
        };
      } else {
        return rejectWithValue('Verification failed. Please login again.');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk: Update user’s selected college/canteen
export const addCollegeCanteen = createAsyncThunk(
  'auth/addCollegeCanteen',
  async ({ userId, collegeId, canteenId }, { dispatch, rejectWithValue }) => {
    try {
      const res = await userApi.updateCollegeCanteen(userId, { collegeId, canteenId });
      dispatch(fetchCartItems(userId)); // Refresh cart
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update college & canteen');
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
