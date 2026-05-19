import axios from 'axios';
// import.meta.env.REACT_API_SERVER_URL;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER_URL || "http://localhost:5000/api",
  // baseURL: "http://localhost:5000/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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
