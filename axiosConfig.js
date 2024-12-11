// axiosConfig.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const api = axios.create({
  baseURL: 'http://192.168.0.122:8080/api',
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      Alert.alert('Erro de Conexão', 'Verifique sua conexão com a internet.');
    }
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      Alert.alert('Sessão Expirada', 'Sua sessão expirou. Por favor, faça login novamente.', [
        {
          text: 'OK',
          onPress: async () => {
            await SecureStore.deleteItemAsync('token');

            error.navigateToLogin(error.navigationRef);
          },
        },
      ]);
    }
    return Promise.reject(error);
  }
);

export default api;
