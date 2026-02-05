// Pantalla de Administración -> Gestión total de pistas

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourts } from '../../services/courts.service';
import type { Court } from '../../services/courts.service';
import CourtCard from '../../components/CourtCard';
import { useAuth } from '../../auth/AuthContext';
import '../../styles/courts.css'; // <--- Compartimos los mismos estilos

const AdminCourtsPage = () => {
  // 1. Estado para las pistas
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { roleId } = useAuth();
  const navigate = useNavigate();

  // 2. Carga de datos inicial
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const data = await getCourts();
        setCourts(data);
      } catch (error) {
        console.error("Error al obtener pistas para el admin");
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  if (loading) return <div className="loading">Cargando panel de administración...</div>;

  return (
    <div className="courts-container">
      <button onClick={() => navigate('/dashboard')} className="btn-back">
        ← Volver al Dashboard
      </button>

      <header className="courts-header">
        {/* AQUÍ ES DONDE LO PONES: Usamos roleId para que desaparezca la advertencia */}
        <h2>Panel de Gestión de Pistas (Rol: {roleId})</h2>        
        <p>Como Administrador, puedes editar o añadir nuevas instalaciones.</p>
        {/* Botón exclusivo para Admin ahora con clase CSS y navegación programada */}
            <button 
              className="btn-primary btn-add-court"
              onClick={() => navigate('/admin/add-court')} // <--- ACCIÓN: Redirige al formulario de creación
            >
              + Añadir Nueva Pista
            </button>
      </header>

      {/* 3. Renderizado de tarjetas con isAdmin={true} forzado */}
      <div className="courts-grid">
        {courts.length > 0 ? (
          courts.map((court) => (
            <CourtCard 
              key={court.id} 
              court={court} 
              isAdmin={true} // <--- Aquí siempre es true
            />
          ))
        ) : (
          <p>No hay pistas registradas en el sistema.</p>
        )}
      </div>
    </div>
  );
};

export default AdminCourtsPage;