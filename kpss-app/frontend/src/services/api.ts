import axios from 'axios';
import { getToken, removeToken } from '../storage/auth';

// Tüm API istekleri bu instance üzerinden yapılır
const api = axios.create({
  baseURL: 'http://192.168.88.232:3000',
  timeout: 10000,
});

// Request interceptor: her isteğe AsyncStorage'dan okunan JWT'yi ekler
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  console.log(`API İsteği: ${config.method?.toUpperCase()} ${config.url} - Token mevcut mu: ${!!token}`);
  
  if (token && config.headers) {
    // Axios 1.x için en güvenli yöntemler
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  console.error('API İstek Hatası:', error);
  return Promise.reject(error);
});



// Response interceptor: 401 gelince token'ı sil
// Navigasyon burada yapılamaz (hook dışında), ekranlar kendi 401 yönetimini yapar
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
    }
    return Promise.reject(error);
  },
);

export default api;
