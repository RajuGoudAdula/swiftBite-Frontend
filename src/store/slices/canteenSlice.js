import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminApi from '../../api/adminApi';

// ✅ Fetch Canteens by College
export const fetchCanteensByCollege = createAsyncThunk(
  'canteen/fetchCanteensByCollege',
  async (collegeId, { rejectWithValue }) => {
    try {
      const response = await adminApi.fetchCanteens(collegeId);
      return { collegeId, canteens: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addCanteen = createAsyncThunk(
  'canteen/addCanteen',
  async ({ collegeId, canteenData }, { rejectWithValue }) => { // ✅ Fixed the typo
    try {
      const response = await adminApi.addCanteen(collegeId, canteenData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


// ✅ Update Canteen
export const updateCanteen = createAsyncThunk(
  'canteen/updateCanteen',
  async ({ collegeId, canteenId, canteenData }, { rejectWithValue }) => {
    try {
      const response = await adminApi.updateCanteen(collegeId, canteenId, canteenData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// ✅ Delete Canteen
export const deleteCanteen = createAsyncThunk(
  'canteen/deleteCanteen',
  async ({ collegeId, canteenId }, { rejectWithValue }) => {
    try {
      await adminApi.deleteCanteen(collegeId, canteenId);
      return canteenId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const canteenSlice = createSlice({
  name: 'canteen',
  initialState: {
    canteens: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Canteens 
      .addCase(fetchCanteensByCollege.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCanteensByCollege.fulfilled, (state, action) => {
        state.loading = false;
        state.canteens = action.payload.canteens;
      })
      .addCase(fetchCanteensByCollege.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Add Canteen
      .addCase(addCanteen.fulfilled, (state, action) => {
        state.canteens.push(action.payload);
      })
      .addCase(addCanteen.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ✅ Update Canteen
      .addCase(updateCanteen.fulfilled, (state, action) => {
        const index = state.canteens.findIndex(c => c._id === action.payload._id);
        state.canteens[index] = action.payload;
      })
      .addCase(updateCanteen.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ✅ Delete Canteen
      .addCase(deleteCanteen.fulfilled, (state, action) => {
        state.canteens = state.canteens.filter(c => c._id !== action.payload);
      })
      .addCase(deleteCanteen.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default canteenSlice.reducer;
