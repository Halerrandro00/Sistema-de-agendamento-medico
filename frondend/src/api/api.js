import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Ajuste a URL base do seu backend
});

// Interceptor para adicionar o token de autenticação a cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para tratar erros, como token expirado (401)
api.interceptors.response.use(
  (response) => response, // Se a resposta for bem-sucedida, apenas a retorna
  (error) => {
    // Se o erro for 401 (Não Autorizado), o token pode ser inválido ou expirado
    if (error.response && error.response.status === 401) {
      // Remove o token inválido do localStorage
      localStorage.removeItem('authToken');
      // Redireciona para a página de login para forçar uma nova autenticação.
      // Usar window.location limpa o estado da aplicação.
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
