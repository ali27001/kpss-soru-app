import axios from 'axios';
import { getToken, removeToken } from '../storage/auth';

// Tüm API istekleri bu instance üzerinden yapılır
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

// Request interceptor: her isteğe AsyncStorage'dan okunan JWT'yi ekler
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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
