// Primera pagina privada (inteligente por roles)

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const { logout, roleId } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Barra superior de navegación */}
      <nav className="dashboard-nav">
        <h1>Gestor de Reservas</h1>
        <div>
          <span className="role-badge">
            {roleId === 2 ? 'Modo: Administrador' : 'Modo: Usuario'}
          </span>
          <button className="btn-logout" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="dashboard-content">
        <div className={`welcome-section ${roleId === 2 ? 'role-admin' : ''}`}>
          <h2>{roleId === 2 ? 'Panel de Control (ADMIN)' : 'Mi Área Personal'}</h2>
          
          <p>
            {roleId === 2 
              ? 'Has iniciado sesión como administrador. Tienes acceso total a las pistas y reservas.' 
              : 'Has iniciado sesión correctamente. Aquí puedes gestionar tus pistas de forma rápida.'}
          </p>

          {/* SECCIÓN DE CAJAS (Cards) sustituyendo a los botones antiguos */}
          <div className="dashboard-cards-grid">
            {roleId === 2 ? (
              <>
                {/* CAJAS PARA ADMIN */}
                <div className="dash-card" onClick={() => navigate('/admin/users')}>
                  <div className="card-icon">👥</div>
                  <div className="card-info">
                    <h3>Gestionar Usuarios</h3>
                    <p>Administra cuentas y permisos del sistema.</p>
                  </div>
                  <div className="card-arrow">→</div>
                </div>
                
                <div className="dash-card" onClick={() => navigate('/courts')}>
                  <div className="card-icon">⚙️</div>
                  <div className="card-info">
                    <h3>Configurar Pistas</h3>
                    <p>Añade o edita las pistas disponibles.</p>
                  </div>
                  <div className="card-arrow">→</div>
                </div>
              </>
            ) : (
              <>
                {/* CAJAS PARA USUARIO */}
                <div className="dash-card" onClick={() => navigate('/reservar')}>
                  <div className="card-icon">🎾</div>
                  <div className="card-info">
                    <h3>Nueva Reserva</h3>
                    <p>Reserva tu pista de Tenis o Pádel ahora.</p>
                  </div>
                  <div className="card-arrow">→</div>
                </div>

                <div className="dash-card" onClick={() => navigate('/mis-reservas')}>
                  <div className="card-icon">📅</div>
                  <div className="card-info">
                    <h3>Mis Reservas</h3>
                    <p>Consulta y gestiona tus próximos partidos.</p>
                  </div>
                  <div className="card-arrow">→</div>
                </div>
              </>
            )}
          </div>

          <p className="text-secondary">Selecciona una opción para comenzar.</p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;