import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../../api/adminApi";

// Fetch all products
export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await adminApi.fetchProducts();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Add a new product
export const addProduct = createAsyncThunk("products/addProduct", async (productData, { rejectWithValue }) => {
  try {
    const response = await adminApi.addProduct(productData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Update a product
export const updateProduct = createAsyncThunk("products/updateProduct", async ({ productId, productData }, { rejectWithValue }) => {
  try {
    const response = await adminApi.updateProduct(productId, productData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Delete a product
export const deleteProduct = createAsyncThunk("products/deleteProduct", async (productId, { rejectWithValue }) => {
  try {
    await adminApi.deleteProduct(productId);
    return productId; // Return productId to remove from state
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export default productSlice.reducer;