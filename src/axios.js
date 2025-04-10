import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  withCredentials: true, // ✅ Always send cookies
});

export default instance;
