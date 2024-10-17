import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Configuração da URL base da API
const api = axios.create({
    baseURL: 'http://192.168.1.238:8080/api',
});

// Intercepta requisições para incluir o token JWT
api.interceptors.request.use(
    (config) => {
        const token = SecureStore.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Interceptor para tratamento de erros
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            const errorMessage = encodeURIComponent(error.response.data?.message || "Sua sessão expirou");
            window.location.href = `/login?error=${errorMessage}`; // Redireciona com a mensagem
        }
        return Promise.reject(error);
    }
);

export default api;