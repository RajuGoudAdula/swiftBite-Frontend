
import axiosInstance from './axiosInstance';

const userApi = {
  // ✅ User Login
  login: async (data) => {
    return axiosInstance.post('/auth/login', data);
  },

  // ✅ User Google Login
  googleLogin: async (data) => {
    return axiosInstance.post('/auth/google-login', data);
  },

  // ✅ User Register
  register: async (data) => {
    return axiosInstance.post('/auth/register', data);
  },

  // ✅ Send OTP
  sendOtp: async (data) => {
    console.log(data);
    return axiosInstance.post('/auth/send-otp', data);
  },

  // ✅ Verify OTP
  verifyOtp: async (data) => {
    return axiosInstance.post('/auth/verify-otp', data);
  },

  // ✅ Fetch User Profile
  getProfile: async () => {
    return axiosInstance.get('/user/profile');
  },

  // ✅ Update Profile
  updateProfile: async (data) => {
    return axiosInstance.put('/user/profile', data);
  },

  updateCollegeCanteen: async (userId, data) => {
    return axiosInstance.put(`/user/update-college-canteen/${userId}`, data);
  },

  // ✅ Fetch Colleges (For Users)
  fetchColleges: async () => {
    return axiosInstance.get('/user/colleges'); 
  },

  // ✅ Fetch Canteens of a Specific College
  fetchCanteens: async (collegeId) => {
    return axiosInstance.get(`/user/colleges/${collegeId}/canteens`);
  },

  getMenuByCanteen: async (canteenId) => {
    return await axiosInstance.get(`/user/${canteenId}/menu`);
  },

  //Orders
  placeOrder: async (data) => {
    return axiosInstance.post('/user/order', data);
  },

  fetchOrders : async (userId , canteenId) => {
    return axiosInstance.get(`/user/orders/${userId}/${canteenId}`);
  },

  cancelOrder : async (orderId ) => {
    return axiosInstance.put(`/user/cancel-order/${orderId}`);
  },
 
  //Cart
  fetchCartItems: async (userId) => {
    return axiosInstance.get(`/user/cart/fetch-cart/${userId}`);
  },

  addToCart: async (userId, data) => {
    return axiosInstance.post(`/user/cart/add-to-cart/${userId}`, data);
  },

  updateQuantity: async (userId, itemId, delta) => {
    return axiosInstance.put(`/user/cart/update-quantity/${userId}`, { itemId, delta });
  },

  removeItem: async (userId, itemId) => {
    return axiosInstance.delete(`/user/cart/remove-item/${userId}/${itemId}`);
  },

  //Payment
  getSessionId: async ( payment) => {
    const paymentMethod="upi";
    return axiosInstance.post(`/user/payment/get-session-id/${payment.userId}`,{totalAmount:payment.totalAmount,cartItems: payment.cartItems,canteenId:payment.canteenId,paymentMethod,collegeId:payment.collegeId});
  },

  getPaymentStatus : async (orderId) => {
    return axiosInstance.get(`/user/payment/status/${orderId}`);
  },

  checkStock : async (userId) => {
    return axiosInstance.get(`/user/cart/check-stock/${userId}`);
  },


  //Profile
  updateProfileField : async (field , value,userId) => {
    if(field==="name"){
      return axiosInstance.put(`/user/profile/${userId}`,{name : value});
    }else{

    }
  },
  fetchProfile : (userId) => {
    return axiosInstance.get(`/user/profile/${userId.userId}`);
  },
  sendEmailOtp : ({email,userId}) => {
    return axiosInstance.post(`/user/profile/send-email-otp/${userId}`,{email});
  },
  verifyEmailOtp : (email,otp) => {
    return axiosInstance.post('/user/profile/verify-email-otp',{email,otp});
  },
  verifyPassword : (userId , password) => {
    return axiosInstance.post(`/user/profile/verify-password/${userId}`, {password});
  },
  updatePassword : (userId,newPassword,oldPassword) => {
    return axiosInstance.put(`/user/profile/update-password/${userId}`,{newPassword,oldPassword});
  },

  //Reviews

  addReview : ( productId,orderId,canteenId,review,rating,userId,collegeId,isAnonymous) => {
    return axiosInstance.post(`/user/add-review/${productId}`,{orderId,canteenId,review,rating,userId,collegeId,isAnonymous});
  },
  updateReview : (productId, canteenId, rating, review, userId,collegeId,orderId,isAnonymous) => {
    return axiosInstance.put(`/user/update-review/${productId}/${orderId}`,{rating,review,userId,collegeId,canteenId,isAnonymous});
  },
  deleteReview : ( productId, orderId ,userId ) => {
    return axiosInstance.delete(`/user/delete-review/${productId}/${orderId}?userId=${userId}`);
  },
  fetchReviewOfUser : ( userId ,orderId) => {
    return axiosInstance.get(`/user/fetch-user-review/${orderId}/${userId}`);
  },

  getItemDetails : (itemId) => {
    return axiosInstance.get(`/user/get-item-details/${itemId}`);
  },

  likeReview : (itemId,reviewId,userId) => {
    return axiosInstance.post(`/user/like-review/${itemId}/${reviewId}`,{userId});
  },
  disLikeReview : (itemId,reviewId,userId) => {
    return axiosInstance.post(`/user/disLike-review/${itemId}/${reviewId}`,{userId});
  },
  //Searching
  fetchPopularItems : () => {
    return axiosInstance.get('/user/menu/popular');
  },
  debouncedSearch : (query) => {
    return axiosInstance.get(`/user/menu/search?q=${query}`);
  },
  //Favourite items
  addFavouriteItem : (userId, canteenId, itemId) => {
    return axiosInstance.post(`/user/add-favourite-item/${userId}/${canteenId}`,{itemId});
  },
  deleteFavouriteItem : (userId,canteenId,itemId) => {
    return axiosInstance.delete(`/user/remove-favourite-item/${userId}/${canteenId}/${itemId}`);
  },
  getFavouriteItems : (userId,canteenId) => {
    return axiosInstance.get(`/user/fetch-favourite-items/${userId}?canteenId=${canteenId}`);
  },
  fetchCanteenStatus : (canteenId) => {
    return axiosInstance.get(`/user/fetch-canteen-status/${canteenId}`);
  },
  sendContactMessage : (data) => {
    const {userId , userName , userRole , subject ,message,userEmail} = data;
    return axiosInstance.post(`/user/${userId}/contact-message`,{userName,userRole,subject,message,userEmail});
  },
  getHeroBanners : (userId,canteenId) => {
    return axiosInstance.get(`/user/get-herobanners/${userId}/${canteenId}`);
  },
  sendCanteenFeedback : (userId,canteenId,formData) => {
    return axiosInstance.post(`/user/${userId}/feedback/${canteenId}`,formData);
  },
  userSubscribe : (userId , subscription) => {
    return axiosInstance.post(`/push/subscribe`,{userId , subscription});
  },


 
};



export default userApi;
