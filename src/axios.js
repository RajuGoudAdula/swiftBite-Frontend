import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://swiftbite-backend-1.onrender.com/api',
  withCredentials: true, // ✅ Always send cookies
});

export default instance;
