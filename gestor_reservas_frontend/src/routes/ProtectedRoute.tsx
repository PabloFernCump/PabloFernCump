//Rutas protegidas (puerta)

import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode; // React.ReactNode es más compatible
}

/**
 * Componente de orden superior para proteger rutas privadas.
 * children: representa la página que queremos ver (ej. Dashboard).
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth(); // Consultamos al "cerebro" si hay sesión activa

  if (!isAuthenticated) {
    /**
     * Si no está logueado, lo redirigimos a "/" (Login).
     * 'replace' evita que el usuario pueda volver atrás con el botón del navegador.
     */
    return <Navigate to="/" replace />;
  }

  // Si está logueado, renderizamos la página solicitada
  return children;
};

export default ProtectedRoute;