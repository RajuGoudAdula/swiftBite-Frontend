import axios from 'axios';

// ✅ Base URL for your server
const BASE_URL = 'http://127.0.0.1:5000/api';

// ✅ Automatically Get Token From Local Storage
const getToken = () => localStorage.getItem('token');

// ✅ Create Axios Instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// ✅ Automatically Attach Token To Every Request
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ✅ Handle Global Errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // ✅ If Token Expired, Redirect To Login Page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
