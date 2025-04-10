import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import menuReducer from './slices/menuSlice';
import orderReducer from './slices/orderSlice';
import collegeReducer from './slices/collegeSlice';
import productReducer from './slices/productSlice';
import canteenReducer from './slices/canteenSlice';
import profileReducer from './slices/profileSlice';
import reviewReducer from './slices/reviewSlice';
import toastReducer from './slices/toastSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    menu: menuReducer,
    order: orderReducer,
    college: collegeReducer,
    products : productReducer,
    canteen : canteenReducer,
    profile : profileReducer,
    reviews : reviewReducer,
    toast: toastReducer,
  },
});


