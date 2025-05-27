import axiosInstance from './axiosInstance';

const adminApi = {
  

  // ✅ Get All Users
  getAllUsers: async () => {
    return axiosInstance.get('/admin/users');
  },

  // ✅ Delete User
  deleteUser: async (userId) => {
    return axiosInstance.delete(`/admin/users/${userId}`);
  },

  // ✅ Get All Orders
  getAllOrders: async () => {
    return axiosInstance.get('/admin/orders');
  },

  // ==============================
  // ✅ College Management (Admin)
  // ==============================

  // ✅ Fetch All Colleges
  fetchColleges: async () => {
    return axiosInstance.get('/admin/colleges');
  },

  // ✅ Add New College
  addCollege: async (collegeData) => {
    return axiosInstance.post('/admin/colleges', collegeData);
  },

  // ✅ Update College
  updateCollege: async (collegeData) => {
    return axiosInstance.put(`/admin/colleges/${collegeData._id}`, collegeData);
  },

  // ✅ Delete College
  deleteCollege: async (collegeId) => {
    return axiosInstance.delete(`/admin/colleges/${collegeId}`);
  },

  // ==============================
  // ✅ Canteen Management (Admin)
  // ==============================

  // ✅ Fetch Canteens of a College
  fetchCanteens: async (collegeId) => {
    return axiosInstance.get(`/admin/colleges/${collegeId}/canteens`);
  },

  // ✅ Add New Canteen
  addCanteen: async (collegeId, canteenData) => {
    return axiosInstance.post(`/admin/colleges/${collegeId}/canteens`, canteenData);
  },

  // ✅ Update Canteen
  updateCanteen: async (collegeId, canteenId, canteenData) => {
    return axiosInstance.put(`/admin/colleges/${collegeId}/canteens/${canteenId}`, canteenData);
  },

  // ✅ Delete Canteen
  deleteCanteen: async (collegeId, canteenId) => {
    return axiosInstance.delete(`/admin/colleges/${collegeId}/canteens/${canteenId}`);
  },

//Products management

fetchProducts : async () => {
  return axiosInstance.get('/admin/products');
},

addProduct : async (productData) =>{
  return axiosInstance.post('/admin/products/new-product',productData);
},

updateProduct : async (productId , productData) => {
  return axiosInstance.put(`/admin/products/${productId}`,productData);
},

deleteProduct : async (productId) => {
  return axiosInstance.delete(`/admin/products/${productId}`);
},

getAllBanners : async () => {
  return axiosInstance.get(`/admin/banners`);
},
updateBanner : async (bannerId,banner) => {
  return axiosInstance.put(`/admin/update-banner/${bannerId}`,banner);
},
postBanner : async (banner) => {
  return axiosInstance.post(`/admin/post-banner`,banner);
},
fetchCanteensForBanner : async () => {
  return axiosInstance.get(`/admin/fetchCanteens`);
},
deleteBanner : async (bannerId) => {
  return axiosInstance.delete(`/admin/delete-banner/${bannerId}`);
},
getAdminStats : async () => {
  return axiosInstance.get(`/admin/get-stats`);
},
getRecentActivity : async () => {
  return axiosInstance.get(`/admin/get-activity`);
},
getTodaysOrders : async () => {
  return axiosInstance.get(`/admin/get-todays-orders`);
},
getUsersForAdmin : async () => {
  return axiosInstance.get(`/admin/get-all-users`);
},
deleteUserByAdmin : async (userId) => {
  return axiosInstance.delete(`/admin/delete/user/${userId}`);
},
getAllFeedbacks : async () => {
  return axiosInstance.get(`/admin/get-feedbacks`);
},
sendFeedbackResponse : async (feedbackId, type, message) => {
  return axiosInstance.put(`/admin/send-feedback/${feedbackId}`,{type,message});
},

};

export default adminApi;
