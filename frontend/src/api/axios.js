import axios from 'axios';

// Create an Axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically add the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    console.log("API URL:", response.config.baseURL + response.config.url);
    console.log("Response:", response.data);
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if token is expired/invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirecting will be handled by the protected route or we could forcefully reload:
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
