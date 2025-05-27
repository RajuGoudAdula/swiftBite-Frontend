import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';


const initialState = {
  cartItems: [],
  totalAmount: 0,
  loading: false,
  error: null,
};

// ✅ Fetch Cart Items
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userApi.fetchCartItems(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

// ✅ Add to Cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await userApi.addToCart(userId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

// ✅ Update Quantity (+ / -)
export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ userId, itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await userApi.updateQuantity(userId, itemId, quantity);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
    }
  }
);

// ✅ Remove Item
export const removeItem = createAsyncThunk(
  'cart/removeItem',
  async ({ userId, itemId }, { rejectWithValue }) => {
    try {
      const response = await userApi.removeItem(userId, itemId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

// ✅ Clear Cart (Local Reducer)
export const clearCart = () => (dispatch) => {
  dispatch(cartSlice.actions.resetCart());
};

// ✅ Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.cart.items;
        state.totalAmount = action.payload.cart.totalAmount;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
