import axios from 'axios';
import { LocalStorageKey } from '@/shared/lib/localstorage';

export const baseURL =
  import.meta.env.VITE_BASE_URL || 'http://localhost:8080/api/';

export const http = axios.create({
  baseURL: baseURL,
  headers: {},
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LocalStorageKey.accessToken);

    if (token) {
      config.headers['Authorization'] = `Basic ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(LocalStorageKey.accessToken);

      const isAdminLoginRequest = error.config.url.includes('login');
      const isUserLoginRequest = error.config.url.includes('users/check');
      const isUserPage = !window.location.href.includes('admin');

      if (!isAdminLoginRequest && !isUserPage) {
        window.location.href = '/admin/login';
      }

      if (!isUserLoginRequest && isUserPage) {
        window.location.href = '/authorize';
      }
    }

    return Promise.reject(error);
  }
);
