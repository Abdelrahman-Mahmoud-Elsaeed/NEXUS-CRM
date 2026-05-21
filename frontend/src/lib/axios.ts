/* eslint-disable @typescript-eslint/no-explicit-any */
import { logout, setUnverified, tokenRefreshed } from '@/modules/auth/store/authSlice';
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/v1/api',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const activeOrgId = localStorage.getItem("current_organization_id");

    if (activeOrgId && config.headers) {
      config.headers['x-organization-id'] = activeOrgId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    const newToken = response.headers["x-new-access-token"];
    if (newToken && store) {
      localStorage.setItem("access_token", newToken);
      store.dispatch(tokenRefreshed(newToken));
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      const data = error.response.data;
      console.log("API Error Intercepted:", data);

      if (data.success === false && data.reason && store) {
        switch (data.reason) {
          case "SESSION_EXPIRED_OR_REVOKED":
          case "ACCOUNT_HAS_BEEN_DELETED":
          case "ACCOUNT_IS_INACTIVE_OR_SUSPENDED":
          case "INVALID_TOKEN":
          case "UNAUTHORIZED":
            store.dispatch(logout());
            break;
          
          case "USER_NOT_VERIFIED":
            store.dispatch(setUnverified());
            break;

          case "OTP_EXPIRED":
          case "INVALID_OTP":
            break;
            
          default:
            break;
        }
      }
    }

    if (error.response?.status === 401 && store) {
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);