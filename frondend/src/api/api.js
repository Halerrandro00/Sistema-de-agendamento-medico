import axios from 'axios';

const api = axios.create({
  // Altere para a URL do seu backend
  baseURL: 'http://localhost:3000', 
});

// Interceptor para adicionar o token JWT em cada requisição autenticada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;