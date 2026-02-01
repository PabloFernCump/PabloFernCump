//Configurar rutas

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.tsx';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute';

/**
 * AppRouter es el centro de control de navegación de tu aplicación.
 * Define qué componente se debe mostrar según la URL en la que esté el usuario.
 */
const AppRouter = () => {
  return (
    /**
     * BrowserRouter: Proporciona el historial de navegación del navegador 
     * a todos los componentes que estén dentro de él.
     */
    <BrowserRouter>
      {/* Routes: Actúa como un contenedor que busca la mejor coincidencia entre las rutas definidas */}
      <Routes>
        
        {/* Route: Define una ruta publica. Cualquiera puede ver el login
            path="/": Es la raíz o página de inicio.
            element: Indica el componente que se cargará (en este caso, tu página de Login).
        */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Ruta protegida: Solo accesible si hay token */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;