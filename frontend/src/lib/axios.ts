import axios from 'axios';


export const api = axios.create({
  baseURL: 'http://localhost:3000/v1/api',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response, // 2xx codes land here
  (error) => {
    // 4xx and 5xx codes land here
    if (error.response) {
      // The server responded with a status code outside 2xx
      console.log("Server Error Data:", error.response.data); 
      console.log("Server Status:", error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.log("No response received from server");
    }
    return Promise.reject(error);
  }
);