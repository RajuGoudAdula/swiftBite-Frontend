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

};

export default adminApi;
