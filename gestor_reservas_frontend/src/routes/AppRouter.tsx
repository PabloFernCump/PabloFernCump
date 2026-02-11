//Configurar rutas

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import CourtsPage from '../pages/user/CourtsPage'; // Importamos la nueva página
import AdminCourtsPage from '../pages/admin/AdminCourtsPage'; // <--- Nuevo Import
import UserManagementPage from '../pages/admin/UserManagementPage'; // <--- 1. NUEVO IMPORT AQUÍ
import EditCourtPage from '../pages/admin/EditCourtPage'; // <--- NUEVO IMPORT PARA EDICIÓN
import AddCourtPage from '../pages/admin/AddCourtPage'; // <--- NUEVO IMPORT PARA CREACIÓN DE PISTAS
import BookingPage from '../pages/user/BookingPage'; // <--- MI COMENTARIO: Importamos el nuevo flujo de reserva por pasos
import MyReservations from '../pages/user/MyReservations'; // <--- NUEVO IMPORT: Página de historial de reservas
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

        {/* MI COMENTARIO: NUEVA RUTA PARA EL FLUJO DE RESERVA POR PASOS */}
        {/* Esta es la ruta que tienes que visitar para ver el Deporte -> Fecha -> Hora */}
        <Route 
          path="/reservar" 
          element={user ? <BookingPage /> : <Navigate to="/login" />} 
        />

        {/* NUEVA RUTA: HISTORIAL DE RESERVAS DEL USUARIO */}
        {/* Permite al usuario ver sus reservas activas/pasadas y cancelarlas */}
        <Route 
          path="/mis-reservas" 
          element={user ? <MyReservations /> : <Navigate to="/login" />} 
        />

        {/* 2. NUEVA RUTA DE GESTIÓN DE USUARIOS */}
        <Route 
          path="/admin/users" 
          element={
            user && roleId === 2 ? <UserManagementPage /> : <Navigate to="/dashboard" />
          } 
        />

        {/* 3. NUEVA RUTA DE EDICIÓN DE PISTAS (SOLO ADMIN) */}
        {/* El parámetro :id permite recibir el identificador de la pista en la URL */}
        <Route 
          path="/admin/edit-court/:id" 
          element={
            user && roleId === 2 ? <EditCourtPage /> : <Navigate to="/dashboard" />
          } 
        />

        {/* 4. NUEVA RUTA PARA AÑADIR PISTAS (SOLO ADMIN) */}
        {/* Permite al administrador acceder al formulario de creación de nuevas instalaciones */}
        <Route 
          path="/admin/add-court" 
          element={
            user && roleId === 2 ? <AddCourtPage /> : <Navigate to="/dashboard" />
          } 
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;