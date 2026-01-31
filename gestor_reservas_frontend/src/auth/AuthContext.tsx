//Gestion de sesion, es el "cerebro" que decide si el usuario está logueado o no en toda la aplicación

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

/**
 * Definimos la estructura de los datos de autenticación.
 */
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * El AuthProvider gestiona el estado de la sesión.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializamos el estado con lo que haya en localStorage (si existe)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  /**
   * Este es el useEffect que mencionabas. 
   * Sirve para que, al refrescar la página, el estado de React se sincronice 
   * con el token guardado en el navegador.
   */
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []); // El array vacío [] indica que solo se ejecuta una vez al cargar la app.

  // Función para iniciar sesión
  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para usar la autenticación en cualquier parte de la app.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};