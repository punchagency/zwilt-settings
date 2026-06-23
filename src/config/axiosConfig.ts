import axios from 'axios';
import { apiUrl } from './apiUrl';

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

// Add request interceptor to include Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const session =
      typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('zw_us') || '{}')
        : {};
    const token = session.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
