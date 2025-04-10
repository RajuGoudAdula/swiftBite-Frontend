import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';
import adminApi from '../../api/adminApi';

// ✅ Fetch Colleges (for users)
export const fetchColleges = createAsyncThunk(
  'college/fetchColleges',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.fetchColleges(); // User API for fetching colleges
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch colleges');
    }
  }
);

// ✅ Fetch Canteens based on selected College (for users)
export const fetchCanteens = createAsyncThunk(
  'college/fetchCanteens',
  async (collegeId, { rejectWithValue }) => {
    try {
      const response = await userApi.fetchCanteens(collegeId);
      return { collegeId, canteens: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch canteens');
    }
  }
);

// ✅ Add New College (for admin)
export const addCollege = createAsyncThunk(
  'college/addCollege',
  async (collegeData, { rejectWithValue }) => {
    try {
      const response = await adminApi.addCollege(collegeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add college');
    }
  }
);

// ✅ Update College (for admin)
export const updateCollege = createAsyncThunk(
  'college/updateCollege',
  async (collegeData , { rejectWithValue }) => {
    try {
      const response = await adminApi.updateCollege(collegeData.collegeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update college');
    }
  }
);

// ✅ Delete College (for admin)
export const deleteCollege = createAsyncThunk(
  'college/deleteCollege',
  async (collegeId, { rejectWithValue }) => {
    try {
      await adminApi.deleteCollege(collegeId);
      return collegeId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete college');
    }
  }
);

const collegeSlice = createSlice({
  name: 'college',
  initialState: {
    colleges: [],
    canteens: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Colleges (Users)
      .addCase(fetchColleges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColleges.fulfilled, (state, action) => {
        state.loading = false;
        state.colleges = action.payload;
      })
      .addCase(fetchColleges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch Canteens (Users)
      .addCase(fetchCanteens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCanteens.fulfilled, (state, action) => {
        state.loading = false;
        state.canteens = action.payload.canteens;
      })
      .addCase(fetchCanteens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Add College (Admin)
      .addCase(addCollege.fulfilled, (state, action) => {
        state.colleges.push(action.payload);
      })
      .addCase(addCollege.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ✅ Update College (Admin)
      .addCase(updateCollege.fulfilled, (state, action) => {
        if (!action.payload || !action.payload._id) return;
        const index = state.colleges.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.colleges[index] = action.payload;
        }
      })
      .addCase(updateCollege.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ✅ Delete College (Admin)
      .addCase(deleteCollege.fulfilled, (state, action) => {
        state.colleges = state.colleges.filter(c => c._id !== action.payload);
      })
      .addCase(deleteCollege.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default collegeSlice.reducer;
