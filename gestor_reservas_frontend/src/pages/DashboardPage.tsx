// Primera pagina privada (inteligente por roles)

import { useState, useEffect } from 'react'; // <--- MODIFICADO: Añadido useEffect
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const { logout, roleId } = useAuth();
  const navigate = useNavigate();

  // --- NUEVOS ESTADOS PARA EL MANTENIMIENTO DE RESERVAS ---
  const [bulkDate, setBulkDate] = useState('');
  const [bulkCourt, setBulkCourt] = useState<number | string>('');
  const [bulkUser, setBulkUser] = useState<number | string>('');

  // --- NUEVOS ESTADOS PARA GESTIÓN DINÁMICA ---
  const [courts, setCourts] = useState<any[]>([]); // <--- AÑADIDO: Lista de pistas para el select
  const [foundReservations, setFoundReservations] = useState<any[]>([]); // <--- AÑADIDO: Reservas encontradas

  // --- NUEVO ESTADO PARA LA SELECCION DE RESERVAS A ELIMINAR ---
  const [selectedResIds, setSelectedResIds] = useState<number[]>([]);

  // --- 1. CARGAR LISTADO DE PISTAS AL INICIAR ---
  useEffect(() => {
    if (roleId === 2) {
      const fetchCourts = async () => {
        try {
          const res = await fetch('http://localhost:3000/api/courts');
          const data = await res.json();
          setCourts(data);
        } catch (err) {
          console.error("Error cargando pistas", err);
        }
      };
      fetchCourts();
    }
  }, [roleId]);

  // --- 2. BUSCAR RESERVAS AL CAMBIAR FILTROS ---
  useEffect(() => {
    const fetchFilteredReservations = async () => {
      // Solo buscamos si tenemos fecha y pista seleccionada
      if (!bulkDate || !bulkCourt) {
        setFoundReservations([]);
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/admin/reservations?startDate=${bulkDate}&endDate=${bulkDate}&courtId=${bulkCourt}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        // Ordenamos por hora de inicio antes de guardar
        const sortedData = data.sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));
        setFoundReservations(sortedData);
      } catch (err) {
        console.error("Error buscando reservas", err);
      }
    };
    fetchFilteredReservations();
  }, [bulkDate, bulkCourt]);

  // --- FUNCIÓN PARA LA SELECCION DE RESERVAS A ELIMINAR ---
  const toggleSelection = (id: number) => {
    setSelectedResIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id) // Si ya está, la quita
        : [...prev, id]                  // Si no está, la añade
    );
  };

  // --- FUNCIÓN DE BORRADO (INTELIGENTE: INDIVIDUAL O MASIVO) ---
  const handleBulkDelete = async () => {
    // Si hay seleccionadas, borramos esas. Si no, borramos el bloque completo por filtros.
    const isSelective = selectedResIds.length > 0;

    const message = isSelective
      ? `¿Estás seguro de que quieres eliminar las ${selectedResIds.length} reservas seleccionadas?`
      : "⚠️ ¿Estás seguro? Se borrarán TODAS las reservas de esta pista para el día seleccionado.";

    if (!window.confirm(message)) return;

    try {
      const params = new URLSearchParams();

      // Añadimos los filtros de bloque para que el Backend no de problemas
      if (bulkDate) params.append('date', bulkDate);
      if (bulkCourt) params.append('courtId', bulkCourt.toString());
      if (bulkUser) params.append('userId', bulkUser.toString());

      // SI hay seleccionadas, añadimos el parámetro 'ids' adicionalmente 
      if (isSelective) {
        params.append('ids', selectedResIds.join(','));
      }

      const response = await fetch(`http://localhost:3000/api/admin/reservations/bulk-delete?${params.toString()}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ " + result.message);
        // Limpiamos estados para refrescar la vista
        setSelectedResIds([]);
        // Forzamos un refresco de la lista vaciando y volviendo a poner la fecha
        const tempDate = bulkDate;
        setBulkDate('');
        setTimeout(() => setBulkDate(tempDate), 10);
      } else {
        alert("❌ Error: " + result.message);
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };

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
              ? 'Has iniciado sesión como administrador. Acceso total a usuarios, pistas y estadísticas.'
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

                <div className="dash-card" onClick={() => navigate('/admin/statistics')}>
                  <div className="card-icon">📊</div>
                  <div className="card-info">
                    <h3>Estadísticas Globales</h3>
                    <p>Visualiza el uso de las pistas y actividad de los socios.</p>
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

          {/* --- NUEVA SECCIÓN: MANTENIMIENTO DE RESERVAS (SOLO VISIBLE PARA ADMIN) --- */}
          {roleId === 2 && (
            <div className="maintenance-panel">
              <h3>🛠️ Mantenimiento Rápido de Reservas</h3>
              <div className="maintenance-grid">
                <div className="input-group">
                  <label htmlFor="bulk-date">Fecha:</label>
                  <input
                    id="bulk-date"
                    type="date"
                    value={bulkDate}
                    onChange={(e) => setBulkDate(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  {/* MODIFICADO: Input de ID cambiado por Select con nombres de pistas */}
                  <label htmlFor="bulk-court">Pista:</label>
                  <select
                    id="bulk-court"
                    value={bulkCourt}
                    onChange={(e) => setBulkCourt(e.target.value)}
                  >
                    <option value="">-- Seleccionar --</option>
                    {courts.map((court) => (
                      <option key={court.id} value={court.id}>
                        ID:{court.id} - {court.name} ({court.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="bulk-user">ID Usuario (opcional):</label>
                  <input
                    id="bulk-user"
                    type="number"
                    placeholder="Ej: 5"
                    value={bulkUser}
                    onChange={(e) => setBulkUser(e.target.value)}
                  />
                </div>
                <button className="btn-bulk-delete" onClick={handleBulkDelete}>
                  ELIMINAR BLOQUE
                </button>
              </div>

              {/* --- AÑADIDO: LISTADO DINÁMICO DE RESERVAS ENCONTRADAS --- */}
              {foundReservations.map((res: any) => (
                <div
                  key={res.id}
                  className={`res-mini-card selectable ${selectedResIds.includes(res.id) ? 'is-selected' : ''}`}
                  // ESTA LÍNEA ES LA QUE ACTIVA EL CLIC
                  onClick={() => toggleSelection(res.id)}
                >
                  {/* Contenido de la card... */}
                  <div className="res-selection-indicator">
                    {selectedResIds.includes(res.id) ? '✅' : '⬜'}
                  </div>
                  <span className="res-time">{res.start_time.substring(0, 5)} - {res.end_time.substring(0, 5)}</span>
                  <span className="res-user">Socio: <strong>{res.user_name}</strong></span>
                </div>
              ))}

              {/* AVISO SI NO HAY RESERVAS */}
              {bulkDate && bulkCourt && foundReservations.length === 0 && (
                <p className="no-res-info">No hay reservas para esta pista en la fecha seleccionada.</p>
              )}
            </div>
          )}

          <p className="text-secondary">Selecciona una opción para comenzar.</p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;