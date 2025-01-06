// src/api/api.ts
import axios from 'axios';
import { getAuth, signOut } from 'firebase/auth';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 请求拦截器
api.interceptors.request.use(
  async (config) => {
    console.log('Request interceptor called');
    const auth = getAuth();
    const currentUser = auth.currentUser;

    console.log('Current user:', currentUser);

    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        if (token) {
          config.headers = config.headers || {}; // 确保 headers 存在
          config.headers['Authorization'] = `Bearer ${token}`;
          console.log('Authorization header set');
        }
      } catch (error) {
        console.error('Error getting ID token:', error);
      }
    } else {
      console.warn('No current user in request interceptor');
    }

    return config;
  },
  (error) => {
    console.log('Request error: ', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log('Response interceptor error:', error);
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        try {
          const token = await currentUser.getIdToken(true);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          console.log('Retrying request with new token');
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed: ', refreshError);
          // 注销用户并重定向到登录页面
          await signOut(auth);
          // 根据您的路由方案，进行重定向或其他处理
        }
      } else {
        console.warn('No current user in response interceptor');
        // 可以选择重定向到登录页面或提示用户登录
      }
    }
    return Promise.reject(error);
  }
);

export default api;
