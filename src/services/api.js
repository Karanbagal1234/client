import axios from 'axios';

console.log("Loaded ENV Variables:", import.meta.env); // Debugging
const IP = import.meta.env.VITE_IP;
console.log("IP from .env:", IP); // Debugging

const api = axios.create({
  baseURL:`https://server-j4zu.onrender.com/api/v1`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  console.log("Sending request to:", config.url);

  const userId = localStorage.getItem('userId');
  const retailerId = localStorage.getItem('retailerId');

  if (userId) config.headers['userId'] = userId;
  if (retailerId) config.headers['retailerId'] = retailerId;

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

