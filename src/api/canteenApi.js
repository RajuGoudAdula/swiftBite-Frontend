import axios from "axios";
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
  getReviews : async (canteenId) => {
    return axiosInstance.get(`/canteen/reviews/${canteenId}`)
  },
  replayReview : async (reviewId,replayText) => {
    return axiosInstance.post(`/canteen/add-replay/${reviewId}`,{replayText});
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
  fetchStats : async () => {
    return axiosInstance.get('/canteen/analytics/stats');
  },
  fetchChartData : async (range) => {
    return axiosInstance.get(`/canteen/analytics/chart/${range}`);
  },
  fetchPieData : async () => {
    return axiosInstance.get('/canteen/analytics/pie');
  },
};

export default canteenApi;
