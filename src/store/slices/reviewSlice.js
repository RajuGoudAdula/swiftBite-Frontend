import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";

// Fetch reviews for a specific item
export const fetchReviewOfUser = createAsyncThunk(
  "reviews/fetchReviewOfUser",
  async ({  userId , orderId }, { rejectWithValue }) => {
    try {
      const response = await userApi.fetchReviewOfUser( userId , orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch reviews");
    }
  }
);

// Add a new review
export const addReview = createAsyncThunk(
  "reviews/addReview",
  async ({ productId,orderId,canteenId,review,rating,userId,collegeId }, { rejectWithValue }) => {
    try {
      const response = await userApi.addReview(productId,orderId,canteenId,review,rating,userId,collegeId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add review");
    }
  }
);

// Update a review
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ productId, canteenId,collegeId , rating, review, userId ,orderId}, { rejectWithValue }) => {
    try {
      const response = await userApi.updateReview(productId, canteenId, rating, review, userId,collegeId,orderId);
      return response.data.review;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update review");
    }
  }
);

// Delete a review
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async ({ productId, orderId, userId }, { rejectWithValue }) => {
    try {
      const response = await userApi.deleteReview(productId, orderId, userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete review");
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviewOfUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewOfUser.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewOfUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add review
      .addCase(addReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update review
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
    
        const updatedReviewId = Object.keys(action.payload.updatedReview)[0]; 
        const updatedReviewData = action.payload.updatedReview[updatedReviewId]; 
    
        if (state.reviews.reviews[updatedReviewId]) {
            state.reviews.reviews[updatedReviewId] = updatedReviewData;
        } else {
            state.reviews.reviews[updatedReviewId] = updatedReviewData;
        }
    })
    
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
    
        const { orderId, productId } = action.payload; // Extract orderId and productId
    
        if (state.reviews.orderId === orderId && state.reviews.reviews.hasOwnProperty(productId)) {
            delete state.reviews.reviews[productId]; // Remove the review for the specific product
        }
    })    
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
