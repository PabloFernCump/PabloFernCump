//Configuracion de conecion. Este archivo lo utiliza el frontend para hablar con el backend

import axios from 'axios';

/**
 * Creamos una instancia personalizada de Axios.
 * Esto evita tener que escribir "http://localhost:3000/api" en cada petición.
 */
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // URL base de tu servidor Backend
});

/**
 * Interceptor de peticiones:
 * Antes de que cualquier petición salga hacia el servidor, este código 
 * revisa si tienes un token guardado y lo añade a las cabeceras (headers).
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Recupera el token del almacén del navegador
  if (token) {
    // Si hay token, lo envía como Bearer Token para que el servidor te reconozca
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
});

export default api;