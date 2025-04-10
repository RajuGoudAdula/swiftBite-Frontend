import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";
import { act } from "react";

// Fetch user profile data
export const fetchProfile = createAsyncThunk("profile/fetchProfile", async (userId, { rejectWithValue }) => {
  try {
    const response = await userApi.fetchProfile(userId);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Update username, college, or canteen
export const updateProfileField = createAsyncThunk(
  "profile/updateProfileField",
  async ({ field, value ,userId}, { rejectWithValue }) => {
    try {
      const response = await  userApi.updateProfileField(field, value , userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const sendEmailOtp = createAsyncThunk(
    "profile/sendEmailOtp",
    async ({ email ,userId }, { rejectWithValue }) => {
      try {
        const response = await  userApi.sendEmailOtp({email,userId});
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const verifyEmailOtp = createAsyncThunk(
    "profile/verifyEmailOtp",
    async ({ email ,otp}, { rejectWithValue }) => {
      try {
        const response = await  userApi.verifyEmailOtp(email,otp);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );


  export const verifyPassword = createAsyncThunk(
    "profile/verifyPassword",
    async ({ userId ,password}, { rejectWithValue }) => {
      try {
        const response = await  userApi.verifyPassword(userId,password);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const updatePassword = createAsyncThunk(
    "profile/updatePassword",
    async ({ userId ,newPassword , oldPassword}, { rejectWithValue }) => {
      try {
        const response = await  userApi.updatePassword(userId,newPassword,oldPassword);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );



const profileSlice = createSlice({
  name: "profile",
  initialState: {
    userProfile: null,
    loading: false,
    error: null,
    emailOtpSent: false,
    phoneOtpSent: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfileField.fulfilled, (state, action) => {
        if (state.userProfile) {
          state.userProfile[action.payload.field] = action.payload.value;
        }
      })
      .addCase(sendEmailOtp.fulfilled, (state) => {
        state.emailOtpSent = !state.emailOtpSent;
      })
      
  },
});

export default profileSlice.reducer;
