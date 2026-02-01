//Configurar rutas

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import CourtsPage from '../pages/user/CourtsPage'; // Importamos la nueva página
import { useAuth } from '../auth/AuthContext';

const AppRouter = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />

        {/* Rutas Protegidas */}
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
        
        {/* NUEVA RUTA: Listado de pistas para usuarios */}
        <Route path="/courts" element={user ? <CourtsPage /> : <Navigate to="/login" />} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;