//La Pantalla de Usuario-> Es la página que une todo

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Añadimos para poder volver atrás
import { getCourts } from '../../services/courts.service';
import type { Court } from '../../services/courts.service';
import CourtCard from '../../components/CourtCard';
import { useAuth } from '../../auth/AuthContext';
import '../../styles/courts.css'; // <--- Estilos de las tarjetas de pistas

const CourtsPage = () => {
  // 1. Estado para guardar las pistas
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Extraemos el roleId para pasárselo a la tarjeta (aunque aquí será siempre User)
  const { roleId } = useAuth();
  const navigate = useNavigate(); // <--- Inicializamos el navegador

  // 2. useEffect para llamar al backend al cargar la página
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const data = await getCourts();
        setCourts(data);
      } catch (error) {
        console.error("Error al obtener pistas");
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  if (loading) return <div className="loading">Cargando pistas disponibles...</div>;

  return (
    <div className="courts-container">
      {/* Botón para volver al Dashboard */}
      <button 
        onClick={() => navigate('/dashboard')} 
        className="btn-back"      >
        ← Volver al Panel
      </button>

      <header className="courts-header">
        <h2>Pistas Disponibles</h2>
        <p>Selecciona una pista para realizar tu reserva</p>
      </header>

      {/* 3. Recorremos el array y pintamos las tarjetas */}
      <div className="courts-grid">
        {courts.length > 0 ? (
          courts.map((court) => (
            <CourtCard 
              key={court.id} 
              court={court} 
              isAdmin={roleId === 2} 
            />
          ))
        ) : (
          <p>No hay pistas disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
};

export default CourtsPage;