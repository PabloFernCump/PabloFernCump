//Gestion de sesion, es el "cerebro" que decide si el usuario está logueado o no en toda la aplicación

import React, { createContext, useContext, useState, useEffect } from 'react';
//import api from '../api/axios';

/**
 * Definimos la estructura de los datos de autenticación.
 * Ahora se incluye 'roleId' para saber qué permisos tiene el usuario.
 */
interface AuthContextType {
  token: string | null;
  roleId: number | null; // <--- Nuevo: Guardamos el ID del rol
  user: any; // <--- Añado esta línea para que el Router no dé error
  isAuthenticated: boolean;
  login: (token: string, roleId: number) => void; //<--- Ahora recibe dos datos
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * El AuthProvider gestiona el estado de la sesión.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializamos el estado con lo que haya en localStorage (si existe)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // Convertimos el roleId a número al leerlo, ya que localStorage solo guarda texto
  const [roleId, setRoleId] = useState<number | null>(
    localStorage.getItem('roleId') ? Number(localStorage.getItem('roleId')) : null
  );

  /**
   * Este es el useEffect. 
   * Sirve para que, al refrescar la página, el estado de React se sincronice 
   * con el token guardado en el navegador.
   */
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('roleId'); //<------ Ahora tambien el estado de Reacvt se sincroniza con el rol guardado en el navegador
    
    if (savedToken) setToken(savedToken);
    if (savedRole) setRoleId(Number(savedRole));
    }, []); // El array vacío [] indica que solo se ejecuta una vez al cargar la app.

  /**
   * Función para iniciar sesión.
   * Ahora recibe el TOKEN y el ROLE_ID que envía el backend.
   */
  const login = (newToken: string, newRoleId: number) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('roleId', newRoleId.toString());
    
    setToken(newToken);
    setRoleId(newRoleId);
  };

  /**
   * Función para cerrar sesión.
   * Limpiamos todo rastro de la sesión en el navegador y en React.
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roleId');
    
    setToken(null);
    setRoleId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        roleId,
        user: token, // <---  Así 'user' tendrá el valor del token y el Router estará contento
        isAuthenticated: !!token,
        login,
        logout
      }}
    >
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