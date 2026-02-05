//Es el componente visual

import { useNavigate } from 'react-router-dom'; // <--- Importamos para la navegación
import type { Court } from '../services/courts.service'

interface Props {
  court: Court;
  isAdmin: boolean;
}

const CourtCard = ({ court, isAdmin }: Props) => {
  const navigate = useNavigate(); // <--- Inicializamos el hook de navegación

  // Función para manejar el clic según el rol
  const handleAction = () => {
    if (isAdmin) {
      // Caso de uso: Gestionar pistas (Modificación)
      // Redirigimos a la ruta de edición pasando el ID de la pista
      navigate(`/admin/edit-court/${court.id}`);
    } else {
      // Caso de uso: Crear reserva
      // Redirigimos a la página de reserva para esta pista específica
      navigate(`/reservar/${court.id}`);
    }
  };

  return (
    <div className="court-card">
      <h3>{court.name}</h3>
      <p>{court.type.toUpperCase()} - {court.surface}</p>
      <p>Horario: {court.opening_time} a {court.closing_time}</p>
      
      {isAdmin ? (
        /* Botón para Administrador: Gestionar pistas */
        <button 
          className="btn-admin" 
          onClick={handleAction}
        >
          Editar Pista
        </button>
      ) : (
        /* Botón para Usuario: Crear reserva */
        <button 
          className="btn-reserve" 
          disabled={!court.active}
          onClick={handleAction}
        >
          {court.active ? 'Reservar' : 'No disponible'}
        </button>
      )}
    </div>
  );
};

export default CourtCard;