//Configurar rutas

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.tsx';

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
        
        {/* Route: Define una ruta específica. 
            path="/": Es la raíz o página de inicio.
            element: Indica el componente que se cargará (en este caso, tu página de Login).
        */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Próximamente podrías añadir aquí:
            <Route path="/admin" element={<AdminDashboard />} /> 
        */}

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;