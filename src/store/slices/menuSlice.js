import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import canteenApi from "../../api/canteenApi";
import userApi from "../../api/userApi";

// ✅ Fetch All Menu Items
export const fetchMenuItems = createAsyncThunk(
  "menu/fetchMenuItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await canteenApi.getMenu();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch menu items");
    }
  }
);

// ✅ Fetch Menu of a Specific Canteen
export const fetchMenuOfCanteen = createAsyncThunk(
  "menu/fetchMenuOfCanteen",
  async (canteenId, { rejectWithValue }) => {
    try {
      const response = await userApi.getMenuByCanteen(canteenId); // Ensure this function exists in canteenApi
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch canteen menu");
    }
  }
);

// ✅ Add Menu Item
export const addMenuItem = createAsyncThunk(
  "menu/addMenuItem",
  async ({ canteenId, productId, name }, { rejectWithValue }) => {
    try {
      const response = await canteenApi.addMenuItem({ canteenId, productId, name }); // Ensure correct API call
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add menu item");
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  "menu/updateMenuItem",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await canteenApi.updateMenuItem(id, data); // API call
      return response.data.updatedMenuItem;
    } catch (error) {
      console.error("Error updating menu item:", error.response?.data);
      return rejectWithValue(error.response?.data || "Failed to update menu item");
    }
  }
);


// ✅ Delete Menu Item
export const deleteMenuItem = createAsyncThunk(
  "menu/deleteMenuItem",
  async (id, { rejectWithValue }) => {
    try {
      await canteenApi.deleteMenuItem(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete menu item");
    }
  }
);

// ✅ Create Redux Slice
const menuSlice = createSlice({
  name: "menu",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Fetch All Menu Items
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch Menu of Specific Canteen
      .addCase(fetchMenuOfCanteen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuOfCanteen.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenuOfCanteen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Add Menu Item
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.items.push(action.payload.newMenuItem);
      })

      // ✅ Update Menu Item
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        console.log("Updating state with:", action.payload);
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // ✅ Delete Menu Item
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default menuSlice.reducer;
