//Es el componente visual

import type { Court } from '../services/courts.service'

interface Props {
  court: Court;
  isAdmin: boolean;
}

const CourtCard = ({ court, isAdmin }: Props) => {
  return (
    <div className="court-card">
      <h3>{court.name}</h3>
      <p>{court.type.toUpperCase()} - {court.surface}</p>
      <p>Horario: {court.opening_time} a {court.closing_time}</p>
      {isAdmin ? (
        <button className="btn-admin">Editar Pista</button>
      ) : (
        <button className="btn-reserve" disabled={!court.active}>
          {court.active ? 'Reservar' : 'No disponible'}
        </button>
      )}
    </div>
  );
};

export default CourtCard;