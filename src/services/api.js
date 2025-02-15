import axios from 'axios';

console.log("Loaded ENV Variables:", import.meta.env); // Debugging
const IP = import.meta.env.VITE_IP;
console.log("IP from .env:", IP); // Debugging

const api = axios.create({
  baseURL: `http://${IP}/api/v1`,
  withCredentials: true,
});


api.interceptors.request.use((config) => {
console.log(IP);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized access, redirecting to login...');
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
