//Primera pagina privada (inteligente por roles)

import { useAuth } from '../auth/AuthContext';
import '../styles/dashboard.css'; // <--- Aqui se importan los nuevos estilos

const DashboardPage = () => {
  // Extraemos logout y roleId (1=User, 2=Admin) del contexto
  const { logout, roleId } = useAuth();

  return (
    <div className="dashboard-container">
      {/* Barra superior de navegación */}
      <nav className="dashboard-nav">
        <h1>Gestor de Reservas</h1>
        <div>
          {/* Mostramos el rol usando la nueva clase CSS */}
          <span className="role-badge">
            {roleId === 2 ? 'Modo: Administrador' : 'Modo: Usuario'}
          </span>
          <button className="btn-logout" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido principal que cambia según el rol */}
      <main className="dashboard-content">
        <div className={`welcome-card ${roleId === 2 ? 'role-admin' : ''}`}>
          <h2>{roleId === 2 ? 'Panel de Control (ADMIN)' : 'Mi Área Personal'}</h2>
          
          <p>
            {roleId === 2 
              ? 'Has iniciado sesión como administrador. Tienes acceso total a las pistas y reservas.' 
              : 'Has iniciado sesión correctamente. Aquí puedes ver tus citas de Padel y Tenis.'}
          </p>

          <hr />

          {/* Renderizado condicional de herramientas según role_id */}
          <div className="action-buttons">
            {roleId === 2 ? (
              <>
                <button className="btn-primary">Gestionar Usuarios</button>
                <button className="btn-primary">Configurar Pistas</button>
              </>
            ) : (
              <button className="btn-primary">Nueva Reserva</button>
            )}
          </div>

          <p className="text-secondary">Próximamente: Listado de reservas en tiempo real.</p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
