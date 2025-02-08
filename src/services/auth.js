// authService.js
import api from './api';

export const authService = {
  register: async (data, isRetailer) => {
    const endpoint = isRetailer ? '/auth/retailer/register' : '/auth/user/register';    
    return api.post(endpoint, data);
  },

  login: async (credentials, isRetailer) => {
    const endpoint = isRetailer ? '/auth/retailer/login' : '/auth/user/login';
    return api.post(endpoint, credentials);
  },

  getProfile: async (isRetailer) => {
    const endpoint = isRetailer ? '/auth/retailer/profile' : '/auth/user/profile';
    return api.get(endpoint);
  },

  logout: async (isRetailer) => {
    const endpoint = isRetailer ? '/auth/retailer/logout' : '/auth/user/logout';
    return api.post(endpoint);
  }
};