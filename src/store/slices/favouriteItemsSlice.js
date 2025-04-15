import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';


export const fetchFavouriteItems = createAsyncThunk(
  'favouriteItems/fetch',
  async ({ userId, canteenId }) => {
    const res = await userApi.getFavouriteItems(userId,canteenId);
    return res.data.data[0]?.favouriteItems || [];
  }
);

export const addFavouriteItem = createAsyncThunk(
  'favouriteItems/add',
  async ({ userId, canteenId, itemId }) => {
    await userApi.addFavouriteItem(userId,canteenId,itemId);
    return itemId;
  }
);


export const removeFavouriteItem = createAsyncThunk(
  'favouriteItems/remove',
  async ({ userId, canteenId, itemId }) => {
   const res = await userApi.deleteFavouriteItem(userId,canteenId,itemId);
    return itemId;
  }
);

const favouriteItemsSlice = createSlice({
  name: 'favouriteItems',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavouriteItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFavouriteItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFavouriteItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addFavouriteItem.fulfilled, (state, action) => {
        state.items.push({ itemId: action.payload });
      })
      .addCase(removeFavouriteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.itemId !== action.payload
        );
      });
  },
});

export default favouriteItemsSlice.reducer;
