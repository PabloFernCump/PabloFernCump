//Punto de entrada. Aqui se enciende la maquinaria de la aplicacion

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthContext.tsx' // Importamos el gestor de sesión

/**
 * Renderizamos la aplicación envolviéndola en el AuthProvider.
 * Esto garantiza que desde el primer segundo, App sepa si hay un usuario.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider> 
      <App />
    </AuthProvider>
  </StrictMode>,
)