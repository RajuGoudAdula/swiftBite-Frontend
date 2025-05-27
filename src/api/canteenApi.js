
import axiosInstance from "./axiosInstance";

const canteenApi = {
  // ✅ Canteen Login
  login: async (data) => {
    return axiosInstance.post("/canteen/login", data);
  },

  // ✅ Get Menu
  getMenu: async () => {
    return axiosInstance.get("/canteen/menu");
  },

  // ✅ Add Menu Item
  addMenuItem: async (menu) => {
    console.log(menu);
    return axiosInstance.post(`/canteen/menu/${menu.canteenId}`, {productId : menu.productId,name : menu.name});
  },

  // ✅ Delete Menu Item
  deleteMenuItem: async (id) => {
    return axiosInstance.delete(`/canteen/menu/${id}`);
  },

  //update menu item
  updateMenuItem : async (id,data) => {
    return axiosInstance.put(`/canteen/menu/${id}`,data);
  },

  // ✅ Fetch Orders
  getOrders: async (canteenId) => {
    return axiosInstance.get(`/canteen/${canteenId}/orders`);
  },

  // ✅ Update Order Status
  updateOrderStatus: async (order) => {
    return axiosInstance.put(`/canteen/order/${order.orderId}`, { status : order.status });
  },

  // ✅ Get Canteen Profile
  getCanteenProfile: async () => {
    return axiosInstance.get("/canteen/profile");
  },

  //Reviews 
  submitReviewResponse : async (canteenId,reviewId,response,orderId) => {
    return axiosInstance.post(`/canteen/${canteenId}/add-response`,{reviewId,response,orderId})
  },
  //Canteen dashboard
  todayOrders : async () => {
    return axiosInstance.get('/canteen/orders/today');
  },
  pendingOrders : async () => {
    return axiosInstance.get('/canteen/orders/pending');
  },
  revenue : async () => {
    return axiosInstance.get('/canteen/revenue/today');
  },
  popularItem : async () => {
    return axiosInstance.get('/canteen/menu/popular');
  },
  activity : async () => {
    return axiosInstance.get('/canteen/orders/recent');
  },
  //Canteen Analytics
  fetchSalesData : async (startDate,endDate,canteenId) => {
    return axiosInstance.get(`/canteen/${canteenId}/analytics/sales-data?startDate=${startDate}&endDate=${endDate}`);
  },
  fetchUsersData : async (startDate,endDate,canteenId) => {
    return axiosInstance.get(`/canteen/${canteenId}/analytics/user-data?startDate=${startDate}&endDate=${endDate}`);
  },
  fetchProductsData : async (startDate,endDate,canteenId) => {
    return axiosInstance.get(`/canteen/${canteenId}/analytics/product-data?startDate=${startDate}&endDate=${endDate}`);
  },
  fetchReviewsData : async (canteenId) => {
    return axiosInstance.get(`/canteen/${canteenId}/analytics/reviews-data`);
  },
  toggleCanteenStatus : async (canteenId) => {
    return axiosInstance.put(`/canteen/${canteenId}/update-canteen`);
  },
  getCanteenStatus : async (canteenId) => {
    return axiosInstance.get(`/canteen/${canteenId}/canteen-status`);
  },
  getCanteenFeedbacks : async (canteenId) => {
    return axiosInstance.get(`/canteen/${canteenId}`);
  },
};

export default canteenApi;
