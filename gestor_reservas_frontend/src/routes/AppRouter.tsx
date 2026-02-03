//Configurar rutas

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import CourtsPage from '../pages/user/CourtsPage'; // Importamos la nueva página
import AdminCourtsPage from '../pages/admin/AdminCourtsPage'; // <--- Nuevo Import
import UserManagementPage from '../pages/admin/UserManagementPage'; // <--- 1. NUEVO IMPORT AQUÍ
import { useAuth } from '../auth/AuthContext';

const AppRouter = () => {
  const { user, roleId } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        {/* Permitir registro si no hay nadie logueado O si el que está logueado es Admin */}
        <Route 
          path="/register" 
          element={!user || roleId === 2 ? <RegisterPage /> : <Navigate to="/dashboard" 
        />} 
/>

        {/* Rutas Protegidas */}
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
        
        {/* Lógica inteligente para /courts */}
        <Route 
          path="/courts" 
          element={
            user ? (
              roleId === 2 ? <AdminCourtsPage /> : <CourtsPage />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        {/* 2. NUEVA RUTA DE GESTIÓN DE USUARIOS */}
        <Route 
          path="/admin/users" 
          element={
            user && roleId === 2 ? <UserManagementPage /> : <Navigate to="/dashboard" />
          } 
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;